import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { Room } from "../types/room";
import { broadcast } from "../utils/broadCast";

const rooms: Room = {};

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", function connection(ws) {
    let currentRoomId: string | null = null;
    let currentUserName: string | null = null;
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      let parsedData;
      try {
        parsedData = JSON.parse(data.toString());
      } catch (error) {
        console.log(error);
      }
      if (parsedData.type == "JOIN_ROOM") {
        const { userName, roomId } = parsedData;
        currentRoomId = roomId;
        currentUserName = userName;
        if (!rooms[roomId]) {
          rooms[roomId] = { clients: new Set(), code: "" };
        }
        rooms[roomId].clients.add(ws);
        ws.send(
          JSON.stringify({
            type: "CODE_UPDATE",
            code: rooms[roomId].code,
          })
        );
        broadcast(
          roomId,
          {
            type: "USER_JOINED",
            userName,
          },
          rooms,
          ws
        );
      } else if (parsedData.type == "CODE_CHANGE") {
        const { codeChange } = parsedData;
        if (currentRoomId && rooms[currentRoomId]) {
          rooms[currentRoomId]!.code = codeChange;
          broadcast(
            currentRoomId,
            {
              type: "CODE_UPDATE",
              code: codeChange,
              userName: currentUserName,
            },
            rooms,
            ws
          );
        }
      } else if (parsedData.type === "LEAVE_ROOM" && currentRoomId) {
        leaveRoom(ws, currentRoomId, currentUserName);
        currentRoomId = null;
      }
    });
    ws.on("close", () => {
      if (currentRoomId) {
        leaveRoom(ws, currentRoomId, currentUserName);
      }
    });
  });
}

function leaveRoom(ws: WebSocket, roomId: string, userName: string | null) {
  if (!rooms[roomId]) return;
  rooms[roomId].clients.delete(ws);

  broadcast(
    roomId,
    {
      type: "USER_LEFT",
      userName,
    },
    rooms,
    ws
  );

  if (rooms[roomId].clients.size === 0) {
    delete rooms[roomId];
  }
}
