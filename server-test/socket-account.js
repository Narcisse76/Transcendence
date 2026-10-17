import { readConnection, publicProfile } from './auth.js';
import { findUserById } from './database.js';

export function installSocketAccount(io) {
  const activePlayers = new Set();
  io.use((socket, next) => {
    const connection = readConnection(socket.handshake.headers.cookie);
    let user = null;

    if (connection) {
      user = findUserById(connection.userId);
    }

    if (!user) return next(new Error('LOGIN_REQUIRED'));
    const playerId = String(user.id);
    if (activePlayers.has(playerId)) return next(new Error('ALREADY_PLAYING'));
    socket.data.user = publicProfile(user);
    socket.data.ticket = connection.ticket;
    next();
  });
  io.on('connection', socket => {
    const playerId = socket.data.user.id;
    activePlayers.add(playerId);
    socket.join('session:' + socket.data.ticket);
    socket.emit('account:ready', socket.data.user);
    socket.on('disconnect', () => activePlayers.delete(playerId));
  });
}
