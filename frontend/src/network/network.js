import { io } from 'socket.io-client';

let socket = null;
let roomId = null;

let currentUser = null;

export function getPlayerId() {
  return currentUser?.id ?? null;
}

export function connectToServer(callbacks) {
  const navType = performance.getEntriesByType('navigation')[0]?.type;
  if (navType !== 'reload') sessionStorage.removeItem('currentRoomId');

  socket = io(undefined, {
    transports: ['websocket'],
    auth: (cb) => {
      cb({ roomId: sessionStorage.getItem('currentRoomId') || null });
    },
  });

  socket.on('account:ready', user => {
    currentUser = user;
  });

  socket.on('connect_error', error => {
    if (error.message === 'LOGIN_REQUIRED') window.location.href = '/';
    if (error.message === 'ALREADY_PLAYING') {
      window.alert('Ce compte est déjà en jeu dans un autre onglet.');
      window.location.href = '/';
    }
  });
  socket.on('disconnect', reason => {
    if (reason === 'io server disconnect') window.location.href = '/';
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

  // dagouill : added from AI-moderation branch
  socket.on('chat:message', (data) => callbacks.onChatMessage(data));
  socket.on('chat:blocked', (data) => callbacks.onChatBlocked(data));
  // ---

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

// dagouill : added from AI-moderation branch
export function sendChat(text) {
  if (!socket || !roomId) return;
  socket.emit('chat:send', { text });
}

export function leaveMatch(onDone) {
  sessionStorage.removeItem('currentRoomId');
  if (!socket || !roomId) {
    onDone();
    return;
  }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onDone();
  };
  socket.emit('match:leave', {}, finish);
  setTimeout(finish, 500);
}
