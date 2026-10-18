import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('/data/users.db', { readOnly: true });

const users = db.prepare(
  'SELECT id, email, pseudo, avatar, language FROM users'
).all();

console.table(users);
db.close();
