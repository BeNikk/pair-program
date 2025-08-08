import { Room } from "../types/room";
import WebSocket from "ws";

export function broadcast(roomId: string, message: any, rooms: Room, excludeWs?: WebSocket) {
  if (!rooms[roomId]) return;
  for (const client of rooms[roomId].clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}
