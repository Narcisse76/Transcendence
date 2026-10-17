# Database Schema

Account data uses **SQLite**, chosen for its simple single-file storage, with **Drizzle ORM** for CRUD operations.

Table: `users`

| Field | Type / purpose |
| --- | --- |
| `id` | INTEGER, primary key |
| `email` | TEXT, required and unique |
| `pseudo` | TEXT, required |
| `avatar` | TEXT, avatar identifier; default: `human` |
| `language` | TEXT, language code; default: `fr` |
| `password_salt` | TEXT, random salt |
| `password_hash` | TEXT, scrypt hash encoded as hexadecimal |

The file `/data/users.db` persists in the Docker volume `users_data`. This account schema has one table and no table relationships. Sessions are stored in server memory, not SQLite, and are lost when the server restarts.
