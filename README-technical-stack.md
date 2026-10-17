# Technical Stack

| Part | Technologies |
| --- | --- |
| Menu | React, TypeScript, Tailwind CSS and Vite |
| FPS and real-time networking | JavaScript, Three.js and Socket.IO |
| Accounts | Node.js 24, Express, native crypto functions, SQLite and Drizzle ORM |
| Existing backend | NestJS and PostgreSQL; account data is stored separately in SQLite |
| Infrastructure | Docker Compose, Nginx, ModSecurity, HashiCorp Vault, Prometheus and Grafana |

React keeps menu screens organized. SQLite stores accounts without another database service, and Drizzle provides simple CRUD queries. The existing Socket.IO server verifies the session cookie before allowing a player to join the game.
