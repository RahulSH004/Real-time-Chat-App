import type { WebSocket } from "ws";

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
  roomIds?: Set <string>;
  userId?: string;
  authenticated?: boolean;
}

export type { User, Room, ExtendedSocket };