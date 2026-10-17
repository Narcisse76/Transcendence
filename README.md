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

# Hardened WAF / ModSecurity (by dagouill)

## What is ModSecurity?
ModSecurity is an open-source Web Application Firewall (WAF) engine that intercepts HTTP/HTTPS requests before they hit your backend application. It operates at Layer 7 (Application Layer).

## OWASP Core Rule Set (CRS)
The OWASP CRS is a collection of generic attack detection rules designed to catch known and unknown vulnerabilities with minimal false positives. It uses **collaborative detection (anomaly scoring)**:
- Each matched rule adds an anomaly score to the transaction.
- If the total score exceeds the configured inbound threshold, ModSecurity blocks the request.

## What Makes It "Hardened"?
1. **Active Blocking Mode:** `SecRuleEngine On` (not `DetectionOnly`). Malicious packets are actively blocked before reaching the backend.
2. **Protocol Validation:** Restricts invalid HTTP methods, missing `Host` headers, and illegal character encodings.
3. **Information Leak Prevention:** Filters response headers to prevent leaking web server signatures (`Server`, `X-Powered-By`).
4. **WebSocket & Long-Polling Protection:** Configured specifically to permit real-time Pong gameplay and chat connections without dropping the connection upgrade.

## Configuration & Tuning for ft_transcendence

### Key `modsecurity.conf` settings:
```apache
# Enable active blocking
SecRuleEngine On

# Request Body Handling (inspect JSON payloads)
SecRequestBodyAccess On
SecRequestBodyLimit 13107200
SecRequestBodyNoFilesLimit 131072

# Response Body Inspection
SecResponseBodyAccess Off

# Audit Logging (records blocked attacks)
SecAuditEngine RelevantOnly
SecAuditLogParts ABIJDEFHZ
SecAuditLogType Serial
SecAuditLog /var/log/modsec_audit.log

### Where is it implemended?

#### Nginx default.conf
