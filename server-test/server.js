import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { moderateMessage } from './moderation.js';

const CHAT_MAX_LENGTH = 200;
const CHAT_RATE_LIMIT = 5;
const CHAT_RATE_WINDOW = 5000;  

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

let waitingPlayer = null;
const rooms = new Map();
const DISCONNECT_GRACE_PERIOD = 20000;
const disconnectTimers = new Map();
const ROUND_READY_TIMEOUT = 15000;
const roundReadyTimers = new Map();

io.on('connection', (socket) => {
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
    } else {
      waitingPlayer = { playerId, socket };
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
    socket.to(data.roomId).emit('opponent:move', data);
  });

  socket.on('player:shoot', (data) => {
    socket.to(data.roomId).emit('opponent:shoot', data);
  });

  socket.on('player:hit', (data) => {
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
      socket.emit('chat:blocked', { reason: 'Trop de messages' });
      return
    }
    
    socket.data.chatTimestamps.push(now);
    
    let verdict;
    try {
      verdict = await moderateMessage(text, {playerId: socket.data.playerId, roomId });
    } catch (err) {
      console.error('Erreur moderation:', err);
      verdict = { allowed: false, reason: `Moderation indisponible` };
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
    console.log(`Deconnecte : ${socket.id} (playerId: ${socket.data.playerId})`);

    if (waitingPlayer && waitingPlayer.socket === socket) {
      waitingPlayer = null;
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