# ft_transcendence - First-Person Shooter
*This project has been created as part of the 42 curriculum by trambure, abignals, taqi, dagouill, and albouche.*

## Description
A real-time 3D first-person shooter played 1v1 in the browser. Two players are matched automatically, spawn on opposite sides of a small arena, and fight a best-of-5 match: the first player to win 3 rounds wins. A round is won by eliminating the opponent (4 hits at 25 damage on 100 HP).

## Modules breakdown

**total points** : 21
**major modules** : 16
**minor modules** : 5


| Major | ID   | Feature                                                                                      | Points |
| ----- | ---- | -------------------------------------------------------------------------------------------- | ------ |
| ☐     | W\.1 | Use a framework for both the frontend and backend                                            | 2      |
| ☐     | W\.4 | Implement real-time features using WebSockets or similar technology                          | 2      |
| ☐     | U.1  | Standard user management and authentication                                                  | 2      |
| ☐     | C.1  | Implement WAF/ModSecurity (hardened) + HashiCorp Vault for secrets                           | 2      |
| ☐     | G.1  | Implement a complete web-based game where users can play against each other                  | 2      |
| ☐     | G.2  | Remote players — Enable two players on separate computers to play the same game in real time | 2      |
| ☐     | G.5  | Implement advanced 3D graphics using a library like Three.js or Babylon.js                   | 2      |
| ☐     | D.2  | Monitoring system with Prometheus and Grafana                                                | 2      |



| Minor | ID | Feature | Points |
|:---:|:---:|---|:---:|
| ☐ | W.7 | Use an ORM for the database | 1 |
| ☐ | W.12 | Custom-made design system with at least 10 reusable components | 1 |
| ☐ | A.4 | Support for additional browsers | 1 |
| ☐ | AI.5 | Content moderation AI | 1 |
| ☐ | DA.3 | GDPR compliance features | 1 |


## Instructions

### Requirements
- Docker and Docker Compose
- Git

### Installation and Execution
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd transcendence
   ```

2. Configure the environment variables as described in the project's `.env` file, if provided.

3. Build and start the application:
   ```bash
   make
   ```

4. Open the application in your browser at the address configured for the project, typically:
   ```text
   https://localhost:8443
   ```

### Stopping the Application

Stop the running containers with:

```bash
make down
```

For project-specific commands and configuration details, refer to the `Makefile` and the relevant service configuration files.


## Resources
### Documentation and References
- [Three.js Documentation](https://threejs.org/docs/) — 3D rendering and game scene management.
- [Socket.IO Documentation](https://socket.io/docs/v4/) — Real-time communication between the client and server.
- [MDN Web Docs — WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) — Browser-based real-time communication.
- [Node.js Documentation](https://nodejs.org/docs/latest/api/) — Server-side JavaScript runtime.
- [GLTF 3D Models](https://www.khronos.org/gltf/) — 3D asset format used for models and animations.
- [Docker Documentation](https://docs.docker.com/) — Containerization and application deployment.

### Use of Artificial Intelligence
AI tools were used as development assistance throughout the project. They supported the team in the following tasks:

- **Research and learning:** Understanding APIs, libraries, and technical concepts related to Three.js, real-time networking, and game development.
- **Debugging:** Helping identify potential causes of errors and suggesting solutions during development.
- **Code assistance:** Supporting the implementation and improvement of selected functions and components.
- **Documentation:** Helping structure and write parts of the README and explain technical choices.

AI-generated suggestions were reviewed and adapted by the team. The team remains responsible for the final implementation, integration, testing, and validation of the project.

## Team and Roles
| Team member | Role | Responsibilities |
|---|---|---|
| trambure | Product Owner | Game development: FPS mechanics, Three.js rendering, movement, shooting, and game UI |
| abignals | Technical Lead | Frameworks and AI moderation |
| taqi | Developer | Frontend and authentification |
| dagouill | Developer | Cybersecurity |
| albouche | Product Manager | AI moderation and monitoring system |

## Features
- 3D first-person view (Three.js) with mouse look (Pointer Lock API)
- Movement: walk, sprint, jump, and an omnidirectional slide with a cooldown
- Hitscan shooting with a 12-round magazine, fire rate limit, reload timer, recoil, tracers and impact markers
- Animated 3D weapon and opponent models (glTF), with idle / run / shoot / roll animations synchronized from network events
- Automatic matchmaking, two distinct spawn points, synchronized 3-second countdown before each round
- Round and match system with HUD (health bar, ammo, score) and end-of-round / end-of-match screens
- Reconnection: a player who reloads or loses connection has 20 seconds to come back, otherwise the match is abandoned
- If only one player confirms the next round, the server starts it after 15 seconds
- In-game chat (see the chat/moderation part of this README)

## Controls
| Action | Key |
|---|---|
| Move | W/A/S/D (physical keys, so Z/Q/S/D on AZERTY) |
| Sprint | Left Shift |
| Jump | Space |
| Slide | C |
| Shoot | Left mouse button |
| Reload | R |

## Architecture
- `frontend/src/main.js`: orchestration and main loop only
- `frontend/src/game/`: movement, physics, collisions, shooting, ammo, recoil, effects, round flow, opponent animation controller
- `frontend/src/network/`: Socket.io client (`network.js`) and the glue between network events and game logic (`gamenetwork.js`)
- `frontend/src/maps/`: arena defined as data (walls, spawns), turned into meshes and collision boxes
- `frontend/src/ui/`: HUD, end screen, round score
- `server-test/server.js`: Socket.io game server (matchmaking, rooms, relay of positions/shots/hits, reconnection, ready timeout)

## Technical choices
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

## Module: Implement real-time features using WebSockets or similar technology (by trambure)
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

## Module: 3D Real-Time Multiplayer FPS Game (by trambure)
### What Is the Game?
This module implements a complete browser-based, 3D first-person shooter (FPS) game using Three.js for rendering and JavaScript ES modules for game logic.

Players can join a multiplayer match, move around a 3D arena, shoot their opponent, manage ammunition and health, and compete in a round-based match. The game also includes real-time player synchronization and an in-game chat system.

The game is designed to run directly in a web browser without requiring a separate game client installation.

### Core Features
Real-Time Multiplayer (G.1.1 & G.1.2): Players can compete against each other in live matches. Player positions, rotations, shooting actions, hits, and chat messages are synchronized through the networking layer.
3D Game Environment (G.1.4): The game uses Three.js to render a 3D arena, walls, player characters, and a first-person weapon model. The camera acts as the player's viewpoint, providing an immersive FPS experience.
Clear Rules and Win/Loss Conditions (G.1.3): Each player starts with 100 health points. A successful hit deals 25 damage. A player who loses all their health loses the round, while the opponent wins it. The match flow manages round transitions, countdowns, score tracking, and the end screen.
Player Controls and Movement: The game supports first-person camera controls, movement, sprinting, sliding, and jumping. Collision detection prevents the player from moving through arena walls.
Weapon and Ammunition System: The shooting module handles firing and hit detection, while the ammunition module manages available ammunition and reloading. Weapon recoil and movement animations improve the gameplay experience.
Health and Game HUD: The user interface displays player health, ammunition, round information, and countdown timers. A connection banner provides feedback about the multiplayer connection state.
In-Game Chat: Players can exchange messages during a match. Opening the chat disables movement input, and shooting is prevented while the chat is open. The networking integration also supports notifications when messages are blocked.

### Multiplayer Synchronization
The networking layer provides the communication between players during a live match.

The game sends or handles the following information:

Player movement: Position, camera rotation, and sliding state.
Combat events: Shooting actions and hit notifications.
Match state: Player readiness and round-related events.
Chat: Messages exchanged between players.
Connection feedback: Notifications about multiplayer connection status.

Opponent movement is interpolated locally using Three.js vectors and rotations. This helps smooth the visual representation of network updates.

The networking modules are responsible for communication, while the gameplay modules handle the resulting state changes.

## Technical Stack (by oettaqi)
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

## Module: AI moderation (by albouche)
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

## Module : Monitoring System (by albouche)
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

## Module: Support for additional browsers (by trambure)
### What Is Cross-Browser Compatibility?
Cross-browser compatibility ensures that the web application works correctly across different web browsers. The goal is to provide a consistent user experience regardless of the browser used to access the application.

This module focuses on supporting additional browsers, testing game features, documenting browser-specific limitations, and maintaining consistent UI/UX.
What Makes It Important?

    Multiple Browser Support (A.4.1): The application should support at least two additional browsers, such as Firefox, Safari, or Microsoft Edge, alongside the primary development browser.
    Feature Compatibility (A.4.2): All major features must be tested in each supported browser, including game rendering, player controls, multiplayer networking, shooting, and chat.
    Browser Limitations (A.4.3): Any browser-specific issues or unsupported features must be documented, together with possible workarounds.
    Consistent UI/UX (A.4.4): The game interface, HUD, chat, countdowns, controls, and end screen should behave consistently across all supported browsers.

### How is compatibility tested?
The application uses JavaScript ES modules, Three.js, CSS, and browser-based networking. These technologies must be verified across supported browsers.

    Rendering: Verify that the 3D arena, weapon models, lighting, and opponent animations display correctly.
    Controls: Test movement, jumping, sprinting, sliding, and shooting.
    Networking: Verify live player synchronization, hit notifications, and chat messages.
    User Interface: Check health, ammunition, round information, countdowns, and end screens.
    Responsive Layout: Ensure that the interface adapts correctly to different window sizes.
    Error Detection: Use browser developer tools to identify JavaScript errors, rendering problems, and network failures.

### Supported browsers
The following browsers are recommended for compatibility testing:

    Google Chrome: Primary reference browser for development and testing.
    Mozilla Firefox: Verify rendering, controls, networking, and interface behavior.
    Microsoft Edge: Check gameplay and UI consistency using its Chromium-based engine.
    Safari: Test WebGL support, input handling, and browser-specific behavior where available.

Actual compatibility must be confirmed through testing in each browser.

## Module: Remote Multiplayer Gameplay (by trambure)
### What Is Remote Multiplayer?
Remote multiplayer allows two players using separate computers to participate in the same game in real time. The game uses a networking layer to exchange player positions, shooting actions, hit notifications, and chat messages.

The objective is to provide responsive gameplay, handle network interruptions gracefully, and allow players to reconnect when a connection is lost.

### What Makes It Reliable?
    Latency and Disconnection Handling: The networking layer must handle delayed messages and unexpected disconnections without immediately breaking the entire game. Connection status feedback helps players understand when communication is interrupted.
    Smooth Remote Gameplay: Player positions and rotations are updated over the network. Local interpolation smooths opponent movement between received updates, reducing visible jumps and discontinuities.
    Reconnection Logic: The networking system should detect connection loss, attempt to restore communication, and synchronize the player's state when the connection is re-established.

### How Was the Code Implemented?
The game follows a modular architecture that separates gameplay mechanics from network communication.

    Networking (network/network.js): Provides functions for sending player positions, shooting actions, hit notifications, readiness signals, and chat messages.
    Game Networking (network/gamenetwork.js): Integrates network events with the game state and opponent behavior.
    Position Synchronization: Sends player position, rotation, and sliding state approximately every 100 milliseconds.
    Opponent Interpolation (game/opponentcontroller.js): Smoothly updates the opponent's position and rotation to improve the visual experience.
    Connection Feedback: A connection banner informs players about the multiplayer connection state.
    Match Flow (game/matchflow.js): Coordinates round transitions and match state when players become ready or a round ends.

### Reconnection Strategy
To support reliable remote gameplay, the networking layer should implement the following reconnection process:

    Detect when the connection is lost.
    Display a connection warning to the player.
    Attempt to reconnect using a controlled retry strategy.
    Rejoin the appropriate match or game session when possible.
    Synchronize player positions, health, ammunition, and round state.
    Resume gameplay only when the match state is consistent.

The server should remain responsible for validating the restored session and authoritative game state.

## Module: 3D Real-Time Game (by trambure)
### What Is the Game?
This module implements a browser-based, 3D first-person shooter (FPS) using Three.js for rendering and JavaScript ES modules for game logic.

Players can join a multiplayer match, move around a 3D arena, shoot their opponent, manage health and ammunition, and compete in round-based gameplay. The game also includes real-time player synchronization and an in-game chat system.

### Core Features
    Real-Time Multiplayer (G.1.1): The game allows players to compete against each other through a multiplayer networking system that exchanges movement, shooting, hit, and chat events.
    Live Matches (G.1.2): Players can participate in live matches, with player positions and rotations updated over the network during gameplay.
    Clear Rules and Win/Loss Conditions (G.1.3):### Each player starts with 100 health points. Each successful hit deals 25 damage. When a player's health reaches zero, the opponent wins the round.
    3D Game Environment (G.1.4): Three.js renders the arena, walls, opponent character, lighting, and first-person weapon model, creating an immersive 3D experience.

### How Was the Code Implemented?
Module: 3D Real-Time Multiplayer FPS Game (by trambure)
What Is the Game?

This module implements a browser-based, 3D first-person shooter (FPS) using Three.js for rendering and JavaScript ES modules for game logic.

Players can join a multiplayer match, move around a 3D arena, shoot their opponent, manage health and ammunition, and compete in round-based gameplay. The game also includes real-time player synchronization and an in-game chat system.
Core Features

    Real-Time Multiplayer (G.1.1): The game allows players to compete against each other through a multiplayer networking system that exchanges movement, shooting, hit, and chat events.
    Live Matches (G.1.2): Players can participate in live matches, with player positions and rotations updated over the network during gameplay.
    Clear Rules and Win/Loss Conditions (G.1.3): Each player starts with 100 health points. Each successful hit deals 25 damage. When a player's health reaches zero, the opponent wins the round.
    3D Game Environment (G.1.4): Three.js renders the arena, walls, opponent character, lighting, and first-person weapon model, creating an immersive 3D experience.

### How Was the Code Implemented?
The game follows a modular architecture, separating rendering, gameplay mechanics, networking, and user interface logic.

    Scene and Rendering (scene.js): Initializes the Three.js scene, camera, and renderer.
    Map System (maps/index.js): Loads the arena, floor, walls, collision data, and spawn points.
    Player Controls (game/controls.js): Handles player input and camera controls.
    Movement and Physics (game/movement.js, game/physics.js): Implements movement, sprinting, sliding, jumping, and gravity.
    Combat (game/shooting.js, game/health.js, game/ammo.js): Manages shooting, hit detection, damage, health, ammunition, and reloading.
    Opponent Management (game/opponentcontroller.js): Updates opponent movement, rotation, and animations.
    Match Flow (game/matchflow.js, ui/rounds.js): Manages round countdowns, scores, victories, and match progression.
    Networking (network/network.js, network/gamenetwork.js): Handles multiplayer events, position updates, shooting, hits, and chat messages.
    User Interface (ui/hud.js, ui/chat.js, ui/endscreen.js): Displays health, ammunition, round information, chat, and end-of-match screens.

### Game Rules and Match Flow
    Each player starts with 100 health points.
    Each successful hit inflicts 25 damage.
    Players move around the arena and shoot their opponent.
    When a player's health reaches zero, the opponent wins the round.
    A countdown precedes the start of a round.
    The match system updates scores and manages round transitions.

### Multiplayer Synchronization
The game sends player position, rotation, and sliding state approximately every 100 milliseconds.

Opponent movement is interpolated locally to reduce visible jumps between network updates. Shooting actions, hit notifications, readiness signals, and chat messages are handled by the networking layer.
Technologies Used

    JavaScript (ES Modules): Game logic and modular architecture.
    Three.js: 3D rendering, cameras, lighting, and models.
    HTML/CSS: User interface and HUD.
    Web-Based Networking: Communication between players during live matches.
    GLB Models: 3D weapon and character assets.
    Vite: Development server and asset configuration.

### Game Rules and Match Flow
    Each player starts with 100 health points.
    Each successful hit inflicts 25 damage.
    Players move around the arena and shoot their opponent.
    When a player's health reaches zero, the opponent wins the round.
    A countdown precedes the start of a round.
    The match system updates scores and manages round transitions.

## Module: Implement a complete web-based game where users can play against each other (by trambure)
### What Is the Game?
This module implements a complete browser-based, 3D first-person shooter (FPS) using Three.js and JavaScript ES modules.

Players can compete against each other in a 3D arena, move around the map, shoot opponents, manage health and ammunition, and participate in round-based matches. The game also includes real-time networking and an in-game chat system.

### Core Features
Multiplayer Gameplay: Players can compete against another player through the game's networking layer.
Live Matches: Player positions, rotations, shooting actions, and hit notifications are exchanged during gameplay.
3D Environment: Three.js renders the arena, walls, character models, lighting, and first-person weapon.
Combat System: Players can shoot opponents, inflict damage, and manage ammunition.
Health Management: Each player starts with 100 health points, and each successful hit deals 25 damage.
Win/Loss Conditions: A player whose health reaches zero loses the round, and the opponent wins.
Round Management: Countdown timers, score tracking, round transitions, and end-of-match screens organize the gameplay.
Player Controls: Movement, sprinting, sliding, jumping, and collision detection provide interactive gameplay.
In-Game Chat: Players can exchange messages during a match.

### How Was the Code Implemented?
The game uses a modular architecture that separates gameplay, rendering, networking, and interface components.

Rendering (scene.js): Initializes the Three.js scene, camera, and renderer.
Maps (maps/index.js): Loads the arena, walls, floor, and spawn points.
Controls (game/controls.js): Handles player input and camera movement.
Physics (game/physics.js, game/movement.js): Implements movement, gravity, jumping, sprinting, and sliding.
Combat (game/shooting.js, game/health.js, game/ammo.js): Handles shooting, damage, health, ammunition, and reloading.
Networking (network/network.js, network/gamenetwork.js): Exchanges gameplay events and player state between connected players.
Match Flow (game/matchflow.js, ui/rounds.js): Manages countdowns, victories, scores, and round progression.
User Interface (ui/hud.js, ui/chat.js, ui/endscreen.js): Displays health, ammunition, chat, and match results.

### Game Rules
Each player starts with 100 health points.
Each successful hit deals 25 damage.
Players must shoot their opponent to reduce their health.
A player whose health reaches zero loses the round.
A countdown precedes each round.
The match system updates scores and manages round transitions.
Technologies Used
JavaScript (ES Modules): Game logic and modular architecture.
Three.js: 3D rendering and scene management.
HTML/CSS: Interface and HUD.
Web-Based Networking: Multiplayer communication.
GLB Models: 3D character and weapon assets.
Vite: Development tooling and asset configuration.

## Module: Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components) (by oettaqi)
Type: Minor — 1 point

### What Is This Module?
This module provides reusable interface components and a consistent black-and-yellow appearance.

### Core Features
Shared buttons and text inputs.
Language selection.
Avatar selection.
Expandable rules and keyboard controls components.

### How Was the Code Implemented?
Reusable React components receive props describing their content and behavior. Tailwind CSS classes define their appearance.

The same components are reused across screens to avoid duplicating interface code.

### Technologies Used
React, TypeScript and Tailwind CSS.

Remaining Requirements

The subject requires at least 10 reusable components. The implementation currently contains 7 shared components.

## Module: Standard User Management and Authentication (by oettaqi)
Type: Major — 2 points

### What Is This Module?
This module lets players create an account, authenticate and manage their profile.

### Core Features
Email and password registration and login.
Password hashing with a unique salt.
Authentication through HttpOnly session cookies.
Profile editing, logout and account deletion.
Account verification before connecting to the game.

### How Was the Code Implemented?
Express routes receive requests from the React interface and validate their inputs.

Passwords are processed with scrypt. SQLite stores the salt and password hash, never the original password.

After authentication, the server generates a random session ticket. A server-side Map associates this ticket with the account, while a cookie stores the ticket in the browser.

Socket.IO middleware verifies the session before allowing access to the game.

### Technologies Used
Express, Node.js crypto, Socket.IO, SQLite and React.

Remaining Requirements

Avatar upload, friends and online status are still required to complete the major module.

Summary

This implementation provides authentication and profile management. Additional social and avatar features are needed for the complete module.

## Module: Database ORM (by oettaqi)
Type: Minor — 1 point

### What Is This Module?
This module uses an ORM to manage account data stored in SQLite.

### Core Features
Account creation and lookup.
Profile updates.
Account deletion.
Persistent storage through a Docker volume.

### How Was the Code Implemented?
Drizzle ORM defines the users table and performs account queries through reusable functions.

The table stores the account ID, email, pseudo, avatar identifier, language, password salt and password hash.

Drizzle uses Node.js DatabaseSync to access the SQLite database.

### Technologies Used

Drizzle ORM, SQLite, Node.js and Docker.
