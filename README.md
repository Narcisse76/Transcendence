## Game: first-person 1v1 shooter (by trambure)

### Description

A real-time 3D first-person shooter played 1v1 in the browser. Two players are matched automatically, spawn on opposite sides of a small arena, and fight a best-of-5 match: the first player to win 3 rounds wins. A round is won by eliminating the opponent (4 hits at 25 damage on 100 HP).

### Features

- 3D first-person view (Three.js) with mouse look (Pointer Lock API)
- Movement: walk, sprint, jump, and an omnidirectional slide with a cooldown
- Hitscan shooting with a 12-round magazine, fire rate limit, reload timer, recoil, tracers and impact markers
- Animated 3D weapon and opponent models (glTF), with idle / run / shoot / roll animations synchronized from network events
- Automatic matchmaking, two distinct spawn points, synchronized 3-second countdown before each round
- Round and match system with HUD (health bar, ammo, score) and end-of-round / end-of-match screens
- Reconnection: a player who reloads or loses connection has 20 seconds to come back, otherwise the match is abandoned
- If only one player confirms the next round, the server starts it after 15 seconds
- In-game chat (see the chat/moderation part of this README)

### Controls

| Action | Key |
|---|---|
| Move | W/A/S/D (physical keys, so Z/Q/S/D on AZERTY) |
| Sprint | Left Shift |
| Jump | Space |
| Slide | C |
| Shoot | Left mouse button |
| Reload | R |

### Architecture

- `frontend/src/main.js`: orchestration and main loop only
- `frontend/src/game/`: movement, physics, collisions, shooting, ammo, recoil, effects, round flow, opponent animation controller
- `frontend/src/network/`: Socket.io client (`network.js`) and the glue between network events and game logic (`gamenetwork.js`)
- `frontend/src/maps/`: arena defined as data (walls, spawns), turned into meshes and collision boxes
- `frontend/src/ui/`: HUD, end screen, round score
- `server-test/server.js`: Socket.io game server (matchmaking, rooms, relay of positions/shots/hits, reconnection, ready timeout)

### Technical choices

- **Three.js without a physics engine**: gravity, jump and slide are hand-written, collisions use axis-aligned boxes tested per axis (so the player slides along walls). The game only needs simple movement and hitscan bullets.
- **Socket.io forced to WebSocket transport**: the WAF blocks the `text/plain` POST requests of the polling transport (rule 920420).
- **Client-authoritative hits**: each client raycasts its own shots and reports hits to the server, which relays them. This is simple and responsive but not cheat-proof. See limitations.
- **Models**: made in Blender and exported as `.glb`. TODO: credits and licenses for the character pack and the rifle model.

## Module: Frameworks for frontend and backend (by abignals)

| Part | Stack | Location |
|------|-------|----------|
| Menu / UI | **React 19** + TypeScript, Tailwind CSS, Vite | `frontend/menu/` |
| Game client | Three.js (3D rendering), Vite | `frontend/src/` |
| API backend | **NestJS 11** (TypeScript, Express adapter) | `backend/` |
| Game server | Express 5 + Socket.io | `server-test/` |

- **React** handles the menu screens (login, signup, profile, controls) as reusable components.
- **NestJS** exposes the REST API under the `/api` prefix (e.g. `GET /api/health`), organised in modules and controllers.

## Module: Real-time features (WebSockets)

Real-time communication uses **Socket.io** over WebSocket (`transports: ['websocket']`).

- **Server:** `server-test/server.js` — **Client:** `frontend/src/network/network.js`
- **Nginx** forwards `/socket.io/` with the `Upgrade` headers, and ModSecurity is configured to allow the WebSocket upgrade.

**What runs in real time**
- **Matchmaking:** players wait in a queue (`waiting`) until an opponent is found (`match:start`), then play in a shared room.
- **Gameplay:** positions, shots and hits are relayed instantly (`player:move`, `player:shoot`, `player:hit` → `opponent:*`, `hit:received`).
- **Rounds:** a round starts when both players are ready, or after 15 s (`round:start`).
- **In-game chat:** `chat:send` / `chat:message`, max 200 chars, rate-limited to 5 messages per 5 s, with moderation.

**Connection handling**
- The socket handshake is authenticated with the session cookie (`LOGIN_REQUIRED` if not logged in), and a single account cannot play in two tabs at once (`ALREADY_PLAYING`).
- If a player disconnects, the opponent is notified and the room is kept for **20 s**: reloading the page resumes the match (`match:resumed`), otherwise the match is abandoned (`match:abandoned`).
- Leaving a match (`match:leave`) and disconnects are cleaned up server-side.

## Module: Hardened WAF / ModSecurity (by dagouill)

### What is ModSecurity?
ModSecurity is an open-source Web Application Firewall (WAF) engine that intercepts HTTP/HTTPS requests before they hit your backend application. It operates at Layer 7 (Application Layer).

### OWASP Core Rule Set (CRS)
The OWASP CRS is a collection of generic attack detection rules designed to catch known and unknown vulnerabilities with minimal false positives. It uses **collaborative detection (anomaly scoring)**:
- Each matched rule adds an anomaly score to the transaction.
- If the total score exceeds the configured inbound threshold, ModSecurity blocks the request.

### What Makes It "Hardened"?
1. **Active Blocking Mode:** `SecRuleEngine On` (not `DetectionOnly`). Malicious packets are actively blocked before reaching the backend.
2. **Protocol Validation:** Restricts invalid HTTP methods, missing `Host` headers, and illegal character encodings.
3. **Information Leak Prevention:** Filters response headers to prevent leaking web server signatures (`Server`, `X-Powered-By`).
4. **WebSocket & Long-Polling Protection:** Configured specifically to permit real-time Pong gameplay and chat connections without dropping the connection upgrade.


## Module : frontend (by Taqi)


| Module | Type / points | Why | How |
| --- | --- | --- | --- |
| Frontend framework | Minor / 1 | Give players a menu before entering the FPS. | React and TypeScript screens styled with Tailwind CSS. |
| Custom design system | Minor / 1 | Keep the menu consistent and reuse UI elements. | Shared buttons, inputs, language and avatar selectors, accordion and controls components. |
| Multiple languages | Minor / 1 | Let players choose their language. | French, English and Spanish texts, a language selector and a saved profile preference. |
| User management and authentication | Major / 2 | Let players keep their account and profile. | Express API routes, salted scrypt password hashes, HttpOnly session cookies and profile editing/deletion. |
| Database ORM | Minor / 1 | Keep database operations simple. | Drizzle reads and updates accounts in SQLite. |

These are the subject's module values, not a confirmed score. Remaining requirements: avatar upload, friends and online status for User Management; at least 10 reusable components for the design system (currently 7 shared components); translation of remaining account screens and game text for languages.

### Technical Stack

| Part | Technologies |
| --- | --- |
| Menu | React, TypeScript, Tailwind CSS and Vite |
| FPS and real-time networking | JavaScript, Three.js and Socket.IO |
| Accounts | Node.js 24, Express, native crypto functions, SQLite and Drizzle ORM |
| Existing backend | NestJS and PostgreSQL; account data is stored separately in SQLite |
| Infrastructure | Docker Compose, Nginx, ModSecurity, HashiCorp Vault, Prometheus and Grafana |

React keeps menu screens organized. SQLite stores accounts without another database service, and Drizzle provides simple CRUD queries. The existing Socket.IO server verifies the session cookie before allowing a player to join the game.

### Database Schema

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

## Module: AI moderation

### What is AI moderation?
AI moderation is a system that automatically checks player chat messages before they are broadcast to other players. It uses the OpenAI Moderation API to detect potentially harmful or inappropriate content.

OpenAI Moderation is an API designed to identify potentially harmful content in text and other supported inputs. The implementation uses the `omni-moderation-latest` model to evaluate player messages. The API returns a moderation result indicating whether the input has been flagged. The game server uses this result to decide whether the message can be broadcast or must be blocked.

Moderation is integrated into the Node.js game server through the `moderateMessage()` function. Each message is checked before being delivered to the other players in the game room.

The objective is to maintain a safer gaming environment while preventing inappropriate messages and abuse of the chat system.

### What makes the AI moderation effective?
1. **Server-side validation:** Messages are moderated on the server before being broadcast, preventing clients from bypassing the moderation flow simply by modifying their frontend.
2. **Message length restriction:** Messages are limited to 200 characters to reduce excessive input and unnecessary API usage.
3. **Rate limiting:** Each player can send up to 5 messages within a 5-second window, helping prevent chat spam.
4. **Fail-closed behavior:** If the moderation service is unavailable or returns an error, the message is blocked instead of being broadcast without moderation.
5. **Room isolation:** Approved messages are broadcast only to players in the corresponding game room.
6. **Configurable API timeout:** The OpenAI client is configured with a 3-second timeout to limit how long a moderation request can take.

### Configuration & tuning
#### Environment variables
The moderation service requires an OpenAI API key.

```env
OPENAI_API_KEY=your_openai_api_key
```

The API key must be configured in the server environment and must never be exposed to the frontend or committed to version control. The key can be managed through the project's existing secret-management system such as HashiCorp Vault.

#### OpenAI client configuration
The moderation client is initialized in `moderation.js`.

```javascript
import OpenAIClient from 'openai';

const openai = new OpenAIClient({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 3000,
});
```

- `apiKey`: Authenticates requests to the OpenAI API.
- `timeout`: Limits the duration of an API request to 3 seconds.

The timeout helps prevent moderation requests from waiting indefinitely. If the request fails, the chat handler catches the error and blocks the message.

#### Moderation logic
The `moderateMessage()` function sends the message to the OpenAI Moderation API and evaluates the result.

```javascript
export async function moderateMessage(text, context) {
  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input: text,
  });

  const result = moderation.results[0];

  console.log("MODERATION:", JSON.stringify(result, null, 2));

  if (result.flagged === true) {
    return {
      allowed: false,
      reason: "inappropriate language",
    };
  }

  return { allowed: true };
}
```

The function returns a verdict that determines whether the message is allowed.
- `allowed: true`: The message passes the moderation check.
- `allowed: false`: The message is rejected.
- `reason`: Provides a reason that the server can send to the client when the message is blocked.

The `context` parameter can carry additional information, such as the player ID and room ID. In the current implementation, this context is not sent to the moderation API or used in the moderation decision.

#### Chat message validation
Before calling the moderation API, the game server validates incoming chat messages.

```javascript
const CHAT_MAX_LENGTH = 200;
const CHAT_RATE_LIMIT = 5;
const CHAT_RATE_WINDOW = 5000;
```

The server applies the following checks:
- The player must belong to an active game room.
- The message must contain a string.
- Leading and trailing whitespace is removed.
- The message is truncated to a maximum of 200 characters.
- Empty messages are ignored.
- The rate limit allows up to 5 messages in a rolling 5-second window.

Messages that exceed the rate limit are rejected immediately without calling the moderation API.

### Moderation workflow
The chat moderation process follows these steps:
1. A player sends a message through the `chat:send` Socket.IO event.
2. The server validates the message and checks the player's rate limit.
3. The message is submitted to `moderateMessage()`.
4. The OpenAI Moderation API evaluates the message.
5. If the result is flagged, the server emits `chat:blocked`.
6. If moderation fails, the server also blocks the message.
7. If the message is allowed, the server broadcasts `chat:message` to the corresponding game room.

Only approved messages are broadcast to other players.

### Socket.IO events
The moderation system uses the following events:

| Event | Direction | Purpose |
|---|---|---|
| `chat:send` | Client → Server | Submits a chat message for validation and moderation. |
| `chat:blocked` | Server → Client | Informs the sender that a message has been rejected. |
| `chat:message` | Server → Room | Broadcasts an approved message to players in the room. |

The current implementation does not rewrite or sanitize messages using AI. It either allows the original message or blocks it.

### Error handling and security
#### Fail-closed moderation
If the OpenAI API request fails, the chat handler catches the error and rejects the message.

```javascript
try {
  verdict = await moderateMessage(text, {
    playerId: socket.data.playerId,
    roomId,
  });
} catch (err) {
  console.error('Moderation error:', err);

  verdict = {
    allowed: false,
    reason: 'Moderation unavailable',
  };
}
```

This approach prevents messages from being broadcast when the moderation service cannot provide a result.

### Where is it implemented?
#### AI moderation module — `moderation.js`
This module initializes the OpenAI client and exports `moderateMessage()`. It sends chat text to the Moderation API and returns an allow-or-block verdict.

#### Node.js game server — `server.js`
The game server integrates moderation into the `chat:send` Socket.IO event.

It validates messages, enforces rate limits, calls the moderation module, handles errors, and broadcasts only approved messages.

## Module : Monitoring System (by abignals)

### What is Prometheus?
Prometheus is an open-source monitoring and alerting system that collects and stores metrics as time-series data. It periodically scrapes metrics exposed by applications and exporters, allowing developers to monitor application health, resource usage, and system performance.

### What is Grafana
Grafana is an open-source observability and visualization platform that connects to data sources such as Prometheus to display metrics through dashboards, graphs, and status panels. It provides a centralized interface to monitor the health and performance of the application.

### What makes the monitoring system effective?
1. **Application Metrics:** The Node.js server exposes a `/metrics` endpoint using `prom-client`, providing runtime metrics and custom game metrics.
2. **System Monitoring:** Node Exporter exposes system-level metrics such as CPU usage, memory consumption, disk activity, and network statistics.
3. **Centralized Collection:** Prometheus periodically collects metrics from the game server and exporters using configurable scrape jobs.
4. **Custom Dashboards:** Grafana displays relevant application and system metrics, including connected players, active rooms, gameplay activity, CPU usage, and memory usage.
5. **Alerting Rules:** Prometheus evaluates alerting rules to detect conditions such as an unavailable game server or excessive resource usage.
6. **Access Security:** Grafana access is protected by authentication, public sign-up is disabled, and administrator credentials are managed outside the source code.

### Configuration & tuning
#### Key `prometheus.yml` settings:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - /etc/prometheus/rules/alerts.yml

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["prometheus:9090"]

  - job_name: "game-server"
    metrics_path: /metrics
    static_configs:
      - targets: ["game:3001"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]
```

- `scrape_interval`: Defines how frequently Prometheus collects metrics.
- `evaluation_interval`: Defines how frequently alerting and recording rules are evaluated.
- `rule_files`: Loads the configured Prometheus alerting rules.
- `scrape_configs`: Defines the Prometheus server and application/exporter targets to monitor.

#### Node.js metrics with `prom-client`
The game server exposes Prometheus-compatible metrics through an HTTP endpoint.

Example:

```javascript
import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

Custom application metrics can be added to monitor the state and activity of the game.

Examples include:

- `game_connected_players`: Number of currently connected players.
- `game_active_rooms`: Number of active game rooms.
- `game_waiting_players`: Number of players waiting for a match.
- `game_player_moves_total`: Total number of player movement events.
- `game_player_shots_total`: Total number of player shots.
- `game_player_hits_total`: Total number of player hit events.

These metrics help distinguish application-level problems from infrastructure-level problems.

#### Key `alerts.yml` settings:
```yaml
groups:
  - name: transcendence-alerts
    rules:
      - alert: GameServerDown
        expr: up{job="game-server"} == 0
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "Game server is down"
          description: "The Transcendence game server has been unreachable for more than 30 seconds."
      - alert: HighMemoryUsage
        expr: 100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) > 90
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is above 90% for more than 2 minutes."
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is above 90% for more than 2 minutes."
      - alert: TooManyPlayers
        expr: game_connected_players > 10
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High number of connected players"
          description: "More than 10 players are connected."
```

#### Grafana dashboards
The Grafana dashboard should provide a clear overview of the application's health and performance and key game KPIs.

Panels currently implemented:
- **Game Server Status:** Indicates whether Prometheus can scrape the game server.
- **Connected Players:** Displays the number of connected players.
- **Active Rooms:** Displays the number of active game rooms.
- **Waiting Players:** Displays the number of players waiting for a match.
- **Gameplay Activity:** Shows the rate of movement, shot, and hit events.
- **CPU Usage:** Displays system CPU utilization.
- **Memory Usage:** Displays system memory utilization.
- **Network and Disk Activity:** Displays system-level metrics collected by Node Exporter.

#### Grafana security settings
```yaml
environment:
  GF_SECURITY_ADMIN_USER: ${GRAFANA_ADMIN_USER}
  GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD}
  GF_USERS_ALLOW_SIGN_UP: "false"
```

### Where is it implemented?
#### Node.js game server - `server-test/server.js`
The game server exposes the `/metrics` endpoint and registers application-specific metrics through `prom-client`.

It provides visibility into the game's runtime, player connections, rooms, and gameplay events.

#### Prometheus - `monitoring/prometheus/prometheus.yml`
This configuration defines scrape targets for the game server, Prometheus itself, and Node Exporter.

Prometheus collects the metrics and evaluates the configured alerting rules.

#### Prometheus alerting rules - `monitoring/prometheus/rules/alerts.yml`
This file contains rules for detecting server availability problems and excessive resource usage.

#### Node Exporter
Node Exporter exposes operating-system metrics for the machine running the application, including CPU, memory, disk, and network statistics.

#### Grafana - `monitoring/grafana/`
Grafana connects to Prometheus as a data source and displays the collected metrics through custom dashboards.

Provisioning files can be stored here to automate data-source and dashboard configuration.

