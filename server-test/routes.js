import { findUserByEmail, findUserById, insertUser, updateProfile, deleteUser } from './database.js';
import { newSalt, hashPassword, passwordMatches, publicProfile,
  startConnection, readConnection, endConnection, endUserConnections, clearConnectionCookie } from './auth.js';

export function installAccountRoutes(app, io) {
  app.post('/api/account/register', async (req, res) => {
    const { email, pseudo, password, language = 'fr' } = req.body ?? {};
    if (typeof email !== 'string' || typeof pseudo !== 'string' ||
        typeof password !== 'string' || password.length < 5 ||
        password.length > 128 || pseudo.trim().length < 1 ||
        pseudo.length > 24 || !['fr', 'en', 'es'].includes(language) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'INVALID_FIELDS' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (findUserByEmail(normalizedEmail)) {
      return res.status(409).json({ error: 'EMAIL_USED' });
    }
    const salt = newSalt();
    const hash = await hashPassword(password, salt);
    let user;
    try {
      user = insertUser(normalizedEmail, pseudo.trim(), salt, hash, language);
    } catch (error) {
      if (error.errstr === 'constraint failed') {
        return res.status(409).json({ error: 'EMAIL_USED' });
      }
      throw error;
    }
    startConnection(user.id, res);
    res.status(201).json(publicProfile(user));
  });

  app.post('/api/account/login', async (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string' ||
        password.length > 128) {
      return res.status(400).json({ error: 'INVALID_FIELDS' });
    }
    const user = findUserByEmail(email.trim().toLowerCase());
    if (!user || !(await passwordMatches(password, user))) {
      return res.status(401).json({ error: 'LOGIN_FAILED' });
    }
    startConnection(user.id, res);
    res.json(publicProfile(user));
  });

  app.get('/api/account/me', (req, res) => {
    const connection = readConnection(req.headers.cookie);
    const user = connection && findUserById(connection.userId);
    if (!user) return res.status(401).json({ error: 'LOGIN_REQUIRED' });
    res.json(publicProfile(user));
  });

  app.put('/api/account/profile', (req, res) => {
    const connection = readConnection(req.headers.cookie);
    if (!connection) return res.status(401).json({ error: 'LOGIN_REQUIRED' });
    const { pseudo, avatar, language } = req.body ?? {};
    if (typeof pseudo !== 'string' || !pseudo.trim() || pseudo.length > 24 ||
        !['human', 'robot', 'cat', 'alien'].includes(avatar) ||
        !['fr', 'en', 'es'].includes(language)) {
      return res.status(400).json({ error: 'INVALID_FIELDS' });
    }
    const user = updateProfile(connection.userId, pseudo.trim(), avatar, language);
    if (!user) return res.status(401).json({ error: 'LOGIN_REQUIRED' });
    res.json(publicProfile(user));
  });

  app.delete('/api/account/me', (req, res) => {
    const connection = readConnection(req.headers.cookie);
    if (!connection) return res.status(401).json({ error: 'LOGIN_REQUIRED' });
    deleteUser(connection.userId);
    endUserConnections(connection.userId, io);
    clearConnectionCookie(res);
    res.sendStatus(204);
  });

  app.post('/api/account/logout', (req, res) => {
    const connection = readConnection(req.headers.cookie);
    if (connection) endConnection(connection.ticket, io);
    clearConnectionCookie(res);
    res.sendStatus(204);
  });
}
