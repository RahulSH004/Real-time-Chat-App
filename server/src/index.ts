import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  userId: string;
}

interface Room {
  id: string;
  users: User[];
  createdAt: Date;
}
interface ExtendedSocket extends WebSocket {
  roomId?: string;
  userId?: string;
}

const rooms = new Map<string, Room>();

function broadcast(roomId: string, message: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const user of room.users) {
    if (user.socket.readyState === WebSocket.OPEN) {
      user.socket.send(JSON.stringify(message));
    }
  }
}



wss.on("connection", socket => {
  console.log("New client connected");

  socket.send(JSON.stringify({ type: "connected", message: "Connected to server" }));

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
            (socket as ExtendedSocket).roomId = roomId;
            (socket as ExtendedSocket).userId = userId;

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
            room.users.push({ socket, userId });
            (socket as ExtendedSocket).roomId = roomId;
            (socket as ExtendedSocket).userId = userId;

          
          console.log(`${userId} joined ${roomId}`);

          socket.send(JSON.stringify({ type: "joinedRoom", roomId }));
          broadcast(roomId, { type: "userJoined", message: `${userId} joined the room` });
          break;
        }

        case "chat": {
          const extSocket = socket as ExtendedSocket;
          const roomId = extSocket.roomId;
          const userId = extSocket.userId;
          
          let currentRoom: Room | undefined;
          let currentUser: User | undefined;

          for (const room of rooms.values()) {
            const user = room.users.find(u => u.socket === socket);
            if (user) {
              currentRoom = room;
              currentUser = user;
              break;
            }
          }

          if (!currentRoom || !currentUser) {
            socket.send(JSON.stringify({ type: "error", message: "Join a room first" }));
            break;
          }

          const text = data.payload?.message?.trim();
          if (!text) return;

          console.log(`${currentUser.userId} @ ${currentRoom.id}: ${text}`);
          broadcast(currentRoom.id, {
            type: "message",
            userId: currentUser.userId,
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

console.log("WebSocket server running on ws://localhost:8080");
