import { io } from 'socket.io-client';

let socket = null;
let roomId = null;

function getPlayerId() {
  let playerId = sessionStorage.getItem('playerId');
  if (!playerId) {
    playerId = 'player-' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('playerId', playerId);
  }
  return playerId;
}

export function connectToServer(callbacks) {
  const playerId = getPlayerId();
  const savedRoomId = sessionStorage.getItem('currentRoomId');

  socket = io('http://localhost:3001', {
    auth: { playerId, roomId: savedRoomId || null },
  });

  socket.on('round:start', () => {
    callbacks.onRoundStart();
  });

  socket.on('waiting', () => {
    console.log('En attente d\'un adversaire...');
  });

  socket.on('match:start', (data) => {
    roomId = data.roomId;
    sessionStorage.setItem('currentRoomId', roomId);
    console.log('Match trouve !', data);
    callbacks.onMatchStart(data);
  });

  socket.on('match:resumed', (data) => {
    roomId = data.roomId;
    console.log('Partie reprise !', data);
    callbacks.onMatchResumed(data);
  });

  socket.on('opponent:move', (data) => callbacks.onOpponentMove(data));
  socket.on('opponent:shoot', (data) => callbacks.onOpponentShoot(data));
  socket.on('hit:received', (data) => callbacks.onOpponentHit(data));

  socket.on('opponent:disconnected', () => {
    console.log('Adversaire deconnecte, en attente de reconnexion...');
    callbacks.onOpponentDisconnected();
  });

  socket.on('opponent:reconnected', () => {
    console.log('Adversaire reconnecte !');
    callbacks.onOpponentReconnected();
  });

  socket.on('match:abandoned', () => {
    console.log('Partie abandonnee, adversaire non revenu.');
    sessionStorage.removeItem('currentRoomId');
    callbacks.onMatchAbandoned();
  });

  return socket;
}

export function sendPosition(x, y, z, rotationY, isSliding) {
  if (!socket || !roomId) return;
  socket.emit('player:move', { roomId, x, y, z, rotationY, isSliding });
}

export function sendHit(damage) {
  if (!socket || !roomId) return;
  socket.emit('player:hit', { roomId, damage });
}

export function sendReady() {
  if (!socket || !roomId) return;
  socket.emit('player:ready', { roomId });
}

export function sendShoot(isMoving) {
  if (!socket || !roomId) return;
  socket.emit('player:shoot', { roomId, isMoving });
}