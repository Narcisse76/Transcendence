# AI moderation
## What is AI moderation?
AI moderation is a system that automatically checks player chat messages before they are broadcast to other players. It uses the OpenAI Moderation API to detect potentially harmful or inappropriate content.

OpenAI Moderation is an API designed to identify potentially harmful content in text and other supported inputs. The implementation uses the `omni-moderation-latest` model to evaluate player messages. The API returns a moderation result indicating whether the input has been flagged. The game server uses this result to decide whether the message can be broadcast or must be blocked.

Moderation is integrated into the Node.js game server through the `moderateMessage()` function. Each message is checked before being delivered to the other players in the game room.

The objective is to maintain a safer gaming environment while preventing inappropriate messages and abuse of the chat system.

## What makes the AI moderation effective?
1. **Server-side validation:** Messages are moderated on the server before being broadcast, preventing clients from bypassing the moderation flow simply by modifying their frontend.
2. **Message length restriction:** Messages are limited to 200 characters to reduce excessive input and unnecessary API usage.
3. **Rate limiting:** Each player can send up to 5 messages within a 5-second window, helping prevent chat spam.
4. **Fail-closed behavior:** If the moderation service is unavailable or returns an error, the message is blocked instead of being broadcast without moderation.
5. **Room isolation:** Approved messages are broadcast only to players in the corresponding game room.
6. **Configurable API timeout:** The OpenAI client is configured with a 3-second timeout to limit how long a moderation request can take.

## Configuration & tuning
### Environment variables
The moderation service requires an OpenAI API key.

```env
OPENAI_API_KEY=your_openai_api_key
```

The API key must be configured in the server environment and must never be exposed to the frontend or committed to version control. The key can be managed through the project's existing secret-management system such as HashiCorp Vault.

### OpenAI client configuration
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

### Moderation logic
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

### Chat message validation
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

## Error handling and security
### Fail-closed moderation
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

## Where is it implemented?
### AI moderation module — `moderation.js`
This module initializes the OpenAI client and exports `moderateMessage()`. It sends chat text to the Moderation API and returns an allow-or-block verdict.

### Node.js game server — `server.js`
The game server integrates moderation into the `chat:send` Socket.IO event.

It validates messages, enforces rate limits, calls the moderation module, handles errors, and broadcasts only approved messages.
