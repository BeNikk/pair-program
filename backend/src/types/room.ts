import { WebSocket } from "ws";
export type Room = {
  [roomId: string]: {
    clients: Set<WebSocket>;
    code: string;
    users: Map<WebSocket, string>;
  };
};