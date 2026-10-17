import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const connections = new Map();

const DURATION = 8 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true, secure: true, sameSite: 'strict', path: '/',
};

export async function hashPassword(password, salt) {
  const hash = await scryptAsync(password, salt, 64, {
    N: 65536, r: 8, p: 2, maxmem: 134217728,
  });
  return hash.toString('hex');
}

export async function passwordMatches(password, user) {
  const candidate = await hashPassword(password, user.password_salt);
  return timingSafeEqual(
    Buffer.from(candidate, 'hex'),
    Buffer.from(user.password_hash, 'hex'),
  );
}

export function publicProfile(user) {
  return {
    id: String(user.id), pseudo: user.pseudo,
    avatar: user.avatar, language: user.language,
  };
}

export function startConnection(userId, res) {
  const ticket = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + DURATION;
  connections.set(ticket, { userId, expiresAt });
  res.cookie('session', ticket, { ...cookieOptions, maxAge: DURATION });
}

export function readConnection(cookieHeader = '') {
  const cookies = cookieHeader.split(';');
  const cookie = cookies.find(value => value.trim().startsWith('session='));
  if (!cookie) return null;
  const ticket = cookie.trim().slice('session='.length);
  const connection = connections.get(ticket);
  if (!connection || connection.expiresAt <= Date.now()) return null;
  return { ticket, userId: connection.userId };
}

export function endConnection(ticket, io) {
  connections.delete(ticket);
  io.in('session:' + ticket).disconnectSockets(true);
}

export function endUserConnections(userId, io) {
  for (const [ticket, connection] of connections) {
    if (connection.userId === userId) {
      endConnection(ticket, io);
    }
  }
}

export function clearConnectionCookie(res) {
  res.clearCookie('session', cookieOptions);
}

export function newSalt() {
  return randomBytes(16).toString('hex');
}
