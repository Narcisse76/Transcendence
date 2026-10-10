import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { moderateMessage } from './moderation.js';
import client from 'prom-client';

const CHAT_MAX_LENGTH = 200;
const CHAT_RATE_LIMIT = 5;
const CHAT_RATE_WINDOW = 5000;  

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: { origin: '*' }
});

const register = new client.Registry();
client.collectDefaultMetrics({
	register,
});

const connectedPlayers = new client.Gauge({
	name: 'game_connected_players',
	help: 'Number of currently connected players',
	registers: [register],
});

const activeRooms = new client.Gauge({
	name: 'game_active_rooms',
	help: 'Number of active game rooms',
	registers: [register],
});

const waitingPlayers = new client.Gauge({
	name: 'game_waiting_players',
	help: 'Number of players waiting for a match',
	registers: [register],
});

const playerMoves = new client.Counter({
	name: 'game_player_moves_total',
	help: 'Total number of player movement events',
	registers: [register],
});

const playerShots = new client.Counter({
	name: 'game_player_shots_total',
	help: 'Total number of player shots',
	registers: [register],
});

const playerHits = new client.Counter({
	name: 'game_player_hits_total',
	help: 'Total number of player hit events',
	registers: [register],
});

app.get('/metrics', async (req, res) => 
	{
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
	});

let waitingPlayer = null;
const rooms = new Map();
const DISCONNECT_GRACE_PERIOD = 20000;
const disconnectTimers = new Map();
const ROUND_READY_TIMEOUT = 15000;
const roundReadyTimers = new Map();

io.on('connection', (socket) => {
	connectedPlayers.inc();
	const { playerId, roomId: rejoinRoomId } = socket.handshake.auth;
	socket.data.chatTimestamps = [];

	console.log(`Connexion : ${socket.id} (playerId: ${playerId})`);

	let reconnected = false;

	if (rejoinRoomId && rooms.has(rejoinRoomId)) {
		const room = rooms.get(rejoinRoomId);

		if (room.players.includes(playerId)) {
			if (disconnectTimers.has(playerId)) {
				clearTimeout(disconnectTimers.get(playerId));
				disconnectTimers.delete(playerId);
			}

			socket.join(rejoinRoomId);
			socket.data.playerId = playerId;
			socket.data.roomId = rejoinRoomId;

			socket.emit('match:resumed', { roomId: rejoinRoomId, spawnIndex: room.spawnIndexes[playerId] });
			socket.to(rejoinRoomId).emit('opponent:reconnected');

			console.log(`${playerId} reconnecte a ${rejoinRoomId}`);
			reconnected = true;
		}
	}

	if (!reconnected) {
		if (waitingPlayer) {
			const roomId = `match-${waitingPlayer.playerId}-${playerId}`;
			const room = {
				players: [waitingPlayer.playerId, playerId],
				spawnIndexes: { [waitingPlayer.playerId]: 0, [playerId]: 1 },
				readyPlayers: new Set(),
			};
			rooms.set(roomId, room);
			activeRooms.set(rooms.size);

			waitingPlayer.socket.join(roomId);
			waitingPlayer.socket.data.playerId = waitingPlayer.playerId;
			waitingPlayer.socket.data.roomId = roomId;
			socket.join(roomId);
			socket.data.playerId = playerId;
			socket.data.roomId = roomId;

			waitingPlayer.socket.emit('match:start', { roomId, opponentId: playerId, spawnIndex: 0 });
			socket.emit('match:start', { roomId, opponentId: waitingPlayer.playerId, spawnIndex: 1 });

			console.log(`Match cree : ${roomId}`);
			waitingPlayer = null;
			waitingPlayers.set(0);
		} else {
			waitingPlayer = { playerId, socket };
			waitingPlayers.set(1);
			socket.emit('waiting');
		}
	}

	socket.on('player:ready', (data) => {
		const room = rooms.get(data.roomId);
		if (!room) return;

		room.readyPlayers.add(socket.data.playerId);

		if (room.readyPlayers.size >= 2) {
			if (roundReadyTimers.has(data.roomId)) {
				clearTimeout(roundReadyTimers.get(data.roomId));
				roundReadyTimers.delete(data.roomId);
			}
			io.to(data.roomId).emit('round:start');
			room.readyPlayers.clear();
		} else {
			if (!roundReadyTimers.has(data.roomId)) {
				const timer = setTimeout(() => {
					console.log(`Timeout ready pour ${data.roomId}, demarrage force de la manche`);
					io.to(data.roomId).emit('round:start');
					room.readyPlayers.clear();
					roundReadyTimers.delete(data.roomId);
				}, ROUND_READY_TIMEOUT);
				roundReadyTimers.set(data.roomId, timer);
			}
		}
	});

	socket.on('player:move', (data) => {
		playerMoves.inc();
		socket.to(data.roomId).emit('opponent:move', data);
	});

	socket.on('player:shoot', (data) => {
		playerShots.inc();ss
		socket.to(data.roomId).emit('opponent:shoot', data);
	});

	socket.on('player:hit', (data) => {
		playerHits.inc();
		socket.to(data.roomId).emit('hit:received', {
			damage: data.damage
		});
	});

	socket.on('chat:send', async(data) => {
		const roomId = socket.data.roomId;
		if (!roomId || !rooms.has(roomId)) return;
		if (typeof data?.text !== 'string') return;

		const text = data.text.trim().slice(0, CHAT_MAX_LENGTH);
		if (!text) return;

		const now = Date.now();
		socket.data.chatTimestamps = socket.data.chatTimestamps.filter((t) => now - t < CHAT_RATE_WINDOW);
		if (socket.data.chatTimestamps.length >= CHAT_RATE_LIMIT) {
			socket.emit('chat:blocked', { reason: 'too many messages' });
			return
		}

		socket.data.chatTimestamps.push(now);

		let verdict;
		try {
			verdict = await moderateMessage(text, {playerId: socket.data.playerId, roomId });
		} catch (err) {
			console.error('Moderation error:', err);
			verdict = { allowed: false, reason: `Moderation unavailable` };
		}

		if (!verdict.allowed) {
			socket.emit('chat:blocked', { reason: verdict.reason });
			return;
		}

		io.to(roomId).emit('chat:message', {
			from: socket.data.playerId,
			text: verdict.text ?? text,
			timestamp: now
		})
	})

	socket.on('disconnect', () => {
		connectedPlayers.dec();
		console.log(`Deconnecte : ${socket.id} (playerId: ${socket.data.playerId})`);

		if (waitingPlayer && waitingPlayer.socket === socket) {
			waitingPlayer = null;
			waitingPlayers.set(0);
			return;
		}

		if (roundReadyTimers.has(socket.data.roomId)) {
			clearTimeout(roundReadyTimers.get(socket.data.roomId));
			roundReadyTimers.delete(socket.data.roomId);
		}

		const roomId = socket.data.roomId;
		if (roomId && rooms.has(roomId)) {
			socket.to(roomId).emit('opponent:disconnected');

			const timer = setTimeout(() => {
				socket.to(roomId).emit('match:abandoned');
				rooms.delete(roomId);
				activeRooms.set(rooms.size);
				disconnectTimers.delete(socket.data.playerId);
				console.log(`Room ${roomId} fermee (pas de reconnexion)`);
			}, DISCONNECT_GRACE_PERIOD);

			disconnectTimers.set(socket.data.playerId, timer);
		}
	});
});

httpServer.listen(3001, () => {
	console.log('Serveur WebSocket sur le port 3001');
});
