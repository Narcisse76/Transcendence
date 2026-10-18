import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { moderateMessage } from './moderation.js';
import prometheus_client from 'prom-client';
import { installAccountRoutes } from './routes.js';
import { installSocketAccount } from './socket-account.js';

const CHAT_MAX_LENGTH = 200;
const CHAT_RATE_LIMIT = 5;
const CHAT_RATE_WINDOW = 5000;

const app = express();
const register = new prometheus_client.Registry();
prometheus_client.collectDefaultMetrics({
  register,
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const connectedPlayers = new prometheus_client.Gauge({
  name: 'game_connected_players',
  help: 'Number of currently connected players',
   registers: [register],
});

const activeRooms = new prometheus_client.Gauge({
  name: 'game_active_rooms',
  help: 'Number of active game rooms',
  registers: [register],
});
const waitingPlayers = new prometheus_client.Gauge({
  name: 'game_waiting_players',
  help: 'Number of players waiting for a match',
  registers: [register],
});
const playerMoves = new prometheus_client.Counter({
  name: 'game_player_moves_total',
  help: 'Total number of player movement events',
  registers: [register],
});
const playerShots = new prometheus_client.Counter({
  name: 'game_player_shots_total',
  help: 'Total number of player shots',
  registers: [register],
});
const playerHits = new prometheus_client.Counter({
  name: 'game_player_hits_total',
  help: 'Total number of player hit events',
  registers: [register],
});
app.use(express.json({ limit: '16kb' }));
installAccountRoutes(app, io);
installSocketAccount(io);

let waitingPlayer = null;
connectedPlayers.set(0);
activeRooms.set(0);
waitingPlayers.set(0);
const rooms = new Map();
const DISCONNECT_GRACE_PERIOD = 20000;
const disconnectTimers = new Map();
const ROUND_READY_TIMEOUT = 15000;
const roundReadyTimers = new Map();

io.on('connection', (socket) => {
  connectedPlayers.inc();
  const playerId = socket.data.user.id;
  const { roomId: rejoinRoomId } = socket.handshake.auth;
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

      const socketsInRoom = io.sockets.adapter.rooms.get(rejoinRoomId)?.size ?? 0;
      if (socketsInRoom < 2) {
        console.log(`${playerId}: opponent absent from ${rejoinRoomId}, no round:start`);
        socket.emit('opponent:disconnected');
      } else {
        room.readyPlayers.clear();
        if (roundReadyTimers.has(rejoinRoomId)) {
          clearTimeout(roundReadyTimers.get(rejoinRoomId));
          roundReadyTimers.delete(rejoinRoomId);
        }
        console.log(`round:start sent to ${rejoinRoomId}`);
        io.to(rejoinRoomId).emit('round:start');
      }

      console.log(`${playerId} reconnected to ${rejoinRoomId}`);
      reconnected = true;
    }
  }

  if (!reconnected) {
    if (waitingPlayer && (!waitingPlayer.socket.connected || waitingPlayer.playerId === playerId)) {
      waitingPlayer = null;
    }

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

      console.log(`Match created : ${roomId}`);
      waitingPlayer = null;

    } else {
      waitingPlayer = { playerId, socket };
	  waitingPlayers.set(1);
      socket.data.playerId = playerId;
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
          console.log(`Timeout ready pour ${data.roomId}, round force start`);
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
	playerShots.inc();
    socket.to(data.roomId).emit('opponent:shoot', data);
  });

  socket.on('player:hit', (data) => {
	playerHits.inc();
    socket.to(data.roomId).emit('hit:received', { damage: data.damage });
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

  socket.on('match:leave', (data, ack) => {
    const roomId = socket.data.roomId;
    if (roomId && rooms.has(roomId)) {
      rooms.delete(roomId);
      if (roundReadyTimers.has(roomId)) {
        clearTimeout(roundReadyTimers.get(roomId));
        roundReadyTimers.delete(roomId);
      }
      console.log(`Room ${roomId} closed (a played quit after end of round)`);
    }
    socket.data.roomId = null;
    if (typeof ack === 'function') ack();
  });

  socket.on('disconnect', () => {
	connectedPlayers.dec();
    console.log(`disconnected : ${socket.id} (playerId: ${socket.data.playerId})`);

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
        socket.to(roomId).emit('match:abandonned');
        rooms.delete(roomId);
		activeRooms.set(rooms.size);
        disconnectTimers.delete(socket.data.playerId);
        console.log(`Room ${roomId} closed (no reconnexion)`);
      }, DISCONNECT_GRACE_PERIOD);

      disconnectTimers.set(socket.data.playerId, timer);
    }
  });
});

httpServer.listen(3001, () => {
  console.log('WebSocket server on port 3001');
});
