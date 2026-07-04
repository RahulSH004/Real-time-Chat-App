# Realtime Chat App

![App Screenshot](./frontend/public/frontend.png)

A lightweight realtime chat application with JWT-based authentication and WebSocket-powered messaging. Supports multiple rooms per user, group and 1:1 conversations, and live message broadcasting.

## Features

- **JWT Authentication** — Signup/login via REST, secure password hashing with bcrypt
- **Realtime Messaging** — WebSocket-based chat with instant delivery
- **Multi-Room Support** — Users can join/create multiple rooms simultaneously
- **Preset Avatars** — Choose from 5 built-in avatars at signup
- **Authenticated Sockets** — Every WebSocket connection is verified against a signed JWT before any action is allowed
- **Clean Connection Lifecycle** — Automatic room cleanup on disconnect, no memory leaks

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, shadcn/ui, Tailwind CSS, Motion (motion.dev) |
| Auth API | Node.js, Express, TypeScript |
| Realtime | `ws` (WebSocket) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (`jsonwebtoken`), bcrypt |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally or remotely

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/chatapp"
JWT_SECRET="your-long-random-secret"
PORT=4000
```

### 3. Run database migrations
```bash
npx prisma migrate dev --name init
```

### 4. Start the servers
```bash
# Auth server (REST)
npm run start:auth

# WebSocket server
npm run start:ws
```

## WebSocket Protocol

All connections must authenticate before any other action is permitted.

| Type | Payload | Description |
|---|---|---|
| `auth` | `{ token }` | Must be sent first; verifies JWT and unlocks the connection |
| `create` | — | Creates a new room, returns `roomId` |
| `join` | `{ roomId }` | Joins an existing room |
| `chat` | `{ roomId, message }` | Sends a message to a room the user has joined |

**Example flow:**
```json
→ { "type": "auth", "payload": { "token": "<jwt>" } }
← { "type": "authSuccess", "userId": "..." }

→ { "type": "create" }
← { "type": "roomCreated", "roomId": "room-abc123" }

→ { "type": "chat", "payload": { "roomId": "room-abc123", "message": "hello" } }
← { "type": "message", "userId": "...", "message": "hello", "timestamp": "..." }
```

## Frontend

Built with **React** and **shadcn/ui** for accessible, composable components, styled with **Tailwind CSS**, and animated using **Motion** (motion.dev) for smooth page transitions, message entry animations, and interactive UI feedback (avatar selection, tab switching, hover states).

Key screens:
- **Landing** — marketing/hero page introducing the app
- **Login / Signup** — auth forms with preset avatar picker
- **Chat** — sidebar with active conversations + live message window

The frontend communicates with the auth server over REST and connects to the WebSocket server for realtime messaging, authenticating the socket immediately after connecting using the JWT issued at login.

## Scope Notes

This project is intentionally scoped for a college build:
- Messages are **not persisted** — room and chat state live in server memory and reset on restart
- Avatars are preset images only, no custom uploads
- No media/file/voice message support (deferred for future iterations)

## License

MIT