import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";
import { Room, ExtendedSocket } from "./types/types-app";
import { fileURLToPath } from "url";

const rooms = new Map<string, Room>();

export function createServer(port = 0) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", socket => {
    console.log("New client connected");

    socket.send(JSON.stringify({ type: "connected", message: "Connected to server" }));

    socket.on("close", () => {
      const extSocket = socket as ExtendedSocket;
      const roomIds = extSocket.roomIds;
      const userId = extSocket.userId;

      if (!roomIds || roomIds.size === 0) return;

      for (const roomId of roomIds) {
        const room = rooms.get(roomId);
        if (!room) continue;

        room.users = room.users.filter(u => u.socket !== socket);

        if (room.users.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        } else {
          broadcast(roomId, { type: "userLeft", userId, message: `${userId} left the room` });
        }
      }
    });

    socket.on("message", msg => {
      try {
        const data = JSON.parse(msg.toString());

        switch (data.type) {
          case "create": {
            const roomId = "room-" + randomUUID().slice(0, 6);
            const userId = data.payload?.userId || "Anonymous";

            rooms.set(roomId, {
              id: roomId,
              users: [{ socket, userId }],
              createdAt: new Date()
            });

            const extSocket = socket as ExtendedSocket;
            if (!extSocket.roomIds) extSocket.roomIds = new Set();
            extSocket.roomIds.add(roomId);
            extSocket.userId = userId;

            console.log(`Room ${roomId} created by ${userId}`);

            socket.send(JSON.stringify({
              type: "roomCreated",
              roomId,
              message: `Room ${roomId} created successfully!`,
            }));
            break;
          }

          case "join": {
            const { roomId, userId } = data.payload || {};
            if (!roomId || !rooms.has(roomId)) {
              socket.send(JSON.stringify({
                type: "error",
                message: "Invalid room ID"
              }));
              break;
            }

            const room = rooms.get(roomId)!;
            if (room.users.some(u => u.socket === socket)) {
              socket.send(JSON.stringify({
                type: "error",
                message: "Already in this room"
              }));
              break;
            }

            room.users.push({ socket, userId });

            const extSocket = socket as ExtendedSocket;
            if (!extSocket.roomIds) extSocket.roomIds = new Set();
            extSocket.roomIds.add(roomId);
            extSocket.userId = userId;

            console.log(`${userId} joined ${roomId}`);

            socket.send(JSON.stringify({ type: "joinedRoom", roomId }));
            broadcast(roomId, { type: "userJoined", message: `${userId} joined the room` });
            break;
          }

          case "chat": {
            const extSocket = socket as ExtendedSocket;
            const { roomId, message } = data.payload || {};
            const userId = extSocket.userId;

            if (!userId) {
              socket.send(JSON.stringify({ type: "error", message: "Not identified — join a room first" }));
              break;
            }

            if (!roomId) {
              socket.send(JSON.stringify({ type: "error", message: "roomId is required" }));
              break;
            }

            if (!extSocket.roomIds?.has(roomId)) {
              socket.send(JSON.stringify({ type: "error", message: "You are not in this room" }));
              break;
            }

            const room = rooms.get(roomId);
            if (!room) {
              socket.send(JSON.stringify({ type: "error", message: "Room no longer exists" }));
              break;
            }

            const text = message?.trim();
            if (!text) {
              socket.send(JSON.stringify({ type: "error", message: "Message cannot be empty" }));
              break;
            }

            console.log(`${userId} @ ${roomId}: ${text}`);
            broadcast(roomId, {
              type: "message",
              userId,
              message: text,
              timestamp: new Date().toISOString()
            });
            break;
          }

          default:
            socket.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
        }
      } catch (err) {
        console.error("Invalid message:", err);
        socket.send(JSON.stringify({ type: "error", message: "Invalid format" }));
      }
    });

  });

  return wss;
}

export { rooms, broadcast };

function broadcast(roomId: string, message: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const user of room.users) {
    if (user.socket.readyState === WebSocket.OPEN) {
      try {
        user.socket.send(JSON.stringify(message));
      } catch (err) {
        console.error(`Failed to send to ${user.userId}:`, err);
      }
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const wss = createServer(8080);
  console.log(`WebSocket server running on ws://localhost:8080`);
}