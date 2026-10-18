import { DatabaseSync } from 'node:sqlite';
import { drizzle } from 'drizzle-orm/node-sqlite';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';

const sqlite = new DatabaseSync('/data/users.db');
const db = drizzle({ client: sqlite });
const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull().unique(),
  pseudo: text('pseudo').notNull(),
  avatar: text('avatar').notNull().default('human'),
  language: text('language').notNull().default('fr'),
  password_salt: text('password_salt').notNull(),
  password_hash: text('password_hash').notNull(),
});
sqlite.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  pseudo TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'human',
  language TEXT NOT NULL DEFAULT 'fr',
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL
)`);

export function findUserByEmail(email) {
  return db.select().from(users).where(eq(users.email, email)).get();
}

export function findUserById(id) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export function insertUser(email, pseudo, salt, hash, language = 'fr') {
  try {
    return db.insert(users).values({
      email,
      pseudo,
      language,
      password_salt: salt,
      password_hash: hash,
    }).returning().get();
  } catch (error) {
    if (error.cause) {
      throw error.cause;
    }
    throw error;
  }
}

export function updateProfile(id, pseudo, avatar, language) {
  return db.update(users).set({ pseudo, avatar, language })
    .where(eq(users.id, id)).returning().get();
}

export function deleteUser(id) {
  db.delete(users).where(eq(users.id, id)).run();
}
