import { WebSocketServer } from "ws";
import http from "http";

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({server});
  wss.on("connection", function connection(ws) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });

    ws.send("something");
  });
}
