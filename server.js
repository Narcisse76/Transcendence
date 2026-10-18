[1mdiff --git a/Makefile b/Makefile[m
[1mindex 82c5b64..3ddefeb 100644[m
[1m--- a/Makefile[m
[1m+++ b/Makefile[m
[36m@@ -1,4 +1,5 @@[m
 COMPOSE = docker compose[m
[32m+[m[32mGAME_CONTAINER ?= ft_game[m
 [m
 ifneq (,$(wildcard .env))[m
   include .env[m
[36m@@ -28,6 +29,9 @@[m [mlogs:[m
 ps:[m
 	$(COMPOSE) ps[m
 [m
[32m+[m[32musers:[m
[32m+[m	[32mdocker exec -i $(GAME_CONTAINER) node --input-type=module < server-test/show-users.js[m
[32m+[m
 clean: down[m
 	$(COMPOSE) down -v[m
 [m
[36m@@ -36,4 +40,4 @@[m [mfclean: clean[m
 [m
 re: fclean up[m
 [m
[31m-.PHONY: all build vault-init up down logs ps clean fclean re[m
[32m+[m[32m.PHONY: all build vault-init up down logs ps users clean fclean re[m
[1mdiff --git a/README.md b/README.md[m
[1mnew file mode 100644[m
[1mindex 0000000..bdf761b[m
[1m--- /dev/null[m
[1m+++ b/README.md[m
[36m@@ -0,0 +1,516 @@[m
[32m+[m[32m# ft_transcendence - First-Person Shooter[m
[32m+[m
[32m+[m[32m*This project has been created as part of the 42 curriculum by trambure, abignals, taqi, dagouill, and albouche*[m
[32m+[m
[32m+[m[32m## Description[m
[32m+[m
[32m+[m[32mA real-time 3D first-person shooter played 1v1 in the browser. Two players are matched automatically, spawn on opposite sides of a small arena, and fight a best-of-5 match: the first player to win 3 rounds wins. A round is won by eliminating the opponent (4 hits at 25 damage on 100 HP).[m
[32m+[m
[32m+[m
[32m+[m[32m## Instructions[m
[32m+[m
[32m+[m[32m### Requirements[m
[32m+[m[32m- Docker and Docker Compose[m
[32m+[m[32m- Git[m
[32m+[m
[32m+[m[32m### Installation and Execution[m
[32m+[m
[32m+[m[32m1. Clone the repository:[m
[32m+[m[32m   ```bash[m
[32m+[m[32m   git clone <repository-url>[m
[32m+[m[32m   cd transcendence[m
[32m+[m[32m   ```[m
[32m+[m
[32m+[m[32m2. Configure the environment variables as described in the project's `.env` file, if provided.[m
[32m+[m
[32m+[m[32m3. Build and start the application:[m
[32m+[m[32m   ```bash[m
[32m+[m[32m   make[m
[32m+[m[32m   ```[m
[32m+[m
[32m+[m[32m4. Open the application in your browser at the address configured for the project, typically:[m
[32m+[m[32m   ```text[m
[32m+[m[32m   http://localhost:8443[m
[32m+[m[32m   ```[m
[32m+[m
[32m+[m[32m### Stopping the Application[m
[32m+[m
[32m+[m[32mStop the running containers with:[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32mmake down[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32mFor project-specific commands and configuration details, refer to the `Makefile` and the relevant service configuration files.[m
[32m+[m
[32m+[m
[32m+[m[32m## Resources[m
[32m+[m
[32m+[m[32m### Documentation and References[m
[32m+[m
[32m+[m[32m- [Three.js Documentation](https://threejs.org/docs/) — 3D rendering and game scene management.[m
[32m+[m[32m- [Socket.IO Documentation](https://socket.io/docs/v4/) — Real-time communication between the client and server.[m
[32m+[m[32m- [MDN Web Docs — WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) — Browser-based real-time communication.[m
[32m+[m[32m- [Node.js Documentation](https://nodejs.org/docs/latest/api/) — Server-side JavaScript runtime.[m
[32m+[m[32m- [GLTF 3D Models](https://www.khronos.org/gltf/) — 3D asset format used for models and animations.[m
[32m+[m[32m- [Docker Documentation](https://docs.docker.com/) — Containerization and application deployment.[m
[32m+[m
[32m+[m[32m### Use of Artificial Intelligence[m
[32m+[m
[32m+[m[32mAI tools were used as development assistance throughout the project. They supported the team in the following tasks:[m
[32m+[m
[32m+[m[32m- **Research and learning:** Understanding APIs, libraries, and technical concepts related to Three.js, real-time networking, and game development.[m
[32m+[m[32m- **Debugging:** Helping identify potential causes of errors and suggesting solutions during development.[m
[32m+[m[32m- **Code assistance:** Supporting the implementation and improvement of selected functions and components.[m
[32m+[m[32m- **Documentation:** Helping structure and write parts of the README and explain technical choices.[m
[32m+[m
[32m+[m[32mAI-generated suggestions were reviewed and adapted by the team. The team remains responsible for the final implementation, integration, testing, and validation of the project.[m
[32m+[m
[32m+[m[32m## Team and Roles[m
[32m+[m
[32m+[m[32m| Team member | Role | Responsibilities |[m
[32m+[m[32m|---|---|---|[m
[32m+[m[32m| trambure | Product Owner | Game development: FPS mechanics, Three.js rendering, movement, shooting, and game UI |[m
[32m+[m[32m| abignals | Technical Lead | Frameworks and AI moderation |[m
[32m+[m[32m| taqi | Developer | Frontend and authentification |[m
[32m+[m[32m| dagouill | Developer | Cybersecurity |[m
[32m+[m[32m| albouche | Product Manager | AI moderation and monitoring system |[m
[32m+[m[32m## Features[m
[32m+[m
[32m+[m[32m- 3D first-person view (Three.js) with mouse look (Pointer Lock API)[m
[32m+[m[32m- Movement: walk, sprint, jump, and an omnidirectional slide with a cooldown[m
[32m+[m[32m- Hitscan shooting with a 12-round magazine, fire rate limit, reload timer, recoil, tracers and impact markers[m
[32m+[m[32m- Animated 3D weapon and opponent models (glTF), with idle / run / shoot / roll animations synchronized from network events[m
[32m+[m[32m- Automatic matchmaking, two distinct spawn points, synchronized 3-second countdown before each round[m
[32m+[m[32m- Round and match system with HUD (health bar, ammo, score) and end-of-round / end-of-match screens[m
[32m+[m[32m- Reconnection: a player who reloads or loses connection has 20 seconds to come back, otherwise the match is abandoned[m
[32m+[m[32m- If only one player confirms the next round, the server starts it after 15 seconds[m
[32m+[m[32m- In-game chat (see the chat/moderation part of this README)[m
[32m+[m
[32m+[m[32m## Controls[m
[32m+[m
[32m+[m[32m| Action | Key |[m
[32m+[m[32m|---|---|[m
[32m+[m[32m| Move | W/A/S/D (physical keys, so Z/Q/S/D on AZERTY) |[m
[32m+[m[32m| Sprint | Left Shift |[m
[32m+[m[32m| Jump | Space |[m
[32m+[m[32m| Slide | C |[m
[32m+[m[32m| Shoot | Left mouse button |[m
[32m+[m[32m| Reload | R |[m
[32m+[m
[32m+[m[32m## Architecture[m
[32m+[m
[32m+[m[32m- `frontend/src/main.js`: orchestration and main loop only[m
[32m+[m[32m- `frontend/src/game/`: movement, physics, collisions, shooting, ammo, recoil, effects, round flow, opponent animation controller[m
[32m+[m[32m- `frontend/src/network/`: Socket.io client (`network.js`) and the glue between network events and game logic (`gamenetwork.js`)[m
[32m+[m[32m- `frontend/src/maps/`: arena defined as data (walls, spawns), turned into meshes and collision boxes[m
[32m+[m[32m- `frontend/src/ui/`: HUD, end screen, round score[m
[32m+[m[32m- `server-test/server.js`: Socket.io game server (matchmaking, rooms, relay of positions/shots/hits, reconnection, ready timeout)[m
[32m+[m
[32m+[m[32m## Technical choices[m
[32m+[m
[32m+[m[32m- **Three.js without a physics engine**: gravity, jump and slide are hand-written, collisions use axis-aligned boxes tested per axis (so the player slides along walls). The game only needs simple movement and hitscan bullets.[m
[32m+[m[32m- **Socket.io forced to WebSocket transport**: the WAF blocks the `text/plain` POST requests of the polling transport (rule 920420).[m
[32m+[m[32m- **Client-authoritative hits**: each client raycasts its own shots and reports hits to the server, which relays them. This is simple and responsive but not cheat-proof. See limitations.[m
[32m+[m[32m- **Models**: made in Blender and exported as `.glb`. TODO: credits and licenses for the character pack and the rifle model.[m
[32m+[m
[32m+[m[32m## Module: Frameworks for frontend and backend (by abignals)[m
[32m+[m
[32m+[m[32m| Part | Stack | Location |[m
[32m+[m[32m|------|-------|----------|[m
[32m+[m[32m| Menu / UI | **React 19** + TypeScript, Tailwind CSS, Vite | `frontend/menu/` |[m
[32m+[m[32m| Game client | Three.js (3D rendering), Vite | `frontend/src/` |[m
[32m+[m[32m| API backend | **NestJS 11** (TypeScript, Express adapter) | `backend/` |[m
[32m+[m[32m| Game server | Express 5 + Socket.io | `server-test/` |[m
[32m+[m
[32m+[m[32m- **React** handles the menu screens (login, signup, profile, controls) as reusable components.[m
[32m+[m[32m- **NestJS** exposes the REST API under the `/api` prefix (e.g. `GET /api/health`), organised in modules and controllers.[m
[32m+[m
[32m+[m[32m## Module: Real-time features (WebSockets)[m
[32m+[m
[32m+[m[32mReal-time communication uses **Socket.io** over WebSocket (`transports: ['websocket']`).[m
[32m+[m
[32m+[m[32m- **Server:** `server-test/server.js` — **Client:** `frontend/src/network/network.js`[m
[32m+[m[32m- **Nginx** forwards `/socket.io/` with the `Upgrade` headers, and ModSecurity is configured to allow the WebSocket upgrade.[m
[32m+[m
[32m+[m[32m**What runs in real time**[m
[32m+[m[32m- **Matchmaking:** players wait in a queue (`waiting`) until an opponent is found (`match:start`), then play in a shared room.[m
[32m+[m[32m- **Gameplay:** positions, shots and hits are relayed instantly (`player:move`, `player:shoot`, `player:hit` → `opponent:*`, `hit:received`).[m
[32m+[m[32m- **Rounds:** a round starts when both players are ready, or after 15 s (`round:start`).[m
[32m+[m[32m- **In-game chat:** `chat:send` / `chat:message`, max 200 chars, rate-limited to 5 messages per 5 s, with moderation.[m
[32m+[m
[32m+[m[32m**Connection handling**[m
[32m+[m[32m- The socket handshake is authenticated with the session cookie (`LOGIN_REQUIRED` if not logged in), and a single account cannot play in two tabs at once (`ALREADY_PLAYING`).[m
[32m+[m[32m- If a player disconnects, the opponent is notified and the room is kept for **20 s**: reloading the page resumes the match (`match:resumed`), otherwise the match is abandoned (`match:abandoned`).[m
[32m+[m[32m- Leaving a match (`match:leave`) and disconnects are cleaned up server-side.[m
[32m+[m
[32m+[m[32m## Module: Hardened WAF / ModSecurity (by dagouill)[m
[32m+[m
[32m+[m[32m### What is ModSecurity?[m
[32m+[m[32mModSecurity is an open-source Web Application Firewall (WAF) engine that intercepts HTTP/HTTPS requests before they hit your backend application. It operates at Layer 7 (Application Layer).[m
[32m+[m
[32m+[m[32m### OWASP Core Rule Set (CRS)[m
[32m+[m[32mThe OWASP CRS is a collection of generic attack detection rules designed to catch known and unknown vulnerabilities with minimal false positives. It uses **collaborative detection (anomaly scoring)**:[m
[32m+[m[32m- Each matched rule adds an anomaly score to the transaction.[m
[32m+[m[32m- If the total score exceeds the configured inbound threshold, ModSecurity blocks the request.[m
[32m+[m
[32m+[m[32m### What Makes It "Hardened"?[m
[32m+[m[32m1. **Active Blocking Mode:** `SecRuleEngine On` (not `DetectionOnly`). Malicious packets are actively blocked before reaching the backend.[m
[32m+[m[32m2. **Protocol Validation:** Restricts invalid HTTP methods, missing `Host` headers, and illegal character encodings.[m
[32m+[m[32m3. **Information Leak Prevention:** Filters response headers to prevent leaking web server signatures (`Server`, `X-Powered-By`).[m
[32m+[m[32m4. **WebSocket & Long-Polling Protection:** Configured specifically to permit real-time Pong gameplay and chat connections without dropping the connection upgrade.[m
[32m+[m
[32m+[m
[32m+[m[32m## Module : frontend (by Taqi)[m
[32m+[m
[32m+[m
[32m+[m[32m| Module | Type / points | Why | How |[m
[32m+[m[32m| --- | --- | --- | --- |[m
[32m+[m[32m| Frontend framework | Minor / 1 | Give players a menu before entering the FPS. | React and TypeScript screens styled with Tailwind CSS. |[m
[32m+[m[32m| Custom design system | Minor / 1 | Keep the menu consistent and reuse UI elements. | Shared buttons, inputs, language and avatar selectors, accordion and controls components. |[m
[32m+[m[32m| Multiple languages | Minor / 1 | Let players choose their language. | French, English and Spanish texts, a language selector and a saved profile preference. |[m
[32m+[m[32m| User management and authentication | Major / 2 | Let players keep their account and profile. | Express API routes, salted scrypt password hashes, HttpOnly session cookies and profile editing/deletion. |[m
[32m+[m[32m| Database ORM | Minor / 1 | Keep database operations simple. | Drizzle reads and updates accounts in SQLite. |[m
[32m+[m
[32m+[m[32mThese are the subject's module values, not a confirmed score. Remaining requirements: avatar upload, friends and online status for User Management; at least 10 reusable components for the design system (currently 7 shared components); translation of remaining account screens and game text for languages.[m
[32m+[m
[32m+[m[32m### Technical Stack[m
[32m+[m
[32m+[m[32m| Part | Technologies |[m
[32m+[m[32m| --- | --- |[m
[32m+[m[32m| Menu | React, TypeScript, Tailwind CSS and Vite |[m
[32m+[m[32m| FPS and real-time networking | JavaScript, Three.js and Socket.IO |[m
[32m+[m[32m| Accounts | Node.js 24, Express, native crypto functions, SQLite and Drizzle ORM |[m
[32m+[m[32m| Existing backend | NestJS and PostgreSQL; account data is stored separately in SQLite |[m
[32m+[m[32m| Infrastructure | Docker Compose, Nginx, ModSecurity, HashiCorp Vault, Prometheus and Grafana |[m
[32m+[m
[32m+[m[32mReact keeps menu screens organized. SQLite stores accounts without another database service, and Drizzle provides simple CRUD queries. The existing Socket.IO server verifies the session cookie before allowing a player to join the game.[m
[32m+[m
[32m+[m[32m### Database Schema[m
[32m+[m
[32m+[m[32mAccount data uses **SQLite**, chosen for its simple single-file storage, with **Drizzle ORM** for CRUD operations.[m
[32m+[m
[32m+[m[32mTable: `users`[m
[32m+[m
[32m+[m[32m| Field | Type / purpose |[m
[32m+[m[32m| --- | --- |[m
[32m+[m[32m| `id` | INTEGER, primary key |[m
[32m+[m[32m| `email` | TEXT, required and unique |[m
[32m+[m[32m| `pseudo` | TEXT, required |[m
[32m+[m[32m| `avatar` | TEXT, avatar identifier; default: `human` |[m
[32m+[m[32m| `language` | TEXT, language code; default: `fr` |[m
[32m+[m[32m| `password_salt` | TEXT, random salt |[m
[32m+[m[32m| `password_hash` | TEXT, scrypt hash encoded as hexadecimal |[m
[32m+[m
[32m+[m[32mThe file `/data/users.db` persists in the Docker volume `users_data`. This account schema has one table and no table relationships. Sessions are stored in server memory, not SQLite, and are lost when the server restarts.[m
[32m+[m
[32m+[m[32m## Module: AI moderation (by albouche)[m
[32m+[m
[32m+[m[32m### What is AI moderation?[m
[32m+[m[32mAI moderation is a system that automatically checks player chat messages before they are broadcast to other players. It uses the OpenAI Moderation API to detect potentially harmful or inappropriate content.[m
[32m+[m
[32m+[m[32mOpenAI Moderation is an API designed to identify potentially harmful content in text and other supported inputs. The implementation uses the `omni-moderation-latest` model to evaluate player messages. The API returns a moderation result indicating whether the input has been flagged. The game server uses this result to decide whether the message can be broadcast or must be blocked.[m
[32m+[m
[32m+[m[32mModeration is integrated into the Node.js game server through the `moderateMessage()` function. Each message is checked before being delivered to the other players in the game room.[m
[32m+[m
[32m+[m[32mThe objective is to maintain a safer gaming environment while preventing inappropriate messages and abuse of the chat system.[m
[32m+[m
[32m+[m[32m### What makes the AI moderation effective?[m
[32m+[m[32m1. **Server-side validation:** Messages are moderated on the server before being broadcast, preventing clients from bypassing the moderation flow simply by modifying their frontend.[m
[32m+[m[32m2. **Message length restriction:** Messages are limited to 200 characters to reduce excessive input and unnecessary API usage.[m
[32m+[m[32m3. **Rate limiting:** Each player can send up to 5 messages within a 5-second window, helping prevent chat spam.[m
[32m+[m[32m4. **Fail-closed behavior:** If the moderation service is unavailable or returns an error, the message is blocked instead of being broadcast without moderation.[m
[32m+[m[32m5. **Room isolation:** Approved messages are broadcast only to players in the corresponding game room.[m
[32m+[m[32m6. **Configurable API timeout:** The OpenAI client is configured with a 3-second timeout to limit how long a moderation request can take.[m
[32m+[m
[32m+[m[32m### Configuration & tuning[m
[32m+[m[32m#### Environment variables[m
[32m+[m[32mThe moderation service requires an OpenAI API key.[m
[32m+[m
[32m+[m[32m```env[m
[32m+[m[32mOPENAI_API_KEY=your_openai_api_key[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32mThe API key must be configured in the server environment and must never be exposed to the frontend or committed to version control. The key can be managed through the project's existing secret-management system such as HashiCorp Vault.[m
[32m+[m
[32m+[m[32m#### OpenAI client configuration[m
[32m+[m[32mThe moderation client is initialized in `moderation.js`.[m
[32m+[m
[32m+[m[32m```javascript[m
[32m+[m[32mimport OpenAIClient from 'openai';[m
[32m+[m
[32m+[m[32mconst openai = new OpenAIClient({[m
[32m+[m[32m  apiKey: process.env.OPENAI_API_KEY,[m
[32m+[m[32m  timeout: 3000,[m
[32m+[m[32m});[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m- `apiKey`: Authenticates requests to the OpenAI API.[m
[32m+[m[32m- `timeout`: Limits the duration of an API request to 3 seconds.[m
[32m+[m
[32m+[m[32mThe timeout helps prevent moderation requests from waiting indefinitely. If the request fails, the chat handler catches the error and blocks the message.[m
[32m+[m
[32m+[m[32m#### Moderation logic[m
[32m+[m[32mThe `moderateMessage()` function sends the message to the OpenAI Moderation API and evaluates the result.[m
[32m+[m
[32m+[m[32m```javascript[m
[32m+[m[32mexport async function moderateMessage(text, context) {[m
[32m+[m[32m  const moderation = await openai.moderations.create({[m
[32m+[m[32m    model: "omni-moderation-latest",[m
[32m+[m[32m    input: text,[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  const result = moderation.results[0];[m
[32m+[m
[32m+[m[32m  console.log("MODERATION:", JSON.stringify(result, null, 2));[m
[32m+[m
[32m+[m[32m  if (result.flagged === true) {[m
[32m+[m[32m    return {[m
[32m+[m[32m      allowed: false,[m
[32m+[m[32m      reason: "inappropriate language",[m
[32m+[m[32m    };[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  return { allowed: true };[m
[32m+[m[32m}[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32mThe function returns a verdict that determines whether the message is allowed.[m
[32m+[m[32m- `allowed: true`: The message passes the moderation check.[m
[32m+[m[32m- `allowed: false`: The message is rejected.[m
[32m+[m[32m- `reason`: Provides a reason that the server can send to the client when the message is blocked.[m
[32m+[m
[32m+[m[32mThe `context` parameter can carry additional information, such as the player ID and room ID. In the current implementation, this context is not sent to the moderation API or used in the moderation decision.[m
[32m+[m
[32m+[m[32m#### Chat message validation[m
[32m+[m[32mBefore calling the moderation API, the game server validates incoming chat messages.[m
[32m+[m
[32m+[m[32m```javascript[m
[32m+[m[32mconst CHAT_MAX_LENGTH = 200;[m
[32m+[m[32mconst CHAT_RATE_LIMIT = 5;[m
[32m+[m[32mconst CHAT_RATE_WINDOW = 5000;[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32mThe server applies the following checks:[m
[32m+[m[32m- The player must belong to an active game room.[m
[32m+[m[32m- The message must contain a string.[m
[32m+[m[32m- Leading and trailing whitespace is removed.[m
[32m+[m[32m- The message is truncated to a maximum of 200 characters.[m
[32m+[m[32m- Empty messages are ignored.[m
[32m+[m[32m- The rate limit allows up to 5 messages in a rolling 5-second window.[m
[32m+[m
[32m+[m[32mMessages that exceed the rate limit are rejected immediately without calling the moderation API.[m
[32m+[m
[32m+[m[32m### Moderation workflow[m
[32m+[m[32mThe chat moderation process follows these steps:[m
[32m+[m[32m1. A player sends a message through the `chat:send` Socket.IO event.[m
[32m+[m[32m2. The server validates the message and checks the player's rate limit.[m
[32m+[m[32m3. The message is submitted to `moderateMessage()`.[m
[32m+[m[32m4. The OpenAI Moderation API evaluates the message.[m
[32m+[m[32m5. If the result is flagged, the server emits `chat:blocked`.[m
[32m+[m[32m6. If moderation fails, the server also blocks the message.[m
[32m+[m[32m7. If the message is allowed, the server broadcasts `chat:message` to the corresponding game room.[m
[32m+[m
[32m+[m[32mOnly approved messages are broadcast to other players.[m
[32m+[m
[32m+[m[32m### Socket.IO events[m
[32m+[m[32mThe moderation system uses the following events:[m
[32m+[m
[32m+[m[32m| Event | Direction | Purpose |[m
[32m+[m[32m|---|---|---|[m
[32m+[m[32m| `chat:send` | Client → Server | Submits a chat message for validation and moderation. |[m
[32m+[m[32m| `chat:blocked` | Server → Client | Informs the sender that a message has been rejected. |[m
[32m+[m[32m| `chat:message` | Server → Room | Broadcasts an approved message to players in the room. |[m
[32m+[m
[32m+[m[32mThe current implementation does not rewrite or sanitize messages using AI. It either allows the original message or blocks it.[m
[32m+[m
[32m+[m[32m### Error handling and security[m
[32m+[m[32m#### Fail-closed moderation[m
[32m+[m[32mIf the OpenAI API request fails, the chat handler catches the error and rejects the message.[m
[32m+[m
[32m+[m[32m```javascript[m
[32m+[m[32mtry {[m
[32m+[m[32m  verdict = await moderateMessage(text, {[m
[32m+[m[32m    playerId: socket.data.playerId,[m
[32m+[m[32m    roomId,[m
[32m+[m[32m  });[m
[32m+[m[32m} catch (err) {[m
[32m+[m[32m  console.error('Moderation error:', err);[m
[32m+[m
[32m+[m[32m  verdict = {[m
[32m+[m[32m    allowed: false,[m
[32m+[m[32m    reason: 'Moderation unavailable',[m
[32m+[m[32m  };[m
[32m+[m[32m}[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32mThis approach prevents messages from being broadcast when the moderation service cannot provide a result.[m
[32m+[m
[32m+[m[32m### Where is it implemented?[m
[32m+[m[32m#### AI moderation module — `moderation.js`[m
[32m+[m[32mThis module initializes the OpenAI client and exports `moderateMessage()`. It sends chat text to the Moderation API and returns an allow-or-block verdict.[m
[32m+[m
[32m+[m[32m#### Node.js game server — `server.js`[m
[32m+[m[32mThe game server integrates moderation into the `chat:send` Socket.IO event.[m
[32m+[m
[32m+[m[32mIt validates messages, enforces rate limits, calls the moderation module, handles errors, and broadcasts only approved messages.[m
[32m+[m
[32m+[m[32m## Module : Monitoring System (by albouche)[m
[32m+[m
[32m+[m[32m### What is Prometheus?[m
[32m+[m[32mPrometheus is an open-source monitoring and alerting system that collects and stores metrics as time-series data. It periodically scrapes metrics exposed by applications and exporters, allowing developers to monitor application health, resource usage, and system performance.[m
[32m+[m
[32m+[m[32m### What is Grafana[m
[32m+[m[32mGrafana is an open-source observability and visualization platform that connects to data sources such as Prometheus to display metrics through dashboards, graphs, and status panels. It provides a centralized interface to monitor the health and performance of the application.[m
[32m+[m
[32m+[m[32m### What makes the monitoring system effective?[m
[32m+[m[32m1. **Application Metrics:** The Node.js server exposes a `/metrics` endpoint using `prom-client`, providing runtime metrics and custom game metrics.[m
[32m+[m[32m2. **System Monitoring:** Node Exporter exposes system-level metrics such as CPU usage, memory consumption, disk activity, and network statistics.[m
[32m+[m[32m3. **Centralized Collection:** Prometheus periodically collects metrics from the game server and exporters using configurable scrape jobs.[m
[32m+[m[32m4. **Custom Dashboards:** Grafana displays relevant application and system metrics, including connected players, active rooms, gameplay activity, CPU usage, and memory usage.[m
[32m+[m[32m5. **Alerting Rules:** Prometheus evaluates alerting rules to detect conditions such as an unavailable game server or excessive resource usage.[m
[32m+[m[32m6. **Access Security:** Grafana access is protected by authentication, public sign-up is disabled, and administrator credentials are managed outside the source code.[m
[32m+[m
[32m+[m[32m### Configuration & tuning[m
[32m+[m[32m#### Key `prometheus.yml` settings:[m
[32m+[m[32m```yaml[m
[32m+[m[32mglobal:[m
[32m+[m[32m  scrape_interval: 15s[m
[32m+[m[32m  evaluation_interval: 15s[m
[32m+[m
[32m+[m[32mrule_files:[m
[32m+[m[32m  - /etc/prometheus/rules/alerts.yml[m
[32m+[m
[32m+[m[32mscrape_configs:[m
[32m+[m[32m  - job_name: "prometheus"[m
[32m+[m[32m    static_configs:[m
[32m+[m[32m      - targets: ["prometheus:9090"][m
[32m+[m
[32m+[m[32m  - job_name: "game-server"[m
[32m+[m[32m    metrics_path: /metrics[m
[32m+[m[32m    static_configs:[m
[32m+[m[32m      - targets: ["game:3001"][m
[32m+[m
[32m+[m[32m  - job_name: "node-exporter"[m
[32m+[m[32m    static_configs:[m
[32m+[m[32m      - targets: ["node-exporter:9100"][m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m- `scrape_interval`: Defines how frequently Prometheus collects metrics.[m
[32m+[m[32m- `evaluation_interval`: Defines how frequently alerting and recording rules are evaluated.[m
[32m+[m[32m- `rule_files`: Loads the configured Prometheus alerting rules.[m
[32m+[m[32m- `scrape_configs`: Defines the Prometheus server and application/exporter targets to monitor.[m
[32m+[m
[32m+[m[32m#### Node.js metrics with `prom-client`[m
[32m+[m[32mThe game server exposes Prometheus-compatible metrics through an HTTP endpoint.[m
[32m+[m
[32m+[m[32mExample:[m
[32m+[m
[32m+[m[32m```javascript[m
[32m+[m[32mimport client from 'prom-client';[m
[32m+[m
[32m+[m[32mconst register = new client.Registry();[m
[32m+[m
[32m+[m[32mclient.collectDefaultMetrics({ register });[m
[32m+[m
[32m+[m[32mapp.get('/metrics', async (req, res) => {[m
[32m+[m[32m  res.set('Content-Type', register.contentType);[m
[32m+[m[32m  res.end(await register.metrics());[m
[32m+[m[32m});[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32mCustom application metrics can be added to monitor the state and activity of the game.[m
[32m+[m
[32m+[m[32mExamples include:[m
[32m+[m
[32m+[m[32m- `game_connected_players`: Number of currently connected players.[m
[32m+[m[32m- `game_active_rooms`: Number of active game rooms.[m
[32m+[m[32m- `game_waiting_players`: Number of players waiting for a match.[m
[32m+[m[32m- `game_player_moves_total`: Total number of player movement events.[m
[32m+[m[32m- `game_player_shots_total`: Total number of player shots.[m
[32m+[m[32m- `game_player_hits_total`: Total number of player hit events.[m
[32m+[m
[32m+[m[32mThese metrics help distinguish application-level problems from infrastructure-level problems.[m
[32m+[m
[32m+[m[32m#### Key `alerts.yml` settings:[m
[32m+[m[32m```yaml[m
[32m+[m[32mgroups:[m
[32m+[m[32m  - name: transcendence-alerts[m
[32m+[m[32m    rules:[m
[32m+[m[32m      - alert: GameServerDown[m
[32m+[m[32m        expr: up{job="game-server"} == 0[m
[32m+[m[32m        for: 30s[m
[32m+[m[32m        labels:[m
[32m+[m[32m          severity: critical[m
[32m+[m[32m        annotations:[m
[32m+[m[32m          summary: "Game server is down"[m
[32m+[m[32m          description: "The Transcendence game server has been unreachable for more than 30 seconds."[m
[32m+[m[32m      - alert: HighMemoryUsage[m
[32m+[m[32m        expr: 100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) > 90[m
[32m+[m[32m        for: 2m[m
[32m+[m[32m        labels:[m
[32m+[m[32m          severity: warning[m
[32m+[m[32m        annotations:[m
[32m+[m[32m          summary: "High memory usage"[m
[32m+[m[32m          description: "Memory usage is above 90% for more than 2 minutes."[m
[32m+[m[32m      - alert: HighCPUUsage[m
[32m+[m[32m        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90[m
[32m+[m[32m        for: 2m[m
[32m+[m[32m        labels:[m
[32m+[m[32m          severity: warning[m
[32m+[m[32m        annotations:[m
[32m+[m[32m          summary: "High CPU usage"[m
[32m+[m[32m          description: "CPU usage is above 90% for more than 2 minutes."[m
[32m+[m[32m      - alert: TooManyPlayers[m
[32m+[m[32m        expr: game_connected_players > 10[m
[32m+[m[32m        for: 1m[m
[32m+[m[32m        labels:[m
[32m+[m[32m          severity: warning[m
[32m+[m[32m        annotations:[m
[32m+[m[32m          summary: "High number of connected players"[m
[32m+[m[32m          description: "More than 10 players are connected."[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m#### Grafana dashboards[m
[32m+[m[32mThe Grafana dashboard should provide a clear overview of the application's health and performance and key game KPIs.[m
[32m+[m
[32m+[m[32mPanels currently implemented:[m
[32m+[m[32m- **Game Server Status:** Indicates whether Prometheus can scrape the game server.[m
[32m+[m[32m- **Connected Players:** Displays the number of connected players.[m
[32m+[m[32m- **Active Rooms:** Displays the number of active game rooms.[m
[32m+[m[32m- **Waiting Players:** Displays the number of players waiting for a match.[m
[32m+[m[32m- **Gameplay Activity:** Shows the rate of movement, shot, and hit events.[m
[32m+[m[32m- **CPU Usage:** Displays system CPU utilization.[m
[32m+[m[32m- **Memory Usage:** Displays system memory utilization.[m
[32m+[m[32m- **Network and Disk Activity:** Displays system-level metrics collected by Node Exporter.[m
[32m+[m
[32m+[m[32m#### Grafana security settings[m
[32m+[m[32m```yaml[m
[32m+[m[32menvironment:[m
[32m+[m[32m  GF_SECURITY_ADMIN_USER: ${GRAFANA_ADMIN_USER}[m
[32m+[m[32m  GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD}[m
[32m+[m[32m  GF_USERS_ALLOW_SIGN_UP: "false"[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Where is it implemented?[m
[32m+[m[32m#### Node.js game server - `server-test/server.js`[m
[32m+[m[32mThe game server exposes the `/metrics` endpoint and registers application-specific metrics through `prom-client`.[m
[32m+[m
[32m+[m[32mIt provides visibility into the game's runtime, player connections, rooms, and gameplay events.[m
[32m+[m
[32m+[m[32m#### Prometheus - `monitoring/prometheus/prometheus.yml`[m
[32m+[m[32mThis configuration defines scrape targets for the game server, Prometheus itself, and Node Exporter.[m
[32m+[m
[32m+[m[32mPrometheus collects the metrics and evaluates the configured alerting rules.[m
[32m+[m
[32m+[m[32m#### Prometheus alerting rules - `monitoring/prometheus/rules/alerts.yml`[m
[32m+[m[32mThis file contains rules for detecting server availability problems and excessive resource usage.[m
[32m+[m
[32m+[m[32m#### Node Exporter[m
[32m+[m[32mNode Exporter exposes operating-system metrics for the machine running the application, including CPU, memory, disk, and network statistics.[m
[32m+[m
[32m+[m[32m#### Grafana - `monitoring/grafana/`[m
[32m+[m[32mGrafana connects to Prometheus as a data source and displays the collected metrics through custom dashboards.[m
[32m+[m
[32m+[m[32mProvisioning files can be stored here to automate data-source and dashboard configuration.[m
[32m+[m
[1mdiff --git a/doc/cybersecurity.md b/doc/cybersecurity.md[m
[1mdeleted file mode 100644[m
[1mindex 68d78a8..0000000[m
[1m--- a/doc/cybersecurity.md[m
[1m+++ /dev/null[m
[36m@@ -1,42 +0,0 @@[m
[31m-# Hardened WAF / ModSecurity[m
[31m-[m
[31m-## What is ModSecurity?[m
[31m-ModSecurity is an open-source Web Application Firewall (WAF) engine that intercepts HTTP/HTTPS requests before they hit your backend application. It operates at Layer 7 (Application Layer).[m
[31m-[m
[31m-## OWASP Core Rule Set (CRS)[m
[31m-The OWASP CRS is a collection of generic attack detection rules designed to catch known and unknown vulnerabilities with minimal false positives. It uses **collaborative detection (anomaly scoring)**:[m
[31m-- Each matched rule adds an anomaly score to the transaction.[m
[31m-- If the total score exceeds the configured inbound threshold, ModSecurity blocks the request.[m
[31m-[m
[31m-## What Makes It "Hardened"?[m
[31m-1. **Active Blocking Mode:** `SecRuleEngine On` (not `DetectionOnly`). Malicious packets are actively blocked before reaching the backend.[m
[31m-2. **Protocol Validation:** Restricts invalid HTTP methods, missing `Host` headers, and illegal character encodings.[m
[31m-3. **Information Leak Prevention:** Filters response headers to prevent leaking web server signatures (`Server`, `X-Powered-By`).[m
[31m-4. **WebSocket & Long-Polling Protection:** Configured specifically to permit real-time Pong gameplay and chat connections without dropping the connection upgrade.[m
[31m-[m
[31m-## Configuration & Tuning for ft_transcendence[m
[31m-[m
[31m-### Key `modsecurity.conf` settings:[m
[31m-```apache[m
[31m-# Enable active blocking[m
[31m-SecRuleEngine On[m
[31m-[m
[31m-# Request Body Handling (inspect JSON payloads)[m
[31m-SecRequestBodyAccess On[m
[31m-SecRequestBodyLimit 13107200[m
[31m-SecRequestBodyNoFilesLimit 131072[m
[31m-[m
[31m-# Response Body Inspection[m
[31m-SecResponseBodyAccess Off[m
[31m-[m
[31m-# Audit Logging (records blocked attacks)[m
[31m-SecAuditEngine RelevantOnly[m
[31m-SecAuditLogParts ABIJDEFHZ[m
[31m-SecAuditLogType Serial[m
[31m-SecAuditLog /var/log/modsec_audit.log[m
[31m-[m
[31m-### Where is it implemended?[m
[31m-[m
[31m-#### Nginx default.conf[m
[31m-[m
[31m-[m
[1mdiff --git a/doc/moderation_ai.md b/doc/moderation_ai.md[m
[1mdeleted file mode 100644[m
[1mindex a2daf33..0000000[m
[1m--- a/doc/moderation_ai.md[m
[1m+++ /dev/null[m
[36m@@ -1,149 +0,0 @@[m
[31m-# AI moderation[m
[31m-## What is AI moderation?[m
[31m-AI moderation is a system that automatically checks player chat messages before they are broadcast to other players. It uses the OpenAI Moderation API to detect potentially harmful or inappropriate content.[m
[31m-[m
[31m-OpenAI Moderation is an API designed to identify potentially harmful content in text and other supported inputs. The implementation uses the `omni-moderation-latest` model to evaluate player messages. The API returns a moderation result indicating whether the input has been flagged. The game server uses this result to decide whether the message can be broadcast or must be blocked.[m
[31m-[m
[31m-Moderation is integrated into the Node.js game server through the `moderateMessage()` function. Each message is checked before being delivered to the other players in the game room.[m
[31m-[m
[31m-The objective is to maintain a safer gaming environment while preventing inappropriate messages and abuse of the chat system.[m
[31m-[m
[31m-## What makes the AI moderation effective?[m
[31m-1. **Server-side validation:** Messages are moderated on the server before being broadcast, preventing clients from bypassing the moderation flow simply by modifying their frontend.[m
[31m-2. **Message length restriction:** Messages are limited to 200 characters to reduce excessive input and unnecessary API usage.[m
[31m-3. **Rate limiting:** Each player can send up to 5 messages within a 5-second window, helping prevent chat spam.[m
[31m-4. **Fail-closed behavior:** If the moderation service is unavailable or returns an error, the message is blocked instead of being broadcast without moderation.[m
[31m-5. **Room isolation:** Approved messages are broadcast only to players in the corresponding game room.[m
[31m-6. **Configurable API timeout:** The OpenAI client is configured with a 3-second timeout to limit how long a moderation request can take.[m
[31m-[m
[31m-## Configuration & tuning[m
[31m-### Environment variables[m
[31m-The moderation service requires an OpenAI API key.[m
[31m-[m
[31m-```env[m
[31m-OPENAI_API_KEY=your_openai_api_key[m
[31m-```[m
[31m-[m
[31m-The API key must be configured in the server environment and must never be exposed to the frontend or committed to version control. The key can be managed through the project's existing secret-management system such as HashiCorp Vault.[m
[31m-[m
[31m-### OpenAI client configuration[m
[31m-The moderation client is initialized in `moderation.js`.[m
[31m-[m
[31m-```javascript[m
[31m-import OpenAIClient from 'openai';[m
[31m-[m
[31m-const openai = new OpenAIClient({[m
[31m-  apiKey: process.env.OPENAI_API_KEY,[m
[31m-  timeout: 3000,[m
[31m-});[m
[31m-```[m
[31m-[m
[31m-- `apiKey`: Authenticates requests to the OpenAI API.[m
[31m-- `timeout`: Limits the duration of an API request to 3 seconds.[m
[31m-[m
[31m-The timeout helps prevent moderation requests from waiting indefinitely. If the request fails, the chat handler catches the error and blocks the message.[m
[31m-[m
[31m-### Moderation logic[m
[31m-The `moderateMessage()` function sends the message to the OpenAI Moderation API and evaluates the result.[m
[31m-[m
[31m-```javascript[m
[31m-export async function moderateMessage(text, context) {[m
[31m-  const moderation = await openai.moderations.create({[m
[31m-    model: "omni-moderation-latest",[m
[31m-    input: text,[m
[31m-  });[m
[31m-[m
[31m-  const result = moderation.results[0];[m
[31m-[m
[31m-  console.log("MODERATION:", JSON.stringify(result, null, 2));[m
[31m-[m
[31m-  if (result.flagged === true) {[m
[31m-    return {[m
[31m-      allowed: false,[m
[31m-      reason: "inappropriate language",[m
[31m-    };[m
[31m-  }[m
[31m-[m
[31m-  return { allowed: true };[m
[31m-}[m
[31m-```[m
[31m-[m
[31m-The function returns a verdict that determines whether the message is allowed.[m
[31m-- `allowed: true`: The message passes the moderation check.[m
[31m-- `allowed: false`: The message is rejected.[m
[31m-- `reason`: Provides a reason that the server can send to the client when the message is blocked.[m
[31m-[m
[31m-The `context` parameter can carry additional information, such as the player ID and room ID. In the current implementation, this context is not sent to the moderation API or used in the moderation decision.[m
[31m-[m
[31m-### Chat message validation[m
[31m-Before calling the moderation API, the game server validates incoming chat messages.[m
[31m-[m
[31m-```javascript[m
[31m-const CHAT_MAX_LENGTH = 200;[m
[31m-const CHAT_RATE_LIMIT = 5;[m
[31m-const CHAT_RATE_WINDOW = 5000;[m
[31m-```[m
[31m-[m
[31m-The server applies the following checks:[m
[31m-- The player must belong to an active game room.[m
[31m-- The message must contain a string.[m
[31m-- Leading and trailing whitespace is removed.[m
[31m-- The message is truncated to a maximum of 200 characters.[m
[31m-- Empty messages are ignored.[m
[31m-- The rate limit allows up to 5 messages in a rolling 5-second window.[m
[31m-[m
[31m-Messages that exceed the rate limit are rejected immediately without calling the moderation API.[m
[31m-[m
[31m-### Moderation workflow[m
[31m-The chat moderation process follows these steps:[m
[31m-1. A player sends a message through the `chat:send` Socket.IO event.[m
[31m-2. The server validates the message and checks the player's rate limit.[m
[31m-3. The message is submitted to `moderateMessage()`.[m
[31m-4. The OpenAI Moderation API evaluates the message.[m
[31m-5. If the result is flagged, the server emits `chat:blocked`.[m
[31m-6. If moderation fails, the server also blocks the message.[m
[31m-7. If the message is allowed, the server broadcasts `chat:message` to the corresponding game room.[m
[31m-[m
[31m-Only approved messages are broadcast to other players.[m
[31m-[m
[31m-### Socket.IO events[m
[31m-The moderation system uses the following events:[m
[31m-[m
[31m-| Event | Direction | Purpose |[m
[31m-|---|---|---|[m
[31m-| `chat:send` | Client → Server | Submits a chat message for validation and moderation. |[m
[31m-| `chat:blocked` | Server → Client | Informs the sender that a message has been rejected. |[m
[31m-| `chat:message` | Server → Room | Broadcasts an approved message to players in the room. |[m
[31m-[m
[31m-The current implementation does not rewrite or sanitize messages using AI. It either allows the original message or blocks it.[m
[31m-[m
[31m-## Error handling and security[m
[31m-### Fail-closed moderation[m
[31m-If the OpenAI API request fails, the chat handler catches the error and rejects the message.[m
[31m-[m
[31m-```javascript[m
[31m-try {[m
[31m-  verdict = await moderateMessage(text, {[m
[31m-    playerId: socket.data.playerId,[m
[31m-    roomId,[m
[31m-  });[m
[31m-} catch (err) {[m
[31m-  console.error('Moderation error:', err);[m
[31m-[m
[31m-  verdict = {[m
[31m-    allowed: false,[m
[31m-    reason: 'Moderation unavailable',[m
[31m-  };[m
[31m-}[m
[31m-```[m
[31m-[m
[31m-This approach prevents messages from being broadcast when the moderation service cannot provide a result.[m
[31m-[m
[31m-## Where is it implemented?[m
[31m-### AI moderation module — `moderation.js`[m
[31m-This module initializes the OpenAI client and exports `moderateMessage()`. It sends chat text to the Moderation API and returns an allow-or-block verdict.[m
[31m-[m
[31m-### Node.js game server — `server.js`[m
[31m-The game server integrates moderation into the `chat:send` Socket.IO event.[m
[31m-[m
[31m-It validates messages, enforces rate limits, calls the moderation module, handles errors, and broadcasts only approved messages.[m
[1mdiff --git a/doc/monitoring_system.md b/doc/monitoring_system.md[m
[1mdeleted file mode 100644[m
[1mindex 8f72567..0000000[m
[1m--- a/doc/monitoring_system.md[m
[1m+++ /dev/null[m
[36m@@ -1,157 +0,0 @@[m
[31m-# Monitoring System / Prometheus & Grafana[m
[31m-## What is Prometheus?[m
[31m-Prometheus is an open-source monitoring and alerting system that collects and stores metrics as time-series data. It periodically scrapes metrics exposed by applications and exporters, allowing developers to monitor application health, resource usage, and system performance.[m
[31m-[m
[31m-## What is Grafana[m
[31m-Grafana is an open-source observability and visualization platform that connects to data sources such as Prometheus to display metrics through dashboards, graphs, and status panels. It provides a centralized interface to monitor the health and performance of the application.[m
[31m-[m
[31m-## What makes the monitoring system effective?[m
[31m-1. **Application Metrics:** The Node.js server exposes a `/metrics` endpoint using `prom-client`, providing runtime metrics and custom game metrics.[m
[31m-2. **System Monitoring:** Node Exporter exposes system-level metrics such as CPU usage, memory consumption, disk activity, and network statistics.[m
[31m-3. **Centralized Collection:** Prometheus periodically collects metrics from the game server and exporters using configurable scrape jobs.[m
[31m-4. **Custom Dashboards:** Grafana displays relevant application and system metrics, including connected players, active rooms, gameplay activity, CPU usage, and memory usage.[m
[31m-5. **Alerting Rules:** Prometheus evaluates alerting rules to detect conditions such as an unavailable game server or excessive resource usage.[m
[31m-6. **Access Security:** Grafana access is protected by authentication, public sign-up is disabled, and administrator credentials are managed outside the source code.[m
[31m-[m
[31m-## Configuration & tuning[m
[31m-### Key `prometheus.yml` settings:[m
[31m-```yaml[m
[31m-global:[m
[31m-  scrape_interval: 15s[m
[31m-  evaluation_interval: 15s[m
[31m-[m
[31m-rule_files:[m
[31m-  - /etc/prometheus/rules/alerts.yml[m
[31m-[m
[31m-scrape_configs:[m
[31m-  - job_name: "prometheus"[m
[31m-    static_configs:[m
[31m-      - targets: ["prometheus:9090"][m
[31m-[m
[31m-  - job_name: "game-server"[m
[31m-    metrics_path: /metrics[m
[31m-    static_configs:[m
[31m-      - targets: ["game:3001"][m
[31m-[m
[31m-  - job_name: "node-exporter"[m
[31m-    static_configs:[m
[31m-      - targets: ["node-exporter:9100"][m
[31m-```[m
[31m-[m
[31m-- `scrape_interval`: Defines how frequently Prometheus collects metrics.[m
[31m-- `evaluation_interval`: Defines how frequently alerting and recording rules are evaluated.[m
[31m-- `rule_files`: Loads the configured Prometheus alerting rules.[m
[31m-- `scrape_configs`: Defines the Prometheus server and application/exporter targets to monitor.[m
[31m-[m
[31m-### Node.js metrics with `prom-client`[m
[31m-The game server exposes Prometheus-compatible metrics through an HTTP endpoint.[m
[31m-[m
[31m-Example:[m
[31m-[m
[31m-```javascript[m
[31m-import client from 'prom-client';[m
[31m-[m
[31m-const register = new client.Registry();[m
[31m-[m
[31m-client.collectDefaultMetrics({ register });[m
[31m-[m
[31m-app.get('/metrics', async (req, res) => {[m
[31m-  res.set('Content-Type', register.contentType);[m
[31m-  res.end(await register.metrics());[m
[31m-});[m
[31m-```[m
[31m-[m
[31m-Custom application metrics can be added to monitor the state and activity of the game.[m
[31m-[m
[31m-Examples include:[m
[31m-[m
[31m-- `game_connected_players`: Number of currently connected players.[m
[31m-- `game_active_rooms`: Number of active game rooms.[m
[31m-- `game_waiting_players`: Number of players waiting for a match.[m
[31m-- `game_player_moves_total`: Total number of player movement events.[m
[31m-- `game_player_shots_total`: Total number of player shots.[m
[31m-- `game_player_hits_total`: Total number of player hit events.[m
[31m-[m
[31m-These metrics help distinguish application-level problems from infrastructure-level problems.[m
[31m-[m
[31m-### Key `alerts.yml` settings:[m
[31m-```yaml[m
[31m-groups:[m
[31m-  - name: transcendence-alerts[m
[31m-    rules:[m
[31m-      - alert: GameServerDown[m
[31m-        expr: up{job="game-server"} == 0[m
[31m-        for: 30s[m
[31m-        labels:[m
[31m-          severity: critical[m
[31m-        annotations:[m
[31m-          summary: "Game server is down"[m
[31m-          description: "The Transcendence game server has been unreachable for more than 30 seconds."[m
[31m-      - alert: HighMemoryUsage[m
[31m-        expr: 100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) > 90[m
[31m-        for: 2m[m
[31m-        labels:[m
[31m-          severity: warning[m
[31m-        annotations:[m
[31m-          summary: "High memory usage"[m
[31m-          description: "Memory usage is above 90% for more than 2 minutes."[m
[31m-      - alert: HighCPUUsage[m
[31m-        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90[m
[31m-        for: 2m[m
[31m-        labels:[m
[31m-          severity: warning[m
[31m-        annotations:[m
[31m-          summary: "High CPU usage"[m
[31m-          description: "CPU usage is above 90% for more than 2 minutes."[m
[31m-      - alert: TooManyPlayers[m
[31m-        expr: game_connected_players > 10[m
[31m-        for: 1m[m
[31m-        labels:[m
[31m-          severity: warning[m
[31m-        annotations:[m
[31m-          summary: "High number of connected players"[m
[31m-          description: "More than 10 players are connected."[m
[31m-```[m
[31m-[m
[31m-### Grafana dashboards[m
[31m-The Grafana dashboard should provide a clear overview of the application's health and performance and key game KPIs.[m
[31m-[m
[31m-Panels currently implemented:[m
[31m-- **Game Server Status:** Indicates whether Prometheus can scrape the game server.[m
[31m-- **Connected Players:** Displays the number of connected players.[m
[31m-- **Active Rooms:** Displays the number of active game rooms.[m
[31m-- **Waiting Players:** Displays the number of players waiting for a match.[m
[31m-- **Gameplay Activity:** Shows the rate of movement, shot, and hit events.[m
[31m-- **CPU Usage:** Displays system CPU utilization.[m
[31m-- **Memory Usage:** Displays system memory utilization.[m
[31m-- **Network and Disk Activity:** Displays system-level metrics collected by Node Exporter.[m
[31m-[m
[31m-### Grafana security settings[m
[31m-```yaml[m
[31m-environment:[m
[31m-  GF_SECURITY_ADMIN_USER: ${GRAFANA_ADMIN_USER}[m
[31m-  GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD}[m
[31m-  GF_USERS_ALLOW_SIGN_UP: "false"[m
[31m-```[m
[31m-[m
[31m-## Where is it implemented?[m
[31m-### Node.js game server - `server-test/server.js`[m
[31m-The game server exposes the `/metrics` endpoint and registers application-specific metrics through `prom-client`.[m
[31m-[m
[31m-It provides visibility into the game's runtime, player connections, rooms, and gameplay events.[m
[31m-[m
[31m-### Prometheus - `monitoring/prometheus/prometheus.yml`[m
[31m-This configuration defines scrape targets for the game server, Prometheus itself, and Node Exporter.[m
[31m-[m
[31m-Prometheus collects the metrics and evaluates the configured alerting rules.[m
[31m-[m
[31m-### Prometheus alerting rules - `monitoring/prometheus/rules/alerts.yml`[m
[31m-This file contains rules for detecting server availability problems and excessive resource usage.[m
[31m-[m
[31m-### Node Exporter[m
[31m-Node Exporter exposes operating-system metrics for the machine running the application, including CPU, memory, disk, and network statistics.[m
[31m-[m
[31m-### Grafana - `monitoring/grafana/`[m
[31m-Grafana connects to Prometheus as a data source and displays the collected metrics through custom dashboards.[m
[31m-[m
[31m-Provisioning files can be stored here to automate data-source and dashboard configuration.[m
[1mdiff --git a/docker-compose.yml b/docker-compose.yml[m
[1mindex 9a8930f..84d2306 100644[m
[1m--- a/docker-compose.yml[m
[1m+++ b/docker-compose.yml[m
[36m@@ -21,7 +21,6 @@[m [mservices:[m
     build:[m
       context: ./backend[m
       dockerfile: Dockerfile[m
[31m-      network: host[m
     container_name: ft_backend[m
     restart: unless-stopped[m
     entrypoint: ["/bin/sh", "/app/vault.sh"][m
[36m@@ -43,7 +42,6 @@[m [mservices:[m
     build:[m
       context: ./frontend[m
       dockerfile: Dockerfile[m
[31m-      network: host[m
     container_name: ft_frontend[m
     restart: unless-stopped[m
     depends_on:[m
[36m@@ -55,8 +53,9 @@[m [mservices:[m
     build:[m
       context: ./server-test[m
       dockerfile: Dockerfile[m
[31m-      network: host[m
     container_name: ft_game[m
[32m+[m[32m    volumes:[m
[32m+[m[32m      - users_data:/data[m
     ports:[m
       - 3001:3001[m
     restart: unless-stopped[m
[36m@@ -89,13 +88,10 @@[m [mservices:[m
       - transcendence[m
 [m
   prometheus:[m
[31m-    image: prom/prometheus:latest[m
[32m+[m[32m    image: docker.io/prom/prometheus:latest[m
     container_name: prometheus[m
[31m-    restart: unless-stopped[m
[31m-    command:[m
[31m-      - "--config.file=/etc/prometheus/prometheus.yml"[m
[31m-      - "--web.external-url=https://localhost:8443/prometheus/"[m
[31m-      - "--web.route-prefix=/prometheus/"[m
[32m+[m[32m    ports:[m
[32m+[m[32m      - "9090:9090"[m
     volumes:[m
       - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro[m
       - ./monitoring/prometheus/rules:/etc/prometheus/rules:ro[m
[36m@@ -108,9 +104,9 @@[m [mservices:[m
     build:[m
       context: ./monitoring/grafana[m
       dockerfile: Dockerfile[m
[31m-      network: host[m
     container_name: grafana[m
[31m-    restart: unless-stopped[m
[32m+[m[32m    ports:[m
[32m+[m[32m      - "3000:3000"[m
     depends_on:[m
       - prometheus[m
       - vault[m
[36m@@ -118,20 +114,16 @@[m [mservices:[m
       VAULT_ADDR: "http://vault:8200"[m
       VAULT_TOKEN: "root"[m
       GF_USERS_ALLOW_SIGN_UP: "false"[m
[31m-      GF_SERVER_ROOT_URL: "https://localhost:8443/grafana/"[m
[31m-      GF_SERVER_SERVE_FROM_SUB_PATH: "true"[m
     volumes:[m
[31m-      - grafana-data:/var/lib/grafana[m
[31m-      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro[m
[31m-      - ./monitoring/grafana/provisioning/dashboards:/var/lib/grafana/dashboards:ro[m
[32m+[m[32m    - grafana-data:/var/lib/grafana[m
[32m+[m[32m    - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro[m
[32m+[m[32m    - ./monitoring/grafana/provisioning/dashboards:/var/lib/grafana/dashboards:ro[m
     networks:[m
       - transcendence[m
 [m
   node-exporter:[m
[31m-    image: prom/node-exporter:latest[m
[32m+[m[32m    image: docker.io/prom/node-exporter:latest[m
     container_name: node-exporter[m
[31m-    ports:[m
[31m-    - "19100:9100"[m
     networks:[m
       - transcendence[m
 [m
[36m@@ -140,6 +132,7 @@[m [mnetworks:[m
     driver: bridge[m
 [m
 volumes:[m
[32m+[m[32m  users_data:[m
   db_data:[m
   vault_data:[m
   grafana-data:[m
[1mdiff --git a/frontend/menu/public/privacy.html b/frontend/menu/public/privacy.html[m
[1mnew file mode 100644[m
[1mindex 0000000..3d64981[m
[1m--- /dev/null[m
[1m+++ b/frontend/menu/public/privacy.html[m
[36m@@ -0,0 +1,35 @@[m
[32m+[m[32m<!doctype html>[m
[32m+[m[32m<html lang="en">[m
[32m+[m[32m<head>[m
[32m+[m[32m  <meta charset="UTF-8" />[m
[32m+[m[32m  <meta name="viewport" content="width=device-width, initial-scale=1.0" />[m
[32m+[m[32m  <title>Privacy Policy - Transcendence</title>[m
[32m+[m[32m</head>[m
[32m+[m[32m<body>[m
[32m+[m[32m  <main>[m
[32m+[m[32m    <h1>Privacy Policy</h1>[m
[32m+[m
[32m+[m[32m    <h2>What we collect</h2>[m
[32m+[m[32m    <ul>[m
[32m+[m[32m      <li>Nickname, avatar and language chosen in the menu.</li>[m
[32m+[m[32m      <li>A random player identifier, kept in your browser session only.</li>[m
[32m+[m[32m      <li>Gameplay data (positions, shots, hits), shared in real time with your opponent. Nothing is stored.</li>[m
[32m+[m[32m      <li>Chat messages, checked by an automated moderation service (OpenAI API) before delivery.</li>[m
[32m+[m[32m      <li>Technical logs (IP address, browser, requested pages).</li>[m
[32m+[m[32m      <li>account data (email, hashed password)</li>[m
[32m+[m[32m    </ul>[m
[32m+[m
[32m+[m[32m    <h2>Why</h2>[m
[32m+[m[32m    <p>To run matches, keep the chat safe, and operate and secure the service.</p>[m
[32m+[m
[32m+[m[32m    <h2>Third parties</h2>[m
[32m+[m[32m    <p>OpenAI receives chat messages for moderation.</p>[m
[32m+[m
[32m+[m[32m    <h2>Your rights</h2>[m
[32m+[m[32m    <p>You can ask to access, correct or delete your data. Contact: trambure@student.42.fr.</p>[m
[32m+[m
[32m+[m[32m    <h2>Cookies and storage</h2>[m
[32m+[m[32m    <p>Only browser session storage needed for the game. No tracking, no advertising.</p>[m
[32m+[m[32m  </main>[m
[32m+[m[32m</body>[m
[32m+[m[32m</html>[m
\ No newline at end of file[m
[1mdiff --git a/frontend/menu/public/rgpd.html b/frontend/menu/public/rgpd.html[m
[1mnew file mode 100644[m
[1mindex 0000000..afdc223[m
[1m--- /dev/null[m
[1m+++ b/frontend/menu/public/rgpd.html[m
[36m@@ -0,0 +1,67 @@[m
[32m+[m[32m<!doctype html>[m
[32m+[m[32m<html lang="en">[m
[32m+[m[32m<head>[m
[32m+[m[32m  <meta charset="UTF-8" />[m
[32m+[m[32m  <meta name="viewport" content="width=device-width, initial-scale=1.0" />[m
[32m+[m[32m  <title>RGPD - Transcendence</title>[m
[32m+[m[32m</head>[m
[32m+[m[32m<body>[m
[32m+[m[32m  <main>[m
[32m+[m[32m    <h1>RGPD (GDPR Compliance)</h1>[m
[32m+[m
[32m+[m[32m    <h3>1. Data Controller</h3>[m
[32m+[m[32m    <p>The project development team acts as the data controller for personal data collected on this platform.</p>[m
[32m+[m
[32m+[m[32m    <h3>2. Data Collected</h3>[m
[32m+[m[32m    <p>We collect and process only the minimal data strictly necessary to authenticate players, run matches, maintain sessions, and ensure system reliability:</p>[m
[32m+[m[32m    <ul>[m
[32m+[m[32m      <li><strong>Authentication Data:</strong> A username, email address, and an irreversibly hashed password.</li>[m
[32m+[m[32m      <li><strong>Menu choices:</strong> The nickname, avatar and language you choose in the menu. They are passed to the game in the page address.</li>[m
[32m+[m[32m      <li><strong>Gameplay data:</strong> A random player identifier kept in your browser session, and your positions, shots and hits, shared in real time with your opponent. They are not stored after the match.</li>[m
[32m+[m[32m      <li><strong>Chat messages:</strong> Messages you send in the in-game chat are delivered to your opponent and checked by a moderation service before delivery (see section 5).</li>[m
[32m+[m[32m      <li>[m
[32m+[m[32m        <strong>Technical Telemetry &amp; Monitoring:</strong>[m
[32m+[m[32m        <ul>[m
[32m+[m[32m          <li>Aggregate system metrics (server resource utilization, response times, HTTP error rates).</li>[m
[32m+[m[32m          <li>Technical connection logs (timestamps, IP address, browser, requested pages including their parameters, and server-level response codes) used exclusively for performance diagnostics and security.</li>[m
[32m+[m[32m          <li>Player personal data, chat contents and individual game inputs are not exposed to or tracked through the analytical monitoring dashboards.</li>[m
[32m+[m[32m        </ul>[m
[32m+[m[32m      </li>[m
[32m+[m[32m    </ul>[m
[32m+[m
[32m+[m[32m    <h3>3. Purpose &amp; Legal Basis</h3>[m
[32m+[m[32m    <ul>[m
[32m+[m[32m      <li><strong>Account Management &amp; Authentication:</strong> Necessary for the performance of the service contract (Terms of Service).</li>[m
[32m+[m[32m      <li><strong>Matches and gameplay:</strong> Necessary to run the game you asked to play (performance of the service contract).</li>[m
[32m+[m[32m      <li><strong>Chat moderation:</strong> Legitimate interest in keeping the chat safe and preventing abuse.</li>[m
[32m+[m[32m      <li><strong>Security &amp; System Reliability:</strong> Legitimate interest in securing system integrity, preventing unauthorized access, and debugging platform faults.</li>[m
[32m+[m[32m    </ul>[m
[32m+[m
[32m+[m[32m    <h3>4. Data Retention</h3>[m
[32m+[m[32m    <ul>[m
[32m+[m[32m      <li>Account and authentication credentials are retained for the active lifespan of the account and permanently deleted upon user account deletion or deployment tear-down.</li>[m
[32m+[m[32m      <li>Gameplay data lives only during the match and is not kept afterwards.</li>[m
[32m+[m[32m      <li>Technical server and monitoring logs are retained temporarily for diagnostic purposes and are not stored indefinitely.</li>[m
[32m+[m[32m    </ul>[m
[32m+[m
[32m+[m[32m    <h3>5. Data Sharing &amp; Hosting</h3>[m
[32m+[m[32m    <p>No personal data is sold or rented. The platform is hosted locally within the project deployment containers and host server.</p>[m
[32m+[m[32m    <p>The only exception is the in-game chat: each message is sent to a third-party moderation service (the OpenAI API) to be checked before delivery. Messages judged inappropriate are blocked. This provider may process data outside the European Union. Please do not share personal information in the chat.</p>[m
[32m+[m
[32m+[m[32m    <h3>6. Cookies and Browser Storage</h3>[m
[32m+[m[32m    <p>The game stores a random player identifier and the current match identifier in your browser session storage. They are needed to rejoin a match after a page reload and are erased when you close the tab. We do not use tracking or advertising cookies.</p>[m
[32m+[m
[32m+[m[32m    <h3>7. User Rights</h3>[m
[32m+[m[32m    <p>In accordance with the General Data Protection Regulation (GDPR), users hold the following rights regarding their personal data:</p>[m
[32m+[m[32m    <ul>[m
[32m+[m[32m      <li><strong>Right of access, rectification, and erasure:</strong> The right to inspect and delete account data ("Right to be Forgotten").</li>[m
[32m+[m[32m      <li><strong>Right to data portability:</strong> The right to export personal account data in a structured, standard format.</li>[m
[32m+[m[32m      <li><strong>Right to restriction and objection:</strong> The right to contest data processing under specific conditions.</li>[m
[32m+[m[32m    </ul>[m
[32m+[m[32m    <p>To exercise these rights, users may delete their profile or submit a request directly through the service interface. Users also retain the right to lodge a complaint with a supervisory data protection authority (such as the CNIL in France).</p>[m
[32m+[m
[32m+[m[32m    <p>See also our <a href="/privacy.html">Privacy Policy</a> and <a href="/terms.html">Terms of Service</a>.</p>[m
[32m+[m[32m  </main>[m
[32m+[m[32m</body>[m
[32m+[m[32m</html>[m
[32m+[m[32mEOF[m
\ No newline at end of file[m
[1mdiff --git a/frontend/menu/public/terms.html b/frontend/menu/public/terms.html[m
[1mnew file mode 100644[m
[1mindex 0000000..33c2b2b[m
[1m--- /dev/null[m
[1m+++ b/frontend/menu/public/terms.html[m
[36m@@ -0,0 +1,48 @@[m
[32m+[m[32m<!doctype html>[m
[32m+[m[32m<html lang="en">[m
[32m+[m[32m<head>[m
[32m+[m[32m  <meta charset="UTF-8" />[m
[32m+[m[32m  <meta name="viewport" content="width=device-width, initial-scale=1.0" />[m
[32m+[m[32m  <title>Terms of Service - Transcendence</title>[m
[32m+[m[32m</head>[m
[32m+[m[32m<body>[m
[32m+[m[32m  <main>[m
[32m+[m[32m    <h1>Terms of Service</h1>[m
[32m+[m
[32m+[m[32m    <h2>1. About this service</h2>[m
[32m+[m[32m    <p>Transcendence is a multiplayer web game created as a school project at 42. By using it, you accept these terms. If you do not accept them, please do not use the service.</p>[m
[32m+[m
[32m+[m[32m    <h2>2. Who can play</h2>[m
[32m+[m[32m    <p>minimum age: 16.</p>[m
[32m+[m
[32m+[m[32m    <h2>3. Nickname and conduct</h2>[m
[32m+[m[32m    <ul>[m
[32m+[m[32m      <li>Choose a nickname that is not offensive and does not impersonate someone else.</li>[m
[32m+[m[32m      <li>No harassment, hate speech or threats, in the chat or in your nickname.</li>[m
[32m+[m[32m      <li>No cheating: do not modify the game client, send forged messages to the server, or exploit bugs to gain an advantage. Please report bugs instead.</li>[m
[32m+[m[32m      <li>Do not try to disrupt the service (flooding, attacks, automated abuse).</li>[m
[32m+[m[32m    </ul>[m
[32m+[m
[32m+[m[32m    <h2>4. Chat and moderation</h2>[m
[32m+[m[32m    <p>Chat messages are checked by an automated moderation service before being delivered. Messages judged inappropriate are blocked, and a message can also be refused if the moderation service is unavailable. The number of messages you can send in a short time is limited.</p>[m
[32m+[m
[32m+[m[32m    <h2>5. Matches and disconnections</h2>[m
[32m+[m[32m    <p>Matches are played one against one and are won by the first player to win 3 rounds. If a player disconnects, the opponent waits 20 seconds for them to come back. After that delay the match is abandoned. If only one player is ready for the next round, the round starts automatically after 15 seconds. Match results are not stored and do not give any reward.</p>[m
[32m+[m
[32m+[m[32m    <h2>6. Availability</h2>[m
[32m+[m[32m    <p>The service is provided "as is", without any guarantee. It may be unavailable, restarted or modified at any time, which can end a match in progress. TODO: add the liability clause validated by the team.</p>[m
[32m+[m
[32m+[m[32m    <h2>7. Intellectual property</h2>[m
[32m+[m[32m    <p>The source code belongs to its authors. The 3D models (weapon and character) come from third parties. TODO: credits and licenses for each model.</p>[m
[32m+[m
[32m+[m[32m    <h2>8. Personal data</h2>[m
[32m+[m[32m    <p>How we handle your data is described in our <a href="/privacy.html">Privacy Policy</a>.</p>[m
[32m+[m
[32m+[m[32m    <h2>9. Changes and suspension</h2>[m
[32m+[m[32m    <p>We may update these terms, and we may block a player who breaks them. The date at the top shows the latest version.</p>[m
[32m+[m
[32m+[m[32m    <h2>10. Contact</h2>[m
[32m+[m[32m    <p>Contact: trambure@student.42.fr.</p>[m
[32m+[m[32m  </main>[m
[32m+[m[32m</body>[m
[32m+[m[32m</html>[m
\ No newline at end of file[m
[1mdiff --git a/frontend/menu/src/App.tsx b/frontend/menu/src/App.tsx[m
[1mindex 1971f3b..95a5e55 100644[m
[1m--- a/frontend/menu/src/App.tsx[m
[1m+++ b/frontend/menu/src/App.tsx[m
[36m@@ -1,34 +1,54 @@[m
[31m-import { useState } from 'react';[m
[32m+[m[32mimport { useEffect, useState } from 'react';[m[41m[m
 import HomeScreen from './HomeScreen';[m
 import CommandsScreen from './CommandsScreen';[m
[32m+[m[32mimport LoginScreen from './LoginScreen';[m[41m[m
[32m+[m[32mimport SignupScreen from './SignupScreen';[m[41m[m
[32m+[m[32mimport ProfileScreen from './ProfileScreen';[m[41m[m
 import type { Language } from './translations';[m
[32m+[m[32mimport { translations } from './translations';[m[41m[m
[32m+[m[41m[m
[32m+[m[32mexport type User = {[m[41m[m
[32m+[m[32m  id: string;[m[41m[m
[32m+[m[32m  pseudo: string;[m[41m[m
[32m+[m[32m  avatar: string;[m[41m[m
[32m+[m[32m  language: Language;[m[41m[m
[32m+[m[32m};[m[41m[m
 [m
 export default function App() {[m
[31m-  // App garde le pseudo pour pouvoir le partager avec les futurs écrans.[m
[31m-  const [pseudo, setPseudo] = useState('');[m
[31m-  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');[m
[31m-  const [selectedAvatar, setSelectedAvatar] = useState('human');[m
[32m+[m[32m  const [user, setUser] = useState<User | null>(null);[m[41m[m
[32m+[m[32m  const [loading, setLoading] = useState(true);[m[41m[m
   const [selectedScreen, setSelectedScreen] = useState('home');[m
[32m+[m[32m  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');[m[41m[m
[32m+[m[41m[m
[32m+[m[32m  useEffect(() => {[m[41m[m
[32m+[m[32m    async function loadUser() {[m[41m[m
[32m+[m[32m      try {[m[41m[m
[32m+[m[32m        const response = await fetch('/api/account/me');[m[41m[m
[32m+[m[32m        if (response.ok) {[m[41m[m
[32m+[m[32m          const connectedUser: User = await response.json();[m[41m[m
[32m+[m[32m          setUser(connectedUser);[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m      } finally {[m[41m[m
[32m+[m[32m        setLoading(false);[m[41m[m
[32m+[m[32m      }[m[41m[m
[32m+[m[32m    }[m[41m[m
[32m+[m[32m    loadUser().catch(() => {});[m[41m[m
[32m+[m[32m  }, []);[m[41m[m
 [m
[31m-  // Si on a choisi les commandes, on affiche cet écran à la place de l'accueil.[m
[32m+[m[32m  if (loading) return <p lang={selectedLanguage}>{translations[selectedLanguage].loading}</p>;[m[41m[m
[32m+[m[32m  if (!user && selectedScreen === 'signup') {[m[41m[m
[32m+[m[32m    return <SignupScreen setUser={setUser} setSelectedScreen={setSelectedScreen}[m[41m[m
[32m+[m[32m      selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />;[m[41m[m
[32m+[m[32m  }[m[41m[m
[32m+[m[32m  if (!user) {[m[41m[m
[32m+[m[32m    return <LoginScreen setUser={setUser} setSelectedScreen={setSelectedScreen}[m[41m[m
[32m+[m[32m      selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />;[m[41m[m
[32m+[m[32m  }[m[41m[m
[32m+[m[32m  if (selectedScreen === 'profile') {[m[41m[m
[32m+[m[32m    return <ProfileScreen user={user} setUser={setUser} setSelectedScreen={setSelectedScreen} />;[m[41m[m
[32m+[m[32m  }[m[41m[m
   if (selectedScreen === 'commands') {[m
[31m-    return ([m
[31m-      <CommandsScreen[m
[31m-        selectedLanguage={selectedLanguage}[m
[31m-        setSelectedScreen={setSelectedScreen}[m
[31m-      />[m
[31m-    );[m
[32m+[m[32m    return <CommandsScreen selectedLanguage={user.language} setSelectedScreen={setSelectedScreen} />;[m[41m[m
   }[m
[31m-[m
[31m-  return ([m
[31m-    <HomeScreen[m
[31m-      pseudo={pseudo}[m
[31m-      setPseudo={setPseudo}[m
[31m-      selectedLanguage={selectedLanguage}[m
[31m-      setSelectedLanguage={setSelectedLanguage}[m
[31m-      selectedAvatar={selectedAvatar}[m
[31m-      setSelectedAvatar={setSelectedAvatar}[m
[31m-      setSelectedScreen={setSelectedScreen}[m
[31m-    />[m
[31m-  );[m
[32m+[m[32m  return <HomeScreen user={user} setUser={setUser} setSelectedScreen={setSelectedScreen} />;[m[41m[m
 }[m
[1mdiff --git a/frontend/menu/src/HomeScreen.tsx b/frontend/menu/src/HomeScreen.tsx[m
[1mindex b532a8d..93fca0c 100644[m
[1m--- a/frontend/menu/src/HomeScreen.tsx[m
[1m+++ b/frontend/menu/src/HomeScreen.tsx[m
[36m@@ -1,92 +1,62 @@[m
[31m-import TextInput from './components/TextInput';[m
[31m-import LanguageSelector from './components/LanguageSelector';[m
[31m-import AvatarOption from './components/AvatarOption';[m
[32m+[m[32mimport { useState } from 'react';[m
 import Accordion from './components/Accordion';[m
 import Button from './components/Button';[m
 import { translations } from './translations';[m
[31m-import type { Language } from './translations';[m
[31m-[m
[31m-// En dev : le jeu tourne sur son propre port. Derriere le proxy : il est servi sur /game/.[m
[31m-const GAME_URL = import.meta.env.DEV ? 'http://localhost:5173/' : '/game/';[m
[32m+[m[32mimport type { User } from './App';[m
 [m
 type HomeScreenProps = {[m
[31m-  pseudo: string;[m
[31m-  setPseudo: (value: string) => void;[m
[31m-  selectedLanguage: Language;[m
[31m-  setSelectedLanguage: (newLanguage: Language) => void;[m
[31m-  selectedAvatar: string;[m
[31m-  setSelectedAvatar: (newAvatar: string) => void;[m
[32m+[m[32m  user: User;[m
[32m+[m[32m  setUser: (newUser: User | null) => void;[m
   setSelectedScreen: (newScreen: string) => void;[m
 };[m
 [m
[31m-export default function HomeScreen({[m
[31m-  pseudo,[m
[31m-  setPseudo,[m
[31m-  selectedLanguage,[m
[31m-  setSelectedLanguage,[m
[31m-  selectedAvatar,[m
[31m-  setSelectedAvatar,[m
[31m-  setSelectedScreen,[m
[31m-}: HomeScreenProps) {[m
[31m-  // On choisit les textes qui correspondent à la langue actuelle.[m
[31m-  const languageText = translations[selectedLanguage];[m
[31m-  const avatarsTableau = [[m
[31m-    { id: 'human', label: languageText.avatarHuman },[m
[31m-    { id: 'robot', label: languageText.avatarRobot },[m
[31m-    { id: 'cat', label: languageText.avatarCat },[m
[31m-    { id: 'alien', label: languageText.avatarAlien },[m
[31m-  ];[m
[32m+[m[32mexport default function HomeScreen({ user, setUser, setSelectedScreen }: HomeScreenProps) {[m
[32m+[m[32m  const languageText = translations[user.language];[m
[32m+[m[32m  const [errorMessage, setErrorMessage] = useState('');[m
[32m+[m
[32m+[m[32m  async function logout() {[m
[32m+[m[32m    try {[m
[32m+[m[32m      const response = await fetch('/api/account/logout', { method: 'POST' });[m
[32m+[m[32m      if (!response.ok) {[m
[32m+[m[32m        setErrorMessage(languageText.logoutFailed);[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m[32m      setUser(null);[m
[32m+[m[32m      setSelectedScreen('home');[m
[32m+[m[32m    } catch {[m
[32m+[m[32m      setErrorMessage(languageText.serverUnavailable);[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
 [m
   return ([m
[31m-    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">[m
[32m+[m[32m    <main lang={user.language} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">[m
       <div className="w-full max-w-sm">[m
[31m-        <h1 className="mb-9 text-center text-2xl font-bold text-yellow-400">[m
[31m-          TRANSCENDENCE[m
[31m-        </h1>[m
[31m-        <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />[m
[31m-        <TextInput[m
[31m-          id="pseudo"[m
[31m-          label={languageText.pseudoLabel}[m
[31m-          placeholder={languageText.pseudoPlaceholder}[m
[31m-          value={pseudo}[m
[31m-          setPseudo={setPseudo}[m
[31m-        />[m
[31m-        <fieldset className="mt-6">[m
[31m-          <legend className="mb-3">{languageText.avatarLabel}</legend>[m
[31m-          <div className="flex flex-wrap justify-between gap-2">[m
[31m-            {avatarsTableau.map((avatar) => ([m
[31m-              <AvatarOption[m
[31m-                key={avatar.id}[m
[31m-                avatarId={avatar.id}[m
[31m-                avatarLabel={avatar.label}[m
[31m-                selectedAvatar={selectedAvatar}[m
[31m-                setSelectedAvatar={setSelectedAvatar}[m
[31m-              />[m
[31m-            ))}[m
[31m-          </div>[m
[31m-        </fieldset>[m
[31m-        <Accordion[m
[31m-          title={languageText.rulesTitle}[m
[31m-          paragraphs={languageText.rulesParagraphs}[m
[31m-        />[m
[32m+[m[32m        <h1 className="mb-9 text-center text-2xl font-bold text-yellow-400">TRANSCENDENCE</h1>[m
[32m+[m
[32m+[m[32m        <p>{user.pseudo}</p>[m
[32m+[m[32m        <Accordion title={languageText.rulesTitle} paragraphs={languageText.rulesParagraphs} />[m
         <div className="mt-6 flex flex-col gap-3">[m
[31m-          <Button[m
[31m-            text={languageText.playButton}[m
[31m-            onClick={() => {[m
[31m-              const params = new URLSearchParams({[m
[31m-                name: pseudo,[m
[31m-                avatar: selectedAvatar,[m
[31m-                lang: selectedLanguage,[m
[31m-              });[m
[31m-              window.location.href = `${GAME_URL}?${params.toString()}`;[m
[31m-            }}[m
[31m-          />[m
[31m-          <Button[m
[31m-            text={languageText.commandsTitle}[m
[31m-            onClick={() => setSelectedScreen('commands')}[m
[31m-          />[m
[32m+[m
[32m+[m[32m          <Button text={languageText.playButton} onClick={() => { window.location.href = '/game/'; }} />[m
[32m+[m
[32m+[m[32m          <Button text={languageText.commandsTitle} onClick={() => setSelectedScreen('commands')} />[m
[32m+[m[32m          <Button text={languageText.profileButton} onClick={() => setSelectedScreen('profile')} />[m
[32m+[m[32m          <Button text={languageText.logoutButton} onClick={logout} />[m
         </div>[m
[32m+[m[32m        <p>{errorMessage}</p>[m
[32m+[m
[32m+[m[32m        <footer className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-400">[m
[32m+[m[32m          <a href="/privacy.html" className="underline hover:text-white">[m
[32m+[m[32m            {languageText.privacyLink}[m
[32m+[m[32m          </a>[m
[32m+[m[32m          <a href="/rgpd.html" className="underline hover:text-white">[m
[32m+[m[32m            {languageText.dataProtectionLink}[m
[32m+[m[32m          </a>[m
[32m+[m[32m          <a href="/terms.html" className="underline hover:text-white">[m
[32m+[m[32m            {languageText.termsLink}[m
[32m+[m[32m          </a>[m
[32m+[m[32m        </footer>[m
       </div>[m
     </main>[m
   );[m
[31m-}[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/frontend/menu/src/LoginScreen.tsx b/frontend/menu/src/LoginScreen.tsx[m
[1mnew file mode 100644[m
[1mindex 0000000..28de678[m
[1m--- /dev/null[m
[1m+++ b/frontend/menu/src/LoginScreen.tsx[m
[36m@@ -0,0 +1,71 @@[m
[32m+[m[32mimport { useState } from 'react';[m
[32m+[m[32mimport type { SubmitEvent } from 'react';[m
[32m+[m[32mimport type { User } from './App';[m
[32m+[m[32mimport Button from './components/Button';[m
[32m+[m[32mimport LanguageSelector from './components/LanguageSelector';[m
[32m+[m[32mimport { translations } from './translations';[m
[32m+[m[32mimport type { Language } from './translations';[m
[32m+[m
[32m+[m[32mtype LoginScreenProps = {[m
[32m+[m[32m  selectedLanguage: Language;[m
[32m+[m[32m  setSelectedLanguage: (newLanguage: Language) => void;[m
[32m+[m[32m  setUser: (newUser: User | null) => void;[m
[32m+[m[32m  setSelectedScreen: (newScreen: string) => void;[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mexport default function LoginScreen({ setUser, setSelectedScreen, selectedLanguage, setSelectedLanguage }: LoginScreenProps) {[m
[32m+[m[32m  const [email, setEmail] = useState('');[m
[32m+[m[32m  const [password, setPassword] = useState('');[m
[32m+[m[32m  const [errorMessage, setErrorMessage] = useState('');[m
[32m+[m[32m  const languageText = translations[selectedLanguage];[m
[32m+[m
[32m+[m[32m  function changeLanguage(newLanguage: Language) {[m
[32m+[m[32m    setSelectedLanguage(newLanguage);[m
[32m+[m[32m    setErrorMessage('');[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  async function login(event: SubmitEvent<HTMLFormElement>) {[m
[32m+[m[32m    event.preventDefault();[m
[32m+[m[32m    setErrorMessage('');[m
[32m+[m[32m    try {[m
[32m+[m[32m      const response = await fetch('/api/account/login', {[m
[32m+[m[32m        method: 'POST',[m
[32m+[m[32m        headers: { 'Content-Type': 'application/json' },[m
[32m+[m[32m        body: JSON.stringify({ email, password }),[m
[32m+[m[32m      });[m
[32m+[m[32m      if (!response.ok) {[m
[32m+[m[32m        setErrorMessage(languageText.loginFailed);[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m[32m      const connectedUser: User = await response.json();[m
[32m+[m[32m      setUser(connectedUser);[m
[32m+[m[32m      setSelectedScreen('home');[m
[32m+[m[32m    } catch {[m
[32m+[m[32m      setErrorMessage(languageText.serverUnavailable);[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  return ([m
[32m+[m[32m    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">[m
[32m+[m[32m      <div className="w-full max-w-sm">[m
[32m+[m[32m        <h1 className="mb-6 text-2xl text-yellow-400">{languageText.loginTitle}</h1>[m
[32m+[m[32m        <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={changeLanguage} />[m
[32m+[m[32m        <form onSubmit={login} className="flex flex-col gap-4">[m
[32m+[m[32m          <label>{languageText.emailLabel}[m
[32m+[m[32m            <input className="w-full rounded border bg-neutral-900 p-3" type="email" required[m
[32m+[m[32m              value={email} onChange={event => setEmail(event.target.value)} />[m
[32m+[m[32m          </label>[m
[32m+[m[32m          <label>{languageText.passwordLabel}[m
[32m+[m[32m            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required maxLength={128}[m
[32m+[m[32m              value={password} onChange={event => setPassword(event.target.value)} />[m
[32m+[m[32m          </label>[m
[32m+[m[32m          <p>{errorMessage}</p>[m
[32m+[m[32m          <button className="rounded bg-yellow-400 p-3 text-black" type="submit">{languageText.loginButton}</button>[m
[32m+[m[32m        </form>[m
[32m+[m[32m        <div className="mt-4">[m
[32m+[m[32m          <Button text={languageText.signupTitle} onClick={() => setSelectedScreen('signup')} />[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </main>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
[1mdiff --git a/frontend/menu/src/ProfileScreen.tsx b/frontend/menu/src/ProfileScreen.tsx[m
[1mnew file mode 100644[m
[1mindex 0000000..8bc289b[m
[1m--- /dev/null[m
[1m+++ b/frontend/menu/src/ProfileScreen.tsx[m
[36m@@ -0,0 +1,110 @@[m
[32m+[m[32mimport { useState } from 'react';[m
[32m+[m[32mimport type { SubmitEvent } from 'react';[m
[32m+[m[32mimport type { User } from './App';[m
[32m+[m[32mimport TextInput from './components/TextInput';[m
[32m+[m[32mimport LanguageSelector from './components/LanguageSelector';[m
[32m+[m[32mimport AvatarOption from './components/AvatarOption';[m
[32m+[m[32mimport Button from './components/Button';[m
[32m+[m[32mimport { translations } from './translations';[m
[32m+[m[32mimport type { Language } from './translations';[m
[32m+[m
[32m+[m[32mtype ProfileScreenProps = {[m
[32m+[m[32m  user: User;[m
[32m+[m[32m  setUser: (newUser: User | null) => void;[m
[32m+[m[32m  setSelectedScreen: (newScreen: string) => void;[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mexport default function ProfileScreen({ user, setUser, setSelectedScreen }: ProfileScreenProps) {[m
[32m+[m[32m  const [pseudo, setPseudo] = useState(user.pseudo);[m
[32m+[m[32m  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);[m
[32m+[m[32m  const [selectedLanguage, setSelectedLanguage] = useState(user.language);[m
[32m+[m[32m  const [errorMessage, setErrorMessage] = useState('');[m
[32m+[m[32m  const languageText = translations[selectedLanguage];[m
[32m+[m[32m  const avatarsTableau = [[m
[32m+[m[32m    { id: 'human', label: languageText.avatarHuman },[m
[32m+[m[32m    { id: 'robot', label: languageText.avatarRobot },[m
[32m+[m[32m    { id: 'cat', label: languageText.avatarCat },[m
[32m+[m[32m    { id: 'alien', label: languageText.avatarAlien },[m
[32m+[m[32m  ];[m
[32m+[m
[32m+[m[32m  function changeLanguage(newLanguage: Language) {[m
[32m+[m[32m    setSelectedLanguage(newLanguage);[m
[32m+[m[32m    setErrorMessage('');[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  async function saveProfile(event: SubmitEvent<HTMLFormElement>) {[m
[32m+[m[32m    event.preventDefault();[m
[32m+[m[32m    setErrorMessage('');[m
[32m+[m[32m    if (!pseudo.trim() || pseudo.length > 24) {[m
[32m+[m[32m      setErrorMessage(languageText.invalidNickname);[m
[32m+[m[32m      return;[m
[32m+[m[32m    }[m
[32m+[m[32m    try {[m
[32m+[m[32m      const response = await fetch('/api/account/profile', {[m
[32m+[m[32m        method: 'PUT',[m
[32m+[m[32m        headers: { 'Content-Type': 'application/json' },[m
[32m+[m[32m        body: JSON.stringify({ pseudo, avatar: selectedAvatar, language: selectedLanguage }),[m
[32m+[m[32m      });[m
[32m+[m[32m      if (!response.ok) {[m
[32m+[m[32m        setErrorMessage(languageText.saveFailed);[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m[32m      setUser(await response.json());[m
[32m+[m[32m      setSelectedScreen('home');[m
[32m+[m[32m    } catch {[m
[32m+[m[32m      setErrorMessage(languageText.serverUnavailable);[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  async function deleteAccount() {[m
[32m+[m[32m    if (!window.confirm(languageText.deleteAccountConfirmation)) {[m
[32m+[m[32m      return;[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    setErrorMessage('');[m
[32m+[m[32m    try {[m
[32m+[m[32m      const response = await fetch('/api/account/me', {[m
[32m+[m[32m        method: 'DELETE',[m
[32m+[m[32m      });[m
[32m+[m[32m      if (!response.ok) {[m
[32m+[m[32m        setErrorMessage(languageText.deleteFailed);[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m[32m      setUser(null);[m
[32m+[m[32m      setSelectedScreen('home');[m
[32m+[m[32m    } catch {[m
[32m+[m[32m      setErrorMessage(languageText.serverUnavailable);[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  return ([m
[32m+[m[32m    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">[m
[32m+[m[32m      <div className="w-full max-w-sm">[m
[32m+[m[32m        <h1 className="mb-6 text-2xl text-yellow-400">{languageText.profileButton}</h1>[m
[32m+[m[32m        <form onSubmit={saveProfile}>[m
[32m+[m[32m          <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={changeLanguage} />[m
[32m+[m[32m          <TextInput id="pseudo" label={languageText.pseudoLabel} placeholder={languageText.pseudoPlaceholder}[m
[32m+[m[32m            value={pseudo} setPseudo={setPseudo} />[m
[32m+[m[32m          <fieldset className="mt-6">[m
[32m+[m[32m            <legend>{languageText.avatarLabel}</legend>[m
[32m+[m[32m            <div className="flex gap-2">[m
[32m+[m[32m              {avatarsTableau.map(avatar => ([m
[32m+[m[32m                <AvatarOption key={avatar.id} avatarId={avatar.id} avatarLabel={avatar.label}[m
[32m+[m[32m                  selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />[m
[32m+[m[32m              ))}[m
[32m+[m[32m            </div>[m
[32m+[m[32m          </fieldset>[m
[32m+[m[32m          <p>{errorMessage}</p>[m
[32m+[m[32m          <button className="mt-6 w-full rounded bg-yellow-400 p-3 text-black" type="submit">{languageText.saveButton}</button>[m
[32m+[m[32m        </form>[m
[32m+[m[32m        <div className="mt-4">[m
[32m+[m[32m          <Button text={languageText.backToMenu} onClick={() => setSelectedScreen('home')} />[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <button className="mt-4 w-full rounded border border-red-400 p-3 text-red-400"[m
[32m+[m[32m          type="button" onClick={deleteAccount}>[m
[32m+[m[32m          {languageText.deleteAccountButton}[m
[32m+[m[32m        </button>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </main>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
[1mdiff --git a/frontend/menu/src/SignupScreen.tsx b/frontend/menu/src/SignupScreen.tsx[m
[1mnew file mode 100644[m
[1mindex 0000000..8b01980[m
[1m--- /dev/null[m
[1m+++ b/frontend/menu/src/SignupScreen.tsx[m
[36m@@ -0,0 +1,88 @@[m
[32m+[m[32mimport { useState } from 'react';[m
[32m+[m[32mimport type { SubmitEvent } from 'react';[m
[32m+[m[32mimport type { User } from './App';[m
[32m+[m[32mimport Button from './components/Button';[m
[32m+[m[32mimport LanguageSelector from './components/LanguageSelector';[m
[32m+[m[32mimport { translations } from './translations';[m
[32m+[m[32mimport type { Language } from './translations';[m
[32m+[m
[32m+[m[32mtype SignupScreenProps = {[m
[32m+[m[32m  selectedLanguage: Language;[m
[32m+[m[32m  setSelectedLanguage: (newLanguage: Language) => void;[m
[32m+[m[32m  setUser: (newUser: User | null) => void;[m
[32m+[m[32m  setSelectedScreen: (newScreen: string) => void;[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mexport default function SignupScreen({ setUser, setSelectedScreen, selectedLanguage, setSelectedLanguage }: SignupScreenProps) {[m
[32m+[m[32m  const [email, setEmail] = useState('');[m
[32m+[m[32m  const [pseudo, setPseudo] = useState('');[m
[32m+[m[32m  const [password, setPassword] = useState('');[m
[32m+[m[32m  const [passwordConfirmation, setPasswordConfirmation] = useState('');[m
[32m+[m[32m  const [errorMessage, setErrorMessage] = useState('');[m
[32m+[m[32m  const languageText = translations[selectedLanguage];[m
[32m+[m
[32m+[m[32m  function changeLanguage(newLanguage: Language) {[m
[32m+[m[32m    setSelectedLanguage(newLanguage);[m
[32m+[m[32m    setErrorMessage('');[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  async function signup(event: SubmitEvent<HTMLFormElement>) {[m
[32m+[m[32m    event.preventDefault();[m
[32m+[m[32m    setErrorMessage('');[m
[32m+[m[32m    if (!pseudo.trim()) {[m
[32m+[m[32m      setErrorMessage(languageText.emptyNickname);[m
[32m+[m[32m      return;[m
[32m+[m[32m    }[m
[32m+[m[32m    if (password !== passwordConfirmation) {[m
[32m+[m[32m      setErrorMessage(languageText.passwordMismatch);[m
[32m+[m[32m      return;[m
[32m+[m[32m    }[m
[32m+[m[32m    try {[m
[32m+[m[32m      const response = await fetch('/api/account/register', {[m
[32m+[m[32m        method: 'POST',[m
[32m+[m[32m        headers: { 'Content-Type': 'application/json' },[m
[32m+[m[32m        body: JSON.stringify({ email, pseudo, password, language: selectedLanguage }),[m
[32m+[m[32m      });[m
[32m+[m[32m      if (!response.ok) {[m
[32m+[m[32m        setErrorMessage(languageText.signupFailed);[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m[32m      setUser(await response.json());[m
[32m+[m[32m      setSelectedScreen('home');[m
[32m+[m[32m    } catch {[m
[32m+[m[32m      setErrorMessage(languageText.serverUnavailable);[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  return ([m
[32m+[m[32m    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">[m
[32m+[m[32m      <div className="w-full max-w-sm">[m
[32m+[m[32m        <h1 className="mb-6 text-2xl text-yellow-400">{languageText.signupTitle}</h1>[m
[32m+[m[32m        <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={changeLanguage} />[m
[32m+[m[32m        <form onSubmit={signup} className="flex flex-col gap-4">[m
[32m+[m[32m          <label>{languageText.emailLabel}[m
[32m+[m[32m            <input className="w-full rounded border bg-neutral-900 p-3" type="email" required[m
[32m+[m[32m              value={email} onChange={event => setEmail(event.target.value)} />[m
[32m+[m[32m          </label>[m
[32m+[m[32m          <label>{languageText.nicknameLabel}[m
[32m+[m[32m            <input className="w-full rounded border bg-neutral-900 p-3" required maxLength={24}[m
[32m+[m[32m              value={pseudo} onChange={event => setPseudo(event.target.value)} />[m
[32m+[m[32m          </label>[m
[32m+[m[32m          <label>{languageText.signupPasswordLabel}[m
[32m+[m[32m            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required minLength={5} maxLength={128}[m
[32m+[m[32m              value={password} onChange={event => setPassword(event.target.value)} />[m
[32m+[m[32m          </label>[m
[32m+[m[32m          <label>{languageText.passwordConfirmationLabel}[m
[32m+[m[32m            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required[m
[32m+[m[32m              value={passwordConfirmation} onChange={event => setPasswordConfirmation(event.target.value)} />[m
[32m+[m[32m          </label>[m
[32m+[m[32m          <p>{errorMessage}</p>[m
[32m+[m[32m          <button className="rounded bg-yellow-400 p-3 text-black" type="submit">{languageText.signupButton}</button>[m
[32m+[m[32m        </form>[m
[32m+[m[32m        <div className="mt-4">[m
[32m+[m[32m          <Button text={languageText.backToLogin} onClick={() => setSelectedScreen('home')} />[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </main>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
[1mdiff --git a/frontend/menu/src/main.tsx b/frontend/menu/src/main.tsx[m
[1mindex 28fa6e2..2f2ad6e 100644[m
[1m--- a/frontend/menu/src/main.tsx[m
[1m+++ b/frontend/menu/src/main.tsx[m
[36m@@ -1,22 +1,8 @@[m
[31m-// createRoot permet à React de gérer l'affichage dans un élément HTML.[m
 import { createRoot } from 'react-dom/client';[m
[31m-// App est notre composant principal : il contient le reste de l'interface.[m
 import App from './App';[m
[31m-// Ce fichier importe Tailwind pour appliquer les styles de nos composants.[m
 import './index.css';[m
[31m-[m
[31m-// On récupère le <div id="root"></div> présent dans index.html.[m
[31m-// Ici, "root" est la variable qui contient cet élément HTML.[m
 const root = document.getElementById('root');[m
[31m-[m
[31m-// Si l'élément n'existe pas, on arrête le démarrage avec un message d'erreur.[m
[31m-// Cette vérification indique aussi à TypeScript que root existe après le if.[m
 if (!root) {[m
   throw new Error('Élément #root introuvable.');[m
 }[m
[31m-[m
[31m-// createRoot(root) prépare React à afficher notre interface dans ce div.[m
[31m-// .render(<App />) demande à React d'y afficher le composant App.[m
[31m-// <App /> est du JSX : une syntaxe qui ressemble au HTML et utilise ici[m
[31m-// notre composant. L'extension .tsx permet d'écrire du JSX avec TypeScript.[m
 createRoot(root).render(<App />);[m
[1mdiff --git a/frontend/menu/src/translations.ts b/frontend/menu/src/translations.ts[m
[1mindex d3ef63e..4eeb386 100644[m
[1m--- a/frontend/menu/src/translations.ts[m
[1m+++ b/frontend/menu/src/translations.ts[m
[36m@@ -1,8 +1,35 @@[m
[31m-// La langue ne peut prendre que l'une de ces trois valeurs.[m
 export type Language = 'fr' | 'en' | 'es';[m
 [m
 export const translations = {[m
   fr: {[m
[32m+[m[32m    loading: 'Chargement...',[m[41m[m
[32m+[m[32m    profileButton: 'Mon profil',[m[41m[m
[32m+[m[32m    logoutButton: 'Déconnexion',[m[41m[m
[32m+[m[32m    loginTitle: 'Connexion',[m[41m[m
[32m+[m[32m    emailLabel: 'Email',[m[41m[m
[32m+[m[32m    passwordLabel: 'Mot de passe',[m[41m[m
[32m+[m[32m    loginButton: 'Se connecter',[m[41m[m
[32m+[m[32m    signupTitle: 'Créer un compte',[m[41m[m
[32m+[m[32m    nicknameLabel: 'Pseudo',[m[41m[m
[32m+[m[32m    signupPasswordLabel: 'Mot de passe (5 caractères minimum)',[m[41m[m
[32m+[m[32m    passwordConfirmationLabel: 'Confirmer le mot de passe',[m[41m[m
[32m+[m[32m    signupButton: 'Créer mon compte',[m[41m[m
[32m+[m[32m    backToLogin: 'Retour à la connexion',[m[41m[m
[32m+[m[32m    saveButton: 'Enregistrer',[m[41m[m
[32m+[m[32m    deleteAccountButton: 'Supprimer mon compte',[m[41m[m
[32m+[m[32m    deleteAccountConfirmation: 'Supprimer définitivement ton compte ? Cette action est irréversible.',[m[41m[m
[32m+[m[32m    loginFailed: 'Connexion refusée',[m[41m[m
[32m+[m[32m    serverUnavailable: 'Serveur inaccessible',[m[41m[m
[32m+[m[32m    emptyNickname: 'Le pseudo ne peut pas être vide ou contenir uniquement des espaces.',[m[41m[m
[32m+[m[32m    passwordMismatch: 'Les mots de passe sont différents',[m[41m[m
[32m+[m[32m    signupFailed: 'Inscription refusée : vérifie les champs ou utilise un autre email.',[m[41m[m
[32m+[m[32m    invalidNickname: 'Le pseudo doit contenir entre 1 et 24 caractères.',[m[41m[m
[32m+[m[32m    saveFailed: 'Enregistrement refusé',[m[41m[m
[32m+[m[32m    deleteFailed: 'Suppression refusée',[m[41m[m
[32m+[m[32m    logoutFailed: 'Déconnexion refusée',[m[41m[m
[32m+[m[32m    privacyLink: 'Politique de confidentialité',[m[41m[m
[32m+[m[32m    dataProtectionLink: 'Protection des données (RGPD)',[m[41m[m
[32m+[m[32m    termsLink: 'Conditions d’utilisation',[m[41m[m
     playButton: 'Jouer',[m
     commandsTitle: 'Commandes',[m
     backToMenu: 'Retour au menu',[m
[36m@@ -34,6 +61,34 @@[m [mexport const translations = {[m
     ],[m
   },[m
   en: {[m
[32m+[m[32m    loading: 'Loading...',[m[41m[m
[32m+[m[32m    profileButton: 'My profile',[m[41m[m
[32m+[m[32m    logoutButton: 'Log out',[m[41m[m
[32m+[m[32m    loginTitle: 'Log in',[m[41m[m
[32m+[m[32m    emailLabel: 'Email',[m[41m[m
[32m+[m[32m    passwordLabel: 'Password',[m[41m[m
[32m+[m[32m    loginButton: 'Log in',[m[41m[m
[32m+[m[32m    signupTitle: 'Create an account',[m[41m[m
[32m+[m[32m    nicknameLabel: 'Nickname',[m[41m[m
[32m+[m[32m    signupPasswordLabel: 'Password (at least 5 characters)',[m[41m[m
[32m+[m[32m    passwordConfirmationLabel: 'Confirm password',[m[41m[m
[32m+[m[32m    signupButton: 'Create my account',[m[41m[m
[32m+[m[32m    backToLogin: 'Back to login',[m[41m[m
[32m+[m[32m    saveButton: 'Save',[m[41m[m
[32m+[m[32m    deleteAccountButton: 'Delete my account',[m[41m[m
[32m+[m[32m    deleteAccountConfirmation: 'Permanently delete your account? This cannot be undone.',[m[41m[m
[32m+[m[32m    loginFailed: 'Login failed',[m[41m[m
[32m+[m[32m    serverUnavailable: 'Server unavailable',[m[41m[m
[32m+[m[32m    emptyNickname: 'The nickname cannot be empty or contain only spaces.',[m[41m[m
[32m+[m[32m    passwordMismatch: 'The passwords do not match',[m[41m[m
[32m+[m[32m    signupFailed: 'Registration failed: check the fields or use another email.',[m[41m[m
[32m+[m[32m    invalidNickname: 'The nickname must contain between 1 and 24 characters.',[m[41m[m
[32m+[m[32m    saveFailed: 'Could not save changes',[m[41m[m
[32m+[m[32m    deleteFailed: 'Could not delete the account',[m[41m[m
[32m+[m[32m    logoutFailed: 'Logout failed',[m[41m[m
[32m+[m[32m    privacyLink: 'Privacy Policy',[m[41m[m
[32m+[m[32m    dataProtectionLink: 'Data protection (GDPR)',[m[41m[m
[32m+[m[32m    termsLink: 'Terms of Service',[m[41m[m
     playButton: 'Play',[m
     commandsTitle: 'Controls',[m
     backToMenu: 'Back to menu',[m
[36m@@ -65,6 +120,34 @@[m [mexport const translations = {[m
     ],[m
   },[m
   es: {[m
[32m+[m[32m    loading: 'Cargando...',[m[41m[m
[32m+[m[32m    profileButton: 'Mi perfil',[m[41m[m
[32m+[m[32m    logoutButton: 'Cerrar sesión',[m[41m[m
[32m+[m[32m    loginTitle: 'Iniciar sesión',[m[41m[m
[32m+[m[32m    emailLabel: 'Correo electrónico',[m[41m[m
[32m+[m[32m    passwordLabel: 'Contraseña',[m[41m[m
[32m+[m[32m    loginButton: 'Iniciar sesión',[m[41m[m
[32m+[m[32m    signupTitle: 'Crear una cuenta',[m[41m[m
[32m+[m[32m    nicknameLabel: 'Apodo',[m[41m[m
[32m+[m[32m    signupPasswordLabel: 'Contraseña (mínimo 5 caracteres)',[m[41m[m
[32m+[m[32m    passwordConfirmationLabel: 'Confirmar contraseña',[m[41m[m
[32m+[m[32m    signupButton: 'Crear mi cuenta',[m[41m[m
[32m+[m[32m    backToLogin: 'Volver al inicio de sesión',[m[41m[m
[32m+[m[32m    saveButton: 'Guardar',[m[41m[m
[32m+[m[32m    deleteAccountButton: 'Eliminar mi cuenta',[m[41m[m
[32m+[m[32m    deleteAccountConfirmation: '¿Eliminar tu cuenta permanentemente? Esta acción es irreversible.',[m[41m[m
[32m+[m[32m    loginFailed: 'No se pudo iniciar sesión',[m[41m[m
[32m+[m[32m    serverUnavailable: 'Servidor no disponible',[m[41m[m
[32m+[m[32m    emptyNickname: 'El apodo no puede estar vacío ni contener solo espacios.',[m[41m[m
[32m+[m[32m    passwordMismatch: 'Las contraseñas no coinciden',[m[41m[m
[32m+[m[32m    signupFailed: 'No se pudo crear la cuenta: revisa los campos o utiliza otro correo.',[m[41m[m
[32m+[m[32m    invalidNickname: 'El apodo debe contener entre 1 y 24 caracteres.',[m[41m[m
[32m+[m[32m    saveFailed: 'No se pudieron guardar los cambios',[m[41m[m
[32m+[m[32m    deleteFailed: 'No se pudo eliminar la cuenta',[m[41m[m
[32m+[m[32m    logoutFailed: 'No se pudo cerrar sesión',[m[41m[m
[32m+[m[32m    privacyLink: 'Política de privacidad',[m[41m[m
[32m+[m[32m    dataProtectionLink: 'Protección de datos (RGPD)',[m[41m[m
[32m+[m[32m    termsLink: 'Condiciones de uso',[m[41m[m
     playButton: 'Jugar',[m
     commandsTitle: 'Controles',[m
     backToMenu: 'Volver al menú',[m
[1mdiff --git a/frontend/src/game/matchflow.js b/frontend/src/game/matchflow.js[m
[1mindex 0cbeae3..a6c90f1 100644[m
[1m--- a/frontend/src/game/matchflow.js[m
[1m+++ b/frontend/src/game/matchflow.js[m
[36m@@ -1,22 +1,39 @@[m
[32m+[m[32mconst OPPONENT_EYE_Y = 0.7;[m[41m[m
[32m+[m[41m[m
 export function createMatchFlow(deps) {[m
   const {[m
     camera, spawns, opponentMesh,[m
[32m+[m[32m    opponentTargetPosition, setOpponentTargetRotationY,[m[41m[m
     playerHealth, opponentHealth, ammoState,[m
     roundState, countdownState, countdownDisplay,[m
     ROUND_COUNTDOWN_DURATION,[m
     updateHealthHUD, updateAmmoHUD, updateRoundHUD,[m
     recordPlayerWin, recordEnemyWin, resetRounds,[m
     startCountdown, showEndScreen, sendReady, resetHealth,[m
[31m-    setRoundActive, getMySpawnIndex,[m
[32m+[m[32m    setRoundActive, getMySpawnIndex, goToMenu,[m[41m[m
   } = deps;[m
 [m
   function positionAtSpawn() {[m
[31m-    const spawn = spawns[getMySpawnIndex()];[m
[32m+[m[32m    const mySpawnIndex = getMySpawnIndex();[m[41m[m
[32m+[m[32m    const spawn = spawns[mySpawnIndex];[m[41m[m
     camera.position.set(spawn.x, spawn.y, spawn.z);[m
     camera.rotation.set(0, spawn.rotationY, 0, 'YXZ');[m
[32m+[m[41m[m
[32m+[m[32m    const opponentSpawn = spawns[1 - mySpawnIndex];[m[41m[m
[32m+[m[32m    opponentTargetPosition.set(opponentSpawn.x, OPPONENT_EYE_Y, opponentSpawn.z);[m[41m[m
[32m+[m[32m    opponentMesh.position.copy(opponentTargetPosition);[m[41m[m
[32m+[m[32m    setOpponentTargetRotationY(opponentSpawn.rotationY);[m[41m[m
[32m+[m[32m    opponentMesh.rotation.y = opponentSpawn.rotationY;[m[41m[m
   }[m
 [m
   function startRoundCountdown() {[m
[32m+[m[32m    resetHealth(playerHealth);[m[41m[m
[32m+[m[32m    resetHealth(opponentHealth);[m[41m[m
[32m+[m[32m    ammoState.current = ammoState.max;[m[41m[m
[32m+[m[32m    ammoState.reloading = false;[m[41m[m
[32m+[m[32m    updateHealthHUD(playerHealth);[m[41m[m
[32m+[m[32m    updateAmmoHUD(ammoState);[m[41m[m
[32m+[m[41m[m
     positionAtSpawn();[m
     opponentMesh.visible = true;[m
     countdownDisplay.classList.remove('hidden');[m
[36m@@ -51,7 +68,7 @@[m [mexport function createMatchFlow(deps) {[m
     updateRoundHUD(roundState);[m
 [m
     if (matchWon) {[m
[31m-      showEndScreen('Victoire finale !', resetMatch);[m
[32m+[m[32m      showEndScreen('Victoire !', goToMenu, 'Retour au menu');[m[41m[m
     } else {[m
       showEndScreen(`Manche gagnee ! (${roundState.playerScore} - ${roundState.enemyScore})`, resetRound);[m
     }[m
[36m@@ -63,7 +80,7 @@[m [mexport function createMatchFlow(deps) {[m
     updateRoundHUD(roundState);[m
 [m
     if (matchLost) {[m
[31m-      showEndScreen('Defaite finale !', resetMatch);[m
[32m+[m[32m      showEndScreen('Defaite !', goToMenu, 'Retour au menu');[m[41m[m
     } else {[m
       showEndScreen(`Manche perdue... (${roundState.playerScore} - ${roundState.enemyScore})`, resetRound);[m
     }[m
[1mdiff --git a/frontend/src/main.js b/frontend/src/main.js[m
[1mindex 7789b68..928fb22 100644[m
[1m--- a/frontend/src/main.js[m
[1m+++ b/frontend/src/main.js[m
[36m@@ -20,7 +20,7 @@[m [mimport { loadWeaponModel } from './game/weaponmodel.js';[m
 import { loadCharacterModel } from './game/charactermodel.js';[m
 import { createOpponentController } from './game/opponentcontroller.js';[m
 // dagouill : those two lines added from IA-moderation branch[m
[31m-import { sendPosition, sendHit, sendReady, sendShoot, sendChat, getPlayerId } from './network/network.js';[m
[32m+[m[32mimport { sendPosition, sendHit, sendReady, sendShoot, sendChat, getPlayerId, leaveMatch } from './network/network.js';[m
 import { setupChat } from './ui/chat.js';[m
 // ---[m
 import './style.css'[m
[36m@@ -28,6 +28,15 @@[m [mimport './style.css'[m
 // Prefixe des assets : "/" en dev, "/game/" une fois servi derriere le proxy[m
 const BASE = import.meta.env.BASE_URL;[m
 [m
[32m+[m[32m// Adresse du menu : port 5174 en dev, racine du site derriere le proxy[m
[32m+[m[32mconst MENU_URL = import.meta.env.DEV ? 'http://127.0.0.1:5174/' : '/';[m
[32m+[m
[32m+[m[32mfunction goToMenu() {[m
[32m+[m[32m  leaveMatch(() => {[m
[32m+[m[32m    window.location.href = MENU_URL;[m
[32m+[m[32m  });[m
[32m+[m[32m}[m
[32m+[m
 // Setup de base[m
 const scene = createScene();[m
 const weaponScene = new THREE.Scene();[m
[36m@@ -48,7 +57,7 @@[m [mwindow.addEventListener('resize', () => {[m
 });[m
 [m
 // Map[m
[31m-const { floor, wallBoxes, spawns } = loadMap(scene, 'arena1');[m
[32m+[m[32mconst { floor, wallMeshes, wallBoxes, spawns } = loadMap(scene, 'arena1');[m
 [m
 // Arme premiere personne[m
 const WEAPON_BASE_Y = -0.4;[m
[36m@@ -57,7 +66,7 @@[m [mweaponWrapper.position.set(0.3, WEAPON_BASE_Y, -0.7);[m
 camera.add(weaponWrapper);[m
 [m
 const muzzlePoint = new THREE.Object3D();[m
[31m-muzzlePoint.position.set(0, 0, -1);[m
[32m+[m[32mmuzzlePoint.position.set(-0.3, 0.78, 0);[m
 weaponWrapper.add(muzzlePoint);[m
 [m
 const WEAPON_SCALE_FACTOR = 0.7 / 3.10;[m
[36m@@ -126,8 +135,10 @@[m [mlet opponentTargetRotationY = 0;[m
 const opponentTargetPosition = new THREE.Vector3();[m
 [m
 // Logique de manche[m
[31m-const { startRoundCountdown, resetMatch, onPlayerWinsRound, onEnemyWinsRound } = createMatchFlow({[m
[32m+[m[32mconst { startRoundCountdown, onPlayerWinsRound, onEnemyWinsRound } = createMatchFlow({[m
   camera, spawns, opponentMesh,[m
[32m+[m[32m  opponentTargetPosition,[m
[32m+[m[32m  setOpponentTargetRotationY: (value) => { opponentTargetRotationY = value; },[m
   playerHealth, opponentHealth, ammoState,[m
   roundState, countdownState, countdownDisplay,[m
   ROUND_COUNTDOWN_DURATION,[m
[36m@@ -136,6 +147,7 @@[m [mconst { startRoundCountdown, resetMatch, onPlayerWinsRound, onEnemyWinsRound } =[m
   startCountdown, showEndScreen, sendReady, resetHealth,[m
   setRoundActive: (value) => { roundActive = value; },[m
   getMySpawnIndex: () => mySpawnIndex,[m
[32m+[m[32m  goToMenu,[m
 });[m
 [m
 // Reseau[m
[36m@@ -144,7 +156,7 @@[m [msetupGameNetworking({[m
   setOpponentTargetRotationY: (value) => { opponentTargetRotationY = value; },[m
   setMySpawnIndex: (value) => { mySpawnIndex = value; },[m
   connectionBanner, applyDamage, updateHealthHUD,[m
[31m-  onEnemyWinsRound, startRoundCountdown, showEndScreen, resetMatch,[m
[32m+[m[32m  onEnemyWinsRound, startRoundCountdown, showEndScreen, goToMenu,[m
   onOpponentShootAnimation: (isMoving) => opponentController.onShoot(isMoving),[m
   onOpponentPositionUpdate: (moveData) => opponentController.onPositionUpdate(moveData),[m
 // dagouill : those 5 lines added from IA-moderation branch[m
[36m@@ -154,10 +166,11 @@[m [msetupGameNetworking({[m
   },[m
   onChatBlocked: (data) => chat.addSystemMessage(`Blocked message: ${data.reason}`),[m
 // ---[m
[32m+[m[32m  isRoundActive: () => roundActive,[m
 });[m
 [m
 // Tir[m
[31m-setupShooting(camera, scene, muzzlePoint, [opponentMesh, floor], {[m
[32m+[m[32msetupShooting(camera, scene, muzzlePoint, [opponentMesh, floor, ...wallMeshes], {[m
 // dagouill : this line changed based on IA-moderation branch[m
 canFire: () => roundActive && !countdownState.active && !chat.isOpen() && canFire(ammoState),[m
   onFire: () => {[m
[1mdiff --git a/frontend/src/maps/index.js b/frontend/src/maps/index.js[m
[1mindex b03dc3c..605c0b4 100644[m
[1m--- a/frontend/src/maps/index.js[m
[1m+++ b/frontend/src/maps/index.js[m
[36m@@ -6,7 +6,7 @@[m [mconst maps = { arena1 };[m
 export function loadMap(scene, mapName) {[m
   const mapData = maps[mapName];[m
 [m
[31m-[m
[32m+[m[32m  // Sol[m[41m[m
   const floorGeometry = new THREE.PlaneGeometry(mapData.floorSize, mapData.floorSize);[m
   const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });[m
   const floor = new THREE.Mesh(floorGeometry, floorMaterial);[m
[36m@@ -14,8 +14,9 @@[m [mexport function loadMap(scene, mapName) {[m
   floor.position.y = 0;[m
   scene.add(floor);[m
 [m
[31m-[m
[32m+[m[32m  // Murs (perimetre + interieurs)[m[41m[m
   const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaa4444 });[m
[32m+[m[32m  const wallMeshes = [];[m[41m[m
   const wallBoxes = [];[m
 [m
   for (const wallDef of mapData.walls) {[m
[36m@@ -23,8 +24,9 @@[m [mexport function loadMap(scene, mapName) {[m
     const mesh = new THREE.Mesh(geometry, wallMaterial);[m
     mesh.position.set(...wallDef.position);[m
     scene.add(mesh);[m
[32m+[m[32m    wallMeshes.push(mesh);[m[41m[m
     wallBoxes.push(new THREE.Box3().setFromObject(mesh));[m
   }[m
 [m
[31m-  return { floor, wallBoxes, spawns: mapData.spawns };[m
[32m+[m[32m  return { floor, wallMeshes, wallBoxes, spawns: mapData.spawns };[m[41m[m
 }[m
\ No newline at end of file[m
[1mdiff --git a/frontend/src/network/gamenetwork.js b/frontend/src/network/gamenetwork.js[m
[1mindex 71ba0c0..d71e172 100644[m
[1m--- a/frontend/src/network/gamenetwork.js[m
[1m+++ b/frontend/src/network/gamenetwork.js[m
[36m@@ -6,9 +6,9 @@[m [mexport function setupGameNetworking(deps) {[m
     opponentTargetPosition, setOpponentTargetRotationY,[m
     setMySpawnIndex,[m
     connectionBanner, applyDamage, updateHealthHUD,[m
[31m-    onEnemyWinsRound, startRoundCountdown, showEndScreen, resetMatch,[m
[32m+[m[32m    onEnemyWinsRound, startRoundCountdown, showEndScreen, goToMenu,[m[41m[m
     onOpponentShootAnimation, onOpponentPositionUpdate,[m
[31m-    onChatMessage, onChatBlocked,[m
[32m+[m[32m    onChatMessage, onChatBlocked, isRoundActive,[m[41m[m
   } = deps;[m
 [m
   return connectToServer({[m
[36m@@ -33,6 +33,7 @@[m [mexport function setupGameNetworking(deps) {[m
       if (onOpponentShootAnimation) onOpponentShootAnimation(data.isMoving);[m
     },[m
     onOpponentHit: (hitData) => {[m
[32m+[m[32m      if (isRoundActive && !isRoundActive()) return;[m[41m[m
       applyDamage(playerHealth, hitData.damage, () => {[m
         onEnemyWinsRound();[m
       });[m
[36m@@ -47,7 +48,7 @@[m [mexport function setupGameNetworking(deps) {[m
     },[m
     onMatchAbandoned: () => {[m
       connectionBanner.classList.add('hidden');[m
[31m-      showEndScreen('Adversaire non revenu - Partie terminee', resetMatch);[m
[32m+[m[32m      showEndScreen('Adversaire non revenu - Partie terminee', goToMenu, 'Retour au menu');[m[41m[m
     },[m
     onChatMessage,[m
     onChatBlocked,[m
[1mdiff --git a/frontend/src/network/network.js b/frontend/src/network/network.js[m
[1mindex 570d72e..3e12d1f 100644[m
[1m--- a/frontend/src/network/network.js[m
[1m+++ b/frontend/src/network/network.js[m
[36m@@ -3,28 +3,37 @@[m [mimport { io } from 'socket.io-client';[m
 let socket = null;[m
 let roomId = null;[m
 [m
[31m-// En dev : connexion directe au serveur de jeu.[m
[31m-// Derriere le proxy : undefined = meme origine que la page (le proxy route /socket.io/).[m
[31m-const SERVER_URL = import.meta.env.DEV ? 'http://localhost:3001' : undefined;[m
[32m+[m[32mlet currentUser = null;[m
 [m
[31m-// dagouill : added export based on AI-moderation branch[m
 export function getPlayerId() {[m
[31m-  let playerId = sessionStorage.getItem('playerId');[m
[31m-  if (!playerId) {[m
[31m-    playerId = 'player-' + Math.random().toString(36).substring(2, 15);[m
[31m-    sessionStorage.setItem('playerId', playerId);[m
[31m-  }[m
[31m-  return playerId;[m
[32m+[m[32m  return currentUser?.id ?? null;[m
 }[m
 [m
 export function connectToServer(callbacks) {[m
[31m-  const playerId = getPlayerId();[m
[31m-  const savedRoomId = sessionStorage.getItem('currentRoomId');[m
[32m+[m[32m  const navType = performance.getEntriesByType('navigation')[0]?.type;[m
[32m+[m[32m  if (navType !== 'reload') sessionStorage.removeItem('currentRoomId');[m
[32m+[m
[32m+[m[32m  socket = io(undefined, {[m
[32m+[m[32m    transports: ['websocket'],[m
[32m+[m[32m    auth: (cb) => {[m
[32m+[m[32m      cb({ roomId: sessionStorage.getItem('currentRoomId') || null });[m
[32m+[m[32m    },[m
[32m+[m[32m  });[m
 [m
[31m-socket = io(SERVER_URL, {[m
[31m-  transports: ['websocket'],[m
[31m-  auth: { playerId, roomId: savedRoomId || null },[m
[31m-});[m
[32m+[m[32m  socket.on('account:ready', user => {[m
[32m+[m[32m    currentUser = user;[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  socket.on('connect_error', error => {[m
[32m+[m[32m    if (error.message === 'LOGIN_REQUIRED') window.location.href = '/';[m
[32m+[m[32m    if (error.message === 'ALREADY_PLAYING') {[m
[32m+[m[32m      window.alert('Ce compte est déjà en jeu dans un autre onglet.');[m
[32m+[m[32m      window.location.href = '/';[m
[32m+[m[32m    }[m
[32m+[m[32m  });[m
[32m+[m[32m  socket.on('disconnect', reason => {[m
[32m+[m[32m    if (reason === 'io server disconnect') window.location.href = '/';[m
[32m+[m[32m  });[m
 [m
   socket.on('round:start', () => {[m
     callbacks.onRoundStart();[m
[36m@@ -67,10 +76,10 @@[m [msocket = io(SERVER_URL, {[m
     callbacks.onMatchAbandoned();[m
   });[m
 [m
[31m-// dagouill : added from AI-moderation branch[m
[32m+[m[32m  // dagouill : added from AI-moderation branch[m
   socket.on('chat:message', (data) => callbacks.onChatMessage(data));[m
   socket.on('chat:blocked', (data) => callbacks.onChatBlocked(data));[m
[31m-// ---[m
[32m+[m[32m  // ---[m
 [m
   return socket;[m
 }[m
[36m@@ -100,3 +109,19 @@[m [mexport function sendChat(text) {[m
   if (!socket || !roomId) return;[m
   socket.emit('chat:send', { text });[m
 }[m
[32m+[m
[32m+[m[32mexport function leaveMatch(onDone) {[m
[32m+[m[32m  sessionStorage.removeItem('currentRoomId');[m
[32m+[m[32m  if (!socket || !roomId) {[m
[32m+[m[32m    onDone();[m
[32m+[m[32m    return;[m
[32m+[m[32m  }[m
[32m+[m[32m  let done = false;[m
[32m+[m[32m  const finish = () => {[m
[32m+[m[32m    if (done) return;[m
[32m+[m[32m    done = true;[m
[32m+[m[32m    onDone();[m
[32m+[m[32m  };[m
[32m+[m[32m  socket.emit('match:leave', {}, finish);[m
[32m+[m[32m  setTimeout(finish, 500);[m
[32m+[m[32m}[m
[1mdiff --git a/frontend/src/ui/endscreen.js b/frontend/src/ui/endscreen.js[m
[1mindex d6e0343..b6b2abd 100644[m
[1m--- a/frontend/src/ui/endscreen.js[m
[1m+++ b/frontend/src/ui/endscreen.js[m
[36m@@ -2,11 +2,12 @@[m [mconst endScreen = document.getElementById('end-screen');[m
 const endMessage = document.getElementById('end-message');[m
 let restartButton = document.getElementById('restart-button');[m
 [m
[31m-export function showEndScreen(message, onRestart) {[m
[32m+[m[32mexport function showEndScreen(message, onRestart, buttonLabel = 'Rejouer') {[m[41m[m
   endMessage.textContent = message;[m
   endScreen.classList.remove('hidden');[m
 [m
   const newButton = restartButton.cloneNode(true);[m
[32m+[m[32m  newButton.textContent = buttonLabel;[m[41m[m
   restartButton.replaceWith(newButton);[m
   restartButton = newButton;[m
 [m
[1mdiff --git a/monitoring/grafana/provisioning/dashboards/dashboards.json b/monitoring/grafana/provisioning/dashboards/dashboards.json[m
[1mindex fe84dfb..e6fcd95 100644[m
[1m--- a/monitoring/grafana/provisioning/dashboards/dashboards.json[m
[1m+++ b/monitoring/grafana/provisioning/dashboards/dashboards.json[m
[36m@@ -13,7 +13,7 @@[m
 	"panels": [[m
 		{[m
 			"id": 1,[m
[31m-			"title": "Connected players",[m
[32m+[m			[32m"title": "Joueurs connectés",[m
 			"type": "stat",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "game_connected_players", "refId": "A"}],[m
[36m@@ -21,7 +21,7 @@[m
 		},[m
 		{[m
 			"id": 2,[m
[31m-			"title": "Active rooms",[m
[32m+[m			[32m"title": "Parties actives",[m
 			"type": "stat",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "game_active_rooms", "refId": "A"}],[m
[36m@@ -29,7 +29,7 @@[m
 		},[m
 		{[m
 			"id": 3,[m
[31m-			"title": "Waiting players",[m
[32m+[m			[32m"title": "Joueurs en attente",[m
 			"type": "stat",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "game_waiting_players", "refId": "A"}],[m
[36m@@ -37,7 +37,7 @@[m
 		},[m
 		{[m
 			"id": 4,[m
[31m-			"title": "Player shots",[m
[32m+[m			[32m"title": "Tirs par seconde",[m
 			"type": "timeseries",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "rate(game_player_shots_total[5m])", "refId": "A"}],[m
[36m@@ -45,7 +45,7 @@[m
 		},[m
 		{[m
 			"id": 5,[m
[31m-			"title": "Player moves",[m
[32m+[m			[32m"title": "Mouvements par seconde",[m
 			"type": "timeseries",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "rate(game_player_moves_total[5m])", "refId": "A"}],[m
[36m@@ -53,7 +53,7 @@[m
 		},[m
 		{[m
 			"id": 6,[m
[31m-			"title": "CPU utilization (%)",[m
[32m+[m			[32m"title": "CPU de la VM (%)",[m
 			"type": "timeseries",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)", "refId": "A"}],[m
[36m@@ -61,7 +61,7 @@[m
 		},[m
 		{[m
 			"id": 7,[m
[31m-			"title": "RAM utilization (%)",[m
[32m+[m			[32m"title": "RAM utilisée (%)",[m
 			"type": "timeseries",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)", "refId": "A"}],[m
[36m@@ -69,7 +69,7 @@[m
 		},[m
 		{[m
 			"id": 8,[m
[31m-			"title": "Game server status",[m
[32m+[m			[32m"title": "État du serveur de jeu",[m
 			"type": "stat",[m
 			"datasource": {"type": "prometheus", "uid": "prometheus"},[m
 			"targets": [{"expr": "up{job=\"game-server\"}", "refId": "A"}],[m
[1mdiff --git a/monitoring/grafana/provisioning/datasources/datasource_prometheus.yml b/monitoring/grafana/provisioning/datasources/datasource_prometheus.yml[m
[1mindex 0b304bc..1a57b69 100644[m
[1m--- a/monitoring/grafana/provisioning/datasources/datasource_prometheus.yml[m
[1m+++ b/monitoring/grafana/provisioning/datasources/datasource_prometheus.yml[m
[36m@@ -2,7 +2,6 @@[m [mapiVersion: 1[m
 [m
 datasources:[m
   - name: Prometheus[m
[31m-    uid: prometheus[m
     type: prometheus[m
     access: proxy[m
     url: http://prometheus:9090[m
[1mdiff --git a/monitoring/prometheus/prometheus.yml b/monitoring/prometheus/prometheus.yml[m
[1mindex 5f97a7b..66178fd 100644[m
[1m--- a/monitoring/prometheus/prometheus.yml[m
[1m+++ b/monitoring/prometheus/prometheus.yml[m
[36m@@ -11,9 +11,8 @@[m [mscrape_configs:[m
       - targets: ["prometheus:9090"][m
 [m
   - job_name: "game-server"[m
[31m-    metrics_path: /metrics[m
     static_configs:[m
[31m-      - targets: ["game:3001"][m
[32m+[m[32m      - targets: ["host.docker.internal:3001"][m
 [m
   - job_name: "node-exporter"[m
     static_configs:[m
[1mdiff --git a/monitoring/prometheus/rules/alerts.yml b/monitoring/prometheus/rules/alerts.yml[m
[1mindex 4cd5dac..fed0625 100644[m
[1m--- a/monitoring/prometheus/rules/alerts.yml[m
[1m+++ b/monitoring/prometheus/rules/alerts.yml[m
[36m@@ -26,10 +26,10 @@[m [mgroups:[m
           summary: "High CPU usage"[m
           description: "CPU usage is above 90% for more than 2 minutes."[m
       - alert: TooManyPlayers[m
[31m-        expr: game_connected_players > 10[m
[32m+[m[32m        expr: game_connected_players > 0[m
         for: 1m[m
         labels:[m
           severity: warning[m
         annotations:[m
           summary: "High number of connected players"[m
[31m-          description: "More than 10 players are connected."[m
[32m+[m[32m          description: "More than 20 players are connected."[m
[1mdiff --git a/proxy/conf.d/default.conf b/proxy/conf.d/default.conf[m
[1mindex baa9a93..7c5e0e3 100644[m
[1m--- a/proxy/conf.d/default.conf[m
[1m+++ b/proxy/conf.d/default.conf[m
[36m@@ -1,7 +1,6 @@[m
 server {[m
     listen 80;[m
     server_name localhost;[m
[31m-[m
     return 301 https://$http_host$request_uri;[m
 }[m
 [m
[36m@@ -15,57 +14,27 @@[m [mserver {[m
     # Internal DNS resolver (Podman & Docker fallback)[m
     resolver 10.89.0.1 127.0.0.11 valid=5s ipv6=off;[m
 [m
[31m-    # Grafana - HTTPS via Nginx[m
[31m-    # URL: https://localhost:8443/grafana/[m
[31m-    location = /grafana {[m
[31m-        return 301 /grafana/;[m
[31m-    }[m
[31m-[m
[31m-    location /grafana/ {[m
[31m-        set $upstream_grafana http://grafana:3000;[m
[31m-        proxy_pass $upstream_grafana;[m
[31m-[m
[31m-        proxy_set_header Host $http_host;[m
[31m-        proxy_set_header X-Real-IP $remote_addr;[m
[31m-        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;[m
[31m-        proxy_set_header X-Forwarded-Proto https;[m
[31m-        proxy_set_header X-Forwarded-Host $http_host;[m
[31m-    }[m
[31m-[m
[31m-    # Prometheus - HTTPS via Nginx + authentication[m
[31m-    # URL: https://localhost:8443/prometheus/[m
[31m-    location = /prometheus {[m
[31m-        return 301 /prometheus/;[m
[31m-    }[m
[31m-[m
[31m-    location /prometheus/ {[m
[31m-        set $upstream_prometheus http://prometheus:9090;[m
[31m-        proxy_pass $upstream_prometheus;[m
[31m-[m
[31m-        proxy_set_header Host $http_host;[m
[31m-        proxy_set_header X-Real-IP $remote_addr;[m
[31m-        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;[m
[31m-        proxy_set_header X-Forwarded-Proto https;[m
[31m-        proxy_set_header X-Forwarded-Host $http_host;[m
[31m-    }[m
[31m-[m
     # Frontend (Vite SPA & 3D Assets)[m
     location / {[m
         set $upstream_frontend http://ft_frontend:80;[m
         proxy_pass $upstream_frontend;[m
[31m-[m
         proxy_set_header Host $http_host;[m
         proxy_set_header X-Real-IP $remote_addr;[m
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;[m
         proxy_set_header X-Forwarded-Proto https;[m
     }[m
 [m
[32m+[m[32m    location /api/account/ {[m
[32m+[m[32m        set $account_server http://ft_game:3001;[m
[32m+[m[32m        proxy_pass $account_server;[m
[32m+[m[32m        proxy_set_header Host $http_host;[m
[32m+[m[32m    }[m
[32m+[m
     # NestJS Backend API[m
     location /api/ {[m
         set $upstream_backend http://ft_backend:3000;[m
         rewrite ^/api/(.*) /$1 break;[m
         proxy_pass $upstream_backend;[m
[31m-[m
         proxy_set_header Host $http_host;[m
         proxy_set_header X-Real-IP $remote_addr;[m
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;[m
[36m@@ -76,23 +45,19 @@[m [mserver {[m
     location /ws/ {[m
         set $upstream_ws http://ft_backend:3000;[m
         proxy_pass $upstream_ws;[m
[31m-[m
         proxy_http_version 1.1;[m
         proxy_set_header Upgrade $http_upgrade;[m
         proxy_set_header Connection "Upgrade";[m
         proxy_set_header Host $http_host;[m
[31m-        proxy_set_header X-Forwarded-Proto https;[m
     }[m
 [m
[31m-    # Game server (Socket.io)[m
[32m+[m[32m    # Serveur de jeu (Socket.io)[m
     location /socket.io/ {[m
         set $upstream_game http://ft_game:3001;[m
         proxy_pass $upstream_game;[m
[31m-[m
         proxy_http_version 1.1;[m
         proxy_set_header Upgrade $http_upgrade;[m
         proxy_set_header Connection "Upgrade";[m
         proxy_set_header Host $http_host;[m
[31m-        proxy_set_header X-Forwarded-Proto https;[m
     }[m
 }[m
[1mdiff --git a/server-test/Dockerfile b/server-test/Dockerfile[m
[1mindex bed97e9..388aad3 100644[m
[1m--- a/server-test/Dockerfile[m
[1m+++ b/server-test/Dockerfile[m
[36m@@ -1,4 +1,4 @@[m
[31m-FROM node:20-alpine[m
[32m+[m[32mFROM node:24-alpine[m[41m[m
 [m
 WORKDIR /app[m
 [m
[1mdiff --git a/server-test/auth.js b/server-test/auth.js[m
[1mnew file mode 100644[m
[1mindex 0000000..443874f[m
[1m--- /dev/null[m
[1m+++ b/server-test/auth.js[m
[36m@@ -0,0 +1,72 @@[m
[32m+[m[32mimport { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';[m
[32m+[m[32mimport { promisify } from 'node:util';[m
[32m+[m
[32m+[m[32mconst scryptAsync = promisify(scrypt);[m
[32m+[m
[32m+[m[32mconst connections = new Map();[m
[32m+[m
[32m+[m[32mconst DURATION = 8 * 60 * 60 * 1000;[m
[32m+[m
[32m+[m[32mconst cookieOptions = {[m
[32m+[m[32m  httpOnly: true, secure: true, sameSite: 'strict', path: '/',[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mexport async function hashPassword(password, salt) {[m
[32m+[m[32m  const hash = await scryptAsync(password, salt, 64, {[m
[32m+[m[32m    N: 65536, r: 8, p: 2, maxmem: 134217728,[m
[32m+[m[32m  });[m
[32m+[m[32m  return hash.toString('hex');[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport async function passwordMatches(password, user) {[m
[32m+[m[32m  const candidate = await hashPassword(password, user.password_salt);[m
[32m+[m[32m  return timingSafeEqual([m
[32m+[m[32m    Buffer.from(candidate, 'hex'),[m
[32m+[m[32m    Buffer.from(user.password_hash, 'hex'),[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function publicProfile(user) {[m
[32m+[m[32m  return {[m
[32m+[m[32m    id: String(user.id), pseudo: user.pseudo,[m
[32m+[m[32m    avatar: user.avatar, language: user.language,[m
[32m+[m[32m  };[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function startConnection(userId, res) {[m
[32m+[m[32m  const ticket = randomBytes(32).toString('hex');[m
[32m+[m[32m  const expiresAt = Date.now() + DURATION;[m
[32m+[m[32m  connections.set(ticket, { userId, expiresAt });[m
[32m+[m[32m  res.cookie('session', ticket, { ...cookieOptions, maxAge: DURATION });[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function readConnection(cookieHeader = '') {[m
[32m+[m[32m  const cookies = cookieHeader.split(';');[m
[32m+[m[32m  const cookie = cookies.find(value => value.trim().startsWith('session='));[m
[32m+[m[32m  if (!cookie) return null;[m
[32m+[m[32m  const ticket = cookie.trim().slice('session='.length);[m
[32m+[m[32m  const connection = connections.get(ticket);[m
[32m+[m[32m  if (!connection || connection.expiresAt <= Date.now()) return null;[m
[32m+[m[32m  return { ticket, userId: connection.userId };[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function endConnection(ticket, io) {[m
[32m+[m[32m  connections.delete(ticket);[m
[32m+[m[32m  io.in('session:' + ticket).disconnectSockets(true);[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function endUserConnections(userId, io) {[m
[32m+[m[32m  for (const [ticket, connection] of connections) {[m
[32m+[m[32m    if (connection.userId === userId) {[m
[32m+[m[32m      endConnection(ticket, io);[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function clearConnectionCookie(res) {[m
[32m+[m[32m  res.clearCookie('session', cookieOptions);[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function newSalt() {[m
[32m+[m[32m  return randomBytes(16).toString('hex');[m
[32m+[m[32m}[m
[1mdiff --git a/server-test/database.js b/server-test/database.js[m
[1mnew file mode 100644[m
[1mindex 0000000..ed6d8be[m
[1m--- /dev/null[m
[1m+++ b/server-test/database.js[m
[36m@@ -0,0 +1,59 @@[m
[32m+[m[32mimport { DatabaseSync } from 'node:sqlite';[m
[32m+[m[32mimport { drizzle } from 'drizzle-orm/node-sqlite';[m
[32m+[m[32mimport { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';[m
[32m+[m[32mimport { eq } from 'drizzle-orm';[m
[32m+[m
[32m+[m[32mconst sqlite = new DatabaseSync('/data/users.db');[m
[32m+[m[32mconst db = drizzle({ client: sqlite });[m
[32m+[m[32mconst users = sqliteTable('users', {[m
[32m+[m[32m  id: integer('id').primaryKey(),[m
[32m+[m[32m  email: text('email').notNull().unique(),[m
[32m+[m[32m  pseudo: text('pseudo').notNull(),[m
[32m+[m[32m  avatar: text('avatar').notNull().default('human'),[m
[32m+[m[32m  language: text('language').notNull().default('fr'),[m
[32m+[m[32m  password_salt: text('password_salt').notNull(),[m
[32m+[m[32m  password_hash: text('password_hash').notNull(),[m
[32m+[m[32m});[m
[32m+[m[32msqlite.exec(`CREATE TABLE IF NOT EXISTS users ([m
[32m+[m[32m  id INTEGER PRIMARY KEY,[m
[32m+[m[32m  email TEXT NOT NULL UNIQUE,[m
[32m+[m[32m  pseudo TEXT NOT NULL,[m
[32m+[m[32m  avatar TEXT NOT NULL DEFAULT 'human',[m
[32m+[m[32m  language TEXT NOT NULL DEFAULT 'fr',[m
[32m+[m[32m  password_salt TEXT NOT NULL,[m
[32m+[m[32m  password_hash TEXT NOT NULL[m
[32m+[m[32m)`);[m
[32m+[m
[32m+[m[32mexport function findUserByEmail(email) {[m
[32m+[m[32m  return db.select().from(users).where(eq(users.email, email)).get();[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function findUserById(id) {[m
[32m+[m[32m  return db.select().from(users).where(eq(users.id, id)).get();[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function insertUser(email, pseudo, salt, hash, language = 'fr') {[m
[32m+[m[32m  try {[m
[32m+[m[32m    return db.insert(users).values({[m
[32m+[m[32m      email,[m
[32m+[m[32m      pseudo,[m
[32m+[m[32m      language,[m
[32m+[m[32m      password_salt: salt,[m
[32m+[m[32m      password_hash: hash,[m
[32m+[m[32m    }).returning().get();[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    if (error.cause) {[m
[32m+[m[32m      throw error.cause;[m
[32m+[m[32m    }[m
[32m+[m[32m    throw error;[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function updateProfile(id, pseudo, avatar, language) {[m
[32m+[m[32m  return db.update(users).set({ pseudo, avatar, language })[m
[32m+[m[32m    .where(eq(users.id, id)).returning().get();[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport function deleteUser(id) {[m
[32m+[m[32m  db.delete(users).where(eq(users.id, id)).run();[m
[32m+[m[32m}[m
[1mdiff --git a/server-test/moderation.js b/server-test/moderation.js[m
[1mindex 03b718c..9e050eb 100644[m
[1m--- a/server-test/moderation.js[m
[1m+++ b/server-test/moderation.js[m
[36m@@ -18,7 +18,9 @@[m [mexport async function moderateMessage(text, context)[m
 		}[m
 	);[m
 	const result = moderation.results[0];[m
[32m+[m	[32m/*DEBUG*/[m[41m[m
 	 console.log("MODERATION:", JSON.stringify(result, null, 2));[m
[32m+[m	[32m /*-----*/[m[41m[m
 	if (result.flagged == true) [m
 		return { allowed: false, reason: "inappropriate language" };[m
 	return { allowed: true };[m
[1mdiff --git a/server-test/package-lock.json b/server-test/package-lock.json[m
[1mindex 472826d..89062b0 100644[m
[1m--- a/server-test/package-lock.json[m
[1m+++ b/server-test/package-lock.json[m
[36m@@ -9,21 +9,12 @@[m
       "version": "1.0.0",[m
       "license": "ISC",[m
       "dependencies": {[m
[32m+[m[32m        "drizzle-orm": "1.0.0-rc.4",[m[41m[m
         "express": "^5.2.1",[m
         "openai": "^7.27.0",[m
[31m-        "prom-client": "^15.1.3",[m
         "socket.io": "^4.8.3"[m
       }[m
     },[m
[31m-    "node_modules/@opentelemetry/api": {[m
[31m-      "version": "1.9.1",[m
[31m-      "resolved": "https://registry.npmjs.org/@opentelemetry/api/-/api-1.9.1.tgz",[m
[31m-      "integrity": "sha512-gLyJlPHPZYdAk1JENA9LeHejZe1Ti77/pTeFm/nMXmQH/HFZlcS/O2XJB+L8fkbrNSqhdtlvjBVjxwUYanNH5Q==",[m
[31m-      "license": "Apache-2.0",[m
[31m-      "engines": {[m
[31m-        "node": ">=8.0.0"[m
[31m-      }[m
[31m-    },[m
     "node_modules/@socket.io/component-emitter": {[m
       "version": "3.1.2",[m
       "resolved": "https://registry.npmjs.org/@socket.io/component-emitter/-/component-emitter-3.1.2.tgz",[m
[36m@@ -79,12 +70,6 @@[m
         "node": "^4.5.0 || >= 5.9"[m
       }[m
     },[m
[31m-    "node_modules/bintrees": {[m
[31m-      "version": "1.0.2",[m
[31m-      "resolved": "https://registry.npmjs.org/bintrees/-/bintrees-1.0.2.tgz",[m
[31m-      "integrity": "sha512-VOMgTMwjAaUG580SXn3LacVgjurrbMme7ZZNYGSSV7mmtY6QQRh0Eg3pwIcntQ77DErK1L0NxkbetjcoXzVwKw==",[m
[31m-      "license": "MIT"[m
[31m-    },[m
     "node_modules/body-parser": {[m
       "version": "2.3.0",[m
       "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.3.0.tgz",[m
[36m@@ -243,6 +228,203 @@[m
         "node": ">= 0.8"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/drizzle-orm": {[m[41m[m
[32m+[m[32m      "version": "1.0.0-rc.4",[m[41m[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/drizzle-orm/-/drizzle-orm-1.0.0-rc.4.tgz",[m[41m[m
[32m+[m[32m      "integrity": "sha512-BT+pf+qoiYHqltoA88Jmf6ilGMXPlpfE0hEJKc2adRtMCAl25Swk/t5gXcWxZNAwdtf3F5gCd2FpeOyP/pT0Hw==",[m[41m[m
[32m+[m[32m      "peerDependencies": {[m[41m[m
[32m+[m[32m        "@aws-sdk/client-rds-data": ">=3",[m[41m[m
[32m+[m[32m        "@cloudflare/workers-types": ">=4",[m[41m[m
[32m+[m[32m        "@effect/sql-d1": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-libsql": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-mysql2": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-pg": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-pglite": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-bun": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-do": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-node": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-wasm": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "@electric-sql/pglite": ">=0.2.0",[m[41m[m
[32m+[m[32m        "@libsql/client": ">=0.10.0",[m[41m[m
[32m+[m[32m        "@libsql/client-wasm": ">=0.10.0",[m[41m[m
[32m+[m[32m        "@neondatabase/serverless": ">=0.10.0",[m[41m[m
[32m+[m[32m        "@op-engineering/op-sqlite": ">=2",[m[41m[m
[32m+[m[32m        "@opentelemetry/api": "^1.4.1",[m[41m[m
[32m+[m[32m        "@planetscale/database": ">=1.13",[m[41m[m
[32m+[m[32m        "@sinclair/typebox": ">=0.34.8",[m[41m[m
[32m+[m[32m        "@sqlitecloud/drivers": ">=1.0.653",[m[41m[m
[32m+[m[32m        "@tidbcloud/serverless": "*",[m[41m[m
[32m+[m[32m        "@tursodatabase/database": ">=0.6.0-pre.28 || >=0.6.0",[m[41m[m
[32m+[m[32m        "@tursodatabase/database-common": ">=0.6.0-pre.28 || >=0.6.0",[m[41m[m
[32m+[m[32m        "@tursodatabase/database-wasm": ">=0.6.0-pre.28 || >=0.6.0",[m[41m[m
[32m+[m[32m        "@tursodatabase/serverless": ">=1.1.3",[m[41m[m
[32m+[m[32m        "@tursodatabase/sync": ">=0.6.0-pre.28 || >=0.6.0",[m[41m[m
[32m+[m[32m        "@types/better-sqlite3": "*",[m[41m[m
[32m+[m[32m        "@types/mssql": "^9.1.4",[m[41m[m
[32m+[m[32m        "@types/pg": "*",[m[41m[m
[32m+[m[32m        "@types/sql.js": "*",[m[41m[m
[32m+[m[32m        "@upstash/redis": ">=1.34.7",[m[41m[m
[32m+[m[32m        "@vercel/postgres": ">=0.8.0",[m[41m[m
[32m+[m[32m        "@xata.io/client": "*",[m[41m[m
[32m+[m[32m        "arktype": ">=2.0.0",[m[41m[m
[32m+[m[32m        "better-sqlite3": ">=9.3.0",[m[41m[m
[32m+[m[32m        "bun-types": "*",[m[41m[m
[32m+[m[32m        "effect": ">=4.0.0-beta.83 || >=4.0.0",[m[41m[m
[32m+[m[32m        "expo-sqlite": ">=14.0.0",[m[41m[m
[32m+[m[32m        "mssql": "^11.0.1",[m[41m[m
[32m+[m[32m        "mysql2": ">=2",[m[41m[m
[32m+[m[32m        "pg": ">=8",[m[41m[m
[32m+[m[32m        "postgres": ">=3",[m[41m[m
[32m+[m[32m        "sql.js": ">=1",[m[41m[m
[32m+[m[32m        "sqlite3": ">=5",[m[41m[m
[32m+[m[32m        "typebox": ">=1.0.0",[m[41m[m
[32m+[m[32m        "valibot": ">=1.0.0-beta.7",[m[41m[m
[32m+[m[32m        "zod": "^3.25.0 || ^4.0.0"[m[41m[m
[32m+[m[32m      },[m[41m[m
[32m+[m[32m      "peerDependenciesMeta": {[m[41m[m
[32m+[m[32m        "@aws-sdk/client-rds-data": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@cloudflare/workers-types": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-d1": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-libsql": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-mysql2": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-pg": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-pglite": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-bun": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-do": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-node": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@effect/sql-sqlite-wasm": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@electric-sql/pglite": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@libsql/client": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@libsql/client-wasm": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@neondatabase/serverless": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@op-engineering/op-sqlite": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@opentelemetry/api": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@planetscale/database": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@sinclair/typebox": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@sqlitecloud/drivers": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@tidbcloud/serverless": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@tursodatabase/database": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@tursodatabase/database-common": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@tursodatabase/database-wasm": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@tursodatabase/serverless": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@tursodatabase/sync": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@types/better-sqlite3": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@types/mssql": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@types/pg": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@types/sql.js": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@upstash/redis": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@vercel/postgres": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "@xata.io/client": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "arktype": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "better-sqlite3": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "bun-types": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "effect": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "expo-sqlite": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "mssql": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "mysql2": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "pg": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "postgres": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "sql.js": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "sqlite3": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "typebox": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "valibot": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        },[m[41m[m
[32m+[m[32m        "zod": {[m[41m[m
[32m+[m[32m          "optional": true[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m      }[m[41m[m
[32m+[m[32m    },[m[41m[m
     "node_modules/dunder-proto": {[m
       "version": "1.0.1",[m
       "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",[m
[36m@@ -783,20 +965,6 @@[m
         "url": "https://opencollective.com/express"[m
       }[m
     },[m
[31m-    "node_modules/prom-client": {[m
[31m-      "version": "15.1.3",[m
[31m-      "resolved": "https://registry.npmjs.org/prom-client/-/prom-client-15.1.3.tgz",[m
[31m-      "integrity": "sha512-6ZiOBfCywsD4k1BN9IX0uZhF+tJkV8q8llP64G5Hajs4JOeVLPCwpPVcpXy3BwYiUGgyJzsJJQeOIv7+hDSq8g==",[m
[31m-      "deprecated": "prom-client has been replaced by @prometheus-io/client",[m
[31m-      "license": "Apache-2.0",[m
[31m-      "dependencies": {[m
[31m-        "@opentelemetry/api": "^1.4.0",[m
[31m-        "tdigest": "^0.1.1"[m
[31m-      },[m
[31m-      "engines": {[m
[31m-        "node": "^16 || ^18 || >=20"[m
[31m-      }[m
[31m-    },[m
     "node_modules/proxy-addr": {[m
       "version": "2.0.7",[m
       "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",[m
[36m@@ -1092,15 +1260,6 @@[m
         "node": ">= 0.8"[m
       }[m
     },[m
[31m-    "node_modules/tdigest": {[m
[31m-      "version": "0.1.3",[m
[31m-      "resolved": "https://registry.npmjs.org/tdigest/-/tdigest-0.1.3.tgz",[m
[31m-      "integrity": "sha512-zbRt+lT+/H4fRItHshczHErVCQnitJk8MfMT24MqFJf3YL7SJJPqGIGeuOdvxXxM/AHFzKBl7WoyaYwqO9s3Kw==",[m
[31m-      "license": "MIT",[m
[31m-      "dependencies": {[m
[31m-        "bintrees": "1.0.2"[m
[31m-      }[m
[31m-    },[m
     "node_modules/toidentifier": {[m
       "version": "1.0.1",[m
       "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",[m
[1mdiff --git a/server-test/package.json b/server-test/package.json[m
[1mindex 6089f83..fd68bee 100644[m
[1m--- a/server-test/package.json[m
[1m+++ b/server-test/package.json[m
[36m@@ -12,9 +12,9 @@[m
   "author": "",[m
   "license": "ISC",[m
   "dependencies": {[m
[32m+[m[32m    "drizzle-orm": "1.0.0-rc.4",[m[41m[m
     "express": "^5.2.1",[m
     "openai": "^7.27.0",[m
[31m-    "prom-client": "^15.1.3",[m
     "socket.io": "^4.8.3"[m
   }[m
 }[m
[1mdiff --git a/server-test/routes.js b/server-test/routes.js[m
[1mnew file mode 100644[m
[1mindex 0000000..443931b[m
[1m--- /dev/null[m
[1m+++ b/server-test/routes.js[m
[36m@@ -0,0 +1,83 @@[m
[32m+[m[32mimport { findUserByEmail, findUserById, insertUser, updateProfile, deleteUser } from './database.js';[m
[32m+[m[32mimport { newSalt, hashPassword, passwordMatches, publicProfile,[m
[32m+[m[32m  startConnection, readConnection, endConnection, endUserConnections, clearConnectionCookie } from './auth.js';[m
[32m+[m
[32m+[m[32mexport function installAccountRoutes(app, io) {[m
[32m+[m[32m  app.post('/api/account/register', async (req, res) => {[m
[32m+[m[32m    const { email, pseudo, password, language = 'fr' } = req.body ?? {};[m
[32m+[m[32m    if (typeof email !== 'string' || typeof pseudo !== 'string' ||[m
[32m+[m[32m        typeof password !== 'string' || password.length < 5 ||[m
[32m+[m[32m        password.length > 128 || pseudo.trim().length < 1 ||[m
[32m+[m[32m        pseudo.length > 24 || !['fr', 'en', 'es'].includes(language) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {[m
[32m+[m[32m      return res.status(400).json({ error: 'INVALID_FIELDS' });[m
[32m+[m[32m    }[m
[32m+[m[32m    const normalizedEmail = email.trim().toLowerCase();[m
[32m+[m[32m    if (findUserByEmail(normalizedEmail)) {[m
[32m+[m[32m      return res.status(409).json({ error: 'EMAIL_USED' });[m
[32m+[m[32m    }[m
[32m+[m[32m    const salt = newSalt();[m
[32m+[m[32m    const hash = await hashPassword(password, salt);[m
[32m+[m[32m    let user;[m
[32m+[m[32m    try {[m
[32m+[m[32m      user = insertUser(normalizedEmail, pseudo.trim(), salt, hash, language);[m
[32m+[m[32m    } catch (error) {[m
[32m+[m[32m      if (error.errstr === 'constraint failed') {[m
[32m+[m[32m        return res.status(409).json({ error: 'EMAIL_USED' });[m
[32m+[m[32m      }[m
[32m+[m[32m      throw error;[m
[32m+[m[32m    }[m
[32m+[m[32m    startConnection(user.id, res);[m
[32m+[m[32m    res.status(201).json(publicProfile(user));[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  app.post('/api/account/login', async (req, res) => {[m
[32m+[m[32m    const { email, password } = req.body ?? {};[m
[32m+[m[32m    if (typeof email !== 'string' || typeof password !== 'string' ||[m
[32m+[m[32m        password.length > 128) {[m
[32m+[m[32m      return res.status(400).json({ error: 'INVALID_FIELDS' });[m
[32m+[m[32m    }[m
[32m+[m[32m    const user = findUserByEmail(email.trim().toLowerCase());[m
[32m+[m[32m    if (!user || !(await passwordMatches(password, user))) {[m
[32m+[m[32m      return res.status(401).json({ error: 'LOGIN_FAILED' });[m
[32m+[m[32m    }[m
[32m+[m[32m    startConnection(user.id, res);[m
[32m+[m[32m    res.json(publicProfile(user));[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  app.get('/api/account/me', (req, res) => {[m
[32m+[m[32m    const connection = readConnection(req.headers.cookie);[m
[32m+[m[32m    const user = connection && findUserById(connection.userId);[m
[32m+[m[32m    if (!user) return res.status(401).json({ error: 'LOGIN_REQUIRED' });[m
[32m+[m[32m    res.json(publicProfile(user));[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  app.put('/api/account/profile', (req, res) => {[m
[32m+[m[32m    const connection = readConnection(req.headers.cookie);[m
[32m+[m[32m    if (!connection) return res.status(401).json({ error: 'LOGIN_REQUIRED' });[m
[32m+[m[32m    const { pseudo, avatar, language } = req.body ?? {};[m
[32m+[m[32m    if (typeof pseudo !== 'string' || !pseudo.trim() || pseudo.length > 24 ||[m
[32m+[m[32m        !['human', 'robot', 'cat', 'alien'].includes(avatar) ||[m
[32m+[m[32m        !['fr', 'en', 'es'].includes(language)) {[m
[32m+[m[32m      return res.status(400).json({ error: 'INVALID_FIELDS' });[m
[32m+[m[32m    }[m
[32m+[m[32m    const user = updateProfile(connection.userId, pseudo.trim(), avatar, language);[m
[32m+[m[32m    if (!user) return res.status(401).json({ error: 'LOGIN_REQUIRED' });[m
[32m+[m[32m    res.json(publicProfile(user));[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  app.delete('/api/account/me', (req, res) => {[m
[32m+[m[32m    const connection = readConnection(req.headers.cookie);[m
[32m+[m[32m    if (!connection) return res.status(401).json({ error: 'LOGIN_REQUIRED' });[m
[32m+[m[32m    deleteUser(connection.userId);[m
[32m+[m[32m    endUserConnections(connection.userId, io);[m
[32m+[m[32m    clearConnectionCookie(res);[m
[32m+[m[32m    res.sendStatus(204);[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  app.post('/api/account/logout', (req, res) => {[m
[32m+[m[32m    const connection = readConnection(req.headers.cookie);[m
[32m+[m[32m    if (connection) endConnection(connection.ticket, io);[m
[32m+[m[32m    clearConnectionCookie(res);[m
[32m+[m[32m    res.sendStatus(204);[m
[32m+[m[32m  });[m
[32m+[m[32m}[m
[1mdiff --git a/server-test/server.js b/server-test/server.js[m
[1mindex f3c63c4..b4f1771 100644[m
[1m--- a/server-test/server.js[m
[1m+++ b/server-test/server.js[m
[36m@@ -2,62 +2,24 @@[m [mimport express from 'express';[m
 import { createServer } from 'http';[m
 import { Server } from 'socket.io';[m
 import { moderateMessage } from './moderation.js';[m
[31m-import prometheus_client from 'prom-client';[m
[32m+[m[32mimport { installAccountRoutes } from './routes.js';[m[41m[m
[32m+[m[32mimport { installSocketAccount } from './socket-account.js';[m[41m[m
 [m
 const CHAT_MAX_LENGTH = 200;[m
 const CHAT_RATE_LIMIT = 5;[m
[31m-const CHAT_RATE_WINDOW = 5000;  [m
[32m+[m[32mconst CHAT_RATE_WINDOW = 5000;[m[41m[m
 [m
 const app = express();[m
[31m-const register = new prometheus_client.Registry();[m
[31m-prometheus_client.collectDefaultMetrics({[m
[31m-  register,[m
[31m-});[m
 const httpServer = createServer(app);[m
 const io = new Server(httpServer, {[m
   cors: { origin: '*' }[m
 });[m
 [m
[31m-app.get('/metrics', async (req, res) => {[m
[31m-  res.set('Content-Type', register.contentType);[m
[31m-  res.end(await register.metrics());[m
[31m-});[m
[31m-[m
[31m-const connectedPlayers = new prometheus_client.Gauge({[m
[31m-  name: 'game_connected_players',[m
[31m-  help: 'Number of currently connected players',[m
[31m-  registers: [register],[m
[31m-});[m
[31m-const activeRooms = new prometheus_client.Gauge({[m
[31m-  name: 'game_active_rooms',[m
[31m-  help: 'Number of active game rooms',[m
[31m-  registers: [register],[m
[31m-});[m
[31m-const waitingPlayers = new prometheus_client.Gauge({[m
[31m-  name: 'game_waiting_players',[m
[31m-  help: 'Number of players waiting for a match',[m
[31m-  registers: [register],[m
[31m-});[m
[31m-const playerMoves = new prometheus_client.Counter({[m
[31m-  name: 'game_player_moves_total',[m
[31m-  help: 'Total number of player movement events',[m
[31m-  registers: [register],[m
[31m-});[m
[31m-const playerShots = new prometheus_client.Counter({[m
[31m-  name: 'game_player_shots_total',[m
[31m-  help: 'Total number of player shots',[m
[31m-  registers: [register],[m
[31m-});[m
[31m-const playerHits = new prometheus_client.Counter({[m
[31m-  name: 'game_player_hits_total',[m
[31m-  help: 'Total number of player hit events',[m
[31m-  registers: [register],[m
[31m-});[m
[32m+[m[32mapp.use(express.json({ limit: '16kb' }));[m[41m[m
[32m+[m[32minstallAccountRoutes(app, io);[m[41m[m
[32m+[m[32minstallSocketAccount(io);[m[41m[m
 [m
 let waitingPlayer = null;[m
[31m-connectedPlayers.set(0);[m
[31m-activeRooms.set(0);[m
[31m-waitingPlayers.set(0);[m
 const rooms = new Map();[m
 const DISCONNECT_GRACE_PERIOD = 20000;[m
 const disconnectTimers = new Map();[m
[36m@@ -65,8 +27,8 @@[m [mconst ROUND_READY_TIMEOUT = 15000;[m
 const roundReadyTimers = new Map();[m
 [m
 io.on('connection', (socket) => {[m
[31m-  connectedPlayers.inc();[m
[31m-  const { playerId, roomId: rejoinRoomId } = socket.handshake.auth;[m
[32m+[m[32m  const playerId = socket.data.user.id;[m[41m[m
[32m+[m[32m  const { roomId: rejoinRoomId } = socket.handshake.auth;[m[41m[m
   socket.data.chatTimestamps = [];[m
 [m
   console.log(`Connexion : ${socket.id} (playerId: ${playerId})`);[m
[36m@@ -89,12 +51,30 @@[m [mio.on('connection', (socket) => {[m
       socket.emit('match:resumed', { roomId: rejoinRoomId, spawnIndex: room.spawnIndexes[playerId] });[m
       socket.to(rejoinRoomId).emit('opponent:reconnected');[m
 [m
[32m+[m[32m      const socketsInRoom = io.sockets.adapter.rooms.get(rejoinRoomId)?.size ?? 0;[m[41m[m
[32m+[m[32m      if (socketsInRoom < 2) {[m[41m[m
[32m+[m[32m        console.log(`${playerId}: adversaire absent de ${rejoinRoomId}, pas de round:start`);[m[41m[m
[32m+[m[32m        socket.emit('opponent:disconnected');[m[41m[m
[32m+[m[32m      } else {[m[41m[m
[32m+[m[32m        room.readyPlayers.clear();[m[41m[m
[32m+[m[32m        if (roundReadyTimers.has(rejoinRoomId)) {[m[41m[m
[32m+[m[32m          clearTimeout(roundReadyTimers.get(rejoinRoomId));[m[41m[m
[32m+[m[32m          roundReadyTimers.delete(rejoinRoomId);[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m        console.log(`round:start envoye a ${rejoinRoomId}`);[m[41m[m
[32m+[m[32m        io.to(rejoinRoomId).emit('round:start');[m[41m[m
[32m+[m[32m      }[m[41m[m
[32m+[m[41m[m
       console.log(`${playerId} reconnecte a ${rejoinRoomId}`);[m
       reconnected = true;[m
     }[m
   }[m
 [m
   if (!reconnected) {[m
[32m+[m[32m    if (waitingPlayer && (!waitingPlayer.socket.connected || waitingPlayer.playerId === playerId)) {[m[41m[m
[32m+[m[32m      waitingPlayer = null;[m[41m[m
[32m+[m[32m    }[m[41m[m
[32m+[m[41m[m
     if (waitingPlayer) {[m
       const roomId = `match-${waitingPlayer.playerId}-${playerId}`;[m
       const room = {[m
[36m@@ -103,7 +83,6 @@[m [mio.on('connection', (socket) => {[m
         readyPlayers: new Set(),[m
       };[m
       rooms.set(roomId, room);[m
[31m-	  activeRooms.set(rooms.size);[m
 [m
       waitingPlayer.socket.join(roomId);[m
       waitingPlayer.socket.data.playerId = waitingPlayer.playerId;[m
[36m@@ -117,10 +96,9 @@[m [mio.on('connection', (socket) => {[m
 [m
       console.log(`Match cree : ${roomId}`);[m
       waitingPlayer = null;[m
[31m-	  waitingPlayers.set(0);[m
     } else {[m
       waitingPlayer = { playerId, socket };[m
[31m-      waitingPlayers.set(1);[m
[32m+[m[32m      socket.data.playerId = playerId;[m[41m[m
       socket.emit('waiting');[m
     }[m
   }[m
[36m@@ -152,17 +130,14 @@[m [mio.on('connection', (socket) => {[m
   });[m
 [m
   socket.on('player:move', (data) => {[m
[31m-	playerMoves.inc();[m
     socket.to(data.roomId).emit('opponent:move', data);[m
   });[m
 [m
   socket.on('player:shoot', (data) => {[m
[31m-	playerShots.inc();[m
     socket.to(data.roomId).emit('opponent:shoot', data);[m
   });[m
 [m
   socket.on('player:hit', (data) => {[m
[31m-	playerHits.inc();[m
     socket.to(data.roomId).emit('hit:received', { damage: data.damage });[m
   });[m
 [m
[36m@@ -180,9 +155,9 @@[m [mio.on('connection', (socket) => {[m
       socket.emit('chat:blocked', { reason: 'too many messages' });[m
       return[m
     }[m
[31m-    [m
[32m+[m[41m[m
     socket.data.chatTimestamps.push(now);[m
[31m-    [m
[32m+[m[41m[m
     let verdict;[m
     try {[m
       verdict = await moderateMessage(text, {playerId: socket.data.playerId, roomId });[m
[36m@@ -203,13 +178,25 @@[m [mio.on('connection', (socket) => {[m
     })[m
   })[m
 [m
[32m+[m[32m  socket.on('match:leave', (data, ack) => {[m[41m[m
[32m+[m[32m    const roomId = socket.data.roomId;[m[41m[m
[32m+[m[32m    if (roomId && rooms.has(roomId)) {[m[41m[m
[32m+[m[32m      rooms.delete(roomId);[m[41m[m
[32m+[m[32m      if (roundReadyTimers.has(roomId)) {[m[41m[m
[32m+[m[32m        clearTimeout(roundReadyTimers.get(roomId));[m[41m[m
[32m+[m[32m        roundReadyTimers.delete(roomId);[m[41m[m
[32m+[m[32m      }[m[41m[m
[32m+[m[32m      console.log(`Room ${roomId} fermee (un joueur a quitte apres la fin du match)`);[m[41m[m
[32m+[m[32m    }[m[41m[m
[32m+[m[32m    socket.data.roomId = null;[m[41m[m
[32m+[m[32m    if (typeof ack === 'function') ack();[m[41m[m
[32m+[m[32m  });[m[41m[m
[32m+[m[41m[m
   socket.on('disconnect', () => {[m
[31m-	connectedPlayers.dec();[m
     console.log(`Deconnecte : ${socket.id} (playerId: ${socket.data.playerId})`);[m
 [m
     if (waitingPlayer && waitingPlayer.socket === socket) {[m
       waitingPlayer = null;[m
[31m-	  waitingPlayers.set(0);[m
       return;[m
     }[m
 [m
[36m@@ -225,7 +212,6 @@[m [mio.on('connection', (socket) => {[m
       const timer = setTimeout(() => {[m
         socket.to(roomId).emit('match:abandoned');[m
         rooms.delete(roomId);[m
[31m-		activeRooms.set(rooms.size);[m
         disconnectTimers.delete(socket.data.playerId);[m
         console.log(`Room ${roomId} fermee (pas de reconnexion)`);[m
       }, DISCONNECT_GRACE_PERIOD);[m
[36m@@ -237,4 +223,4 @@[m [mio.on('connection', (socket) => {[m
 [m
 httpServer.listen(3001, () => {[m
   console.log('Serveur WebSocket sur le port 3001');[m
[31m-});[m
[32m+[m[32m});[m
\ No newline at end of file[m
[1mdiff --git a/server-test/show-users.js b/server-test/show-users.js[m
[1mnew file mode 100644[m
[1mindex 0000000..1653e07[m
[1m--- /dev/null[m
[1m+++ b/server-test/show-users.js[m
[36m@@ -0,0 +1,10 @@[m
[32m+[m[32mimport { DatabaseSync } from 'node:sqlite';[m
[32m+[m
[32m+[m[32mconst db = new DatabaseSync('/data/users.db', { readOnly: true });[m
[32m+[m
[32m+[m[32mconst users = db.prepare([m
[32m+[m[32m  'SELECT id, email, pseudo, avatar, language FROM users'[m
[32m+[m[32m).all();[m
[32m+[m
[32m+[m[32mconsole.table(users);[m
[32m+[m[32mdb.close();[m
[1mdiff --git a/server-test/socket-account.js b/server-test/socket-account.js[m
[1mnew file mode 100644[m
[1mindex 0000000..31f29eb[m
[1m--- /dev/null[m
[1m+++ b/server-test/socket-account.js[m
[36m@@ -0,0 +1,28 @@[m
[32m+[m[32mimport { readConnection, publicProfile } from './auth.js';[m
[32m+[m[32mimport { findUserById } from './database.js';[m
[32m+[m
[32m+[m[32mexport function installSocketAccount(io) {[m
[32m+[m[32m  const activePlayers = new Set();[m
[32m+[m[32m  io.use((socket, next) => {[m
[32m+[m[32m    const connection = readConnection(socket.handshake.headers.cookie);[m
[32m+[m[32m    let user = null;[m
[32m+[m
[32m+[m[32m    if (connection) {[m
[32m+[m[32m      user = findUserById(connection.userId);[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    if (!user) return next(new Error('LOGIN_REQUIRED'));[m
[32m+[m[32m    const playerId = String(user.id);[m
[32m+[m[32m    if (activePlayers.has(playerId)) return next(new Error('ALREADY_PLAYING'));[m
[32m+[m[32m    socket.data.user = publicProfile(user);[m
[32m+[m[32m    socket.data.ticket = connection.ticket;[m
[32m+[m[32m    next();[m
[32m+[m[32m  });[m
[32m+[m[32m  io.on('connection', socket => {[m
[32m+[m[32m    const playerId = socket.data.user.id;[m
[32m+[m[32m    activePlayers.add(playerId);[m
[32m+[m[32m    socket.join('session:' + socket.data.ticket);[m
[32m+[m[32m    socket.emit('account:ready', socket.data.user);[m
[32m+[m[32m    socket.on('disconnect', () => activePlayers.delete(playerId));[m
[32m+[m[32m  });[m
[32m+[m[32m}[m
