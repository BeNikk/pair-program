"use client";
import { use, useEffect, useState } from "react";

export default function RoomIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };
        ws.onclose = () => {
      console.log(" WebSocket closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [id]);
    const handleJoin = () => {
    if (socket && username.trim()) {
      socket.send(JSON.stringify({
        type: "join",
        roomId: id,
        username
      }));
      setJoined(true);
    }
  };


  return (
    <div>
      <h1>Room: {id}</h1>

      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Join Room</button>
        </div>
      ) : (
        <p>✅ You have joined the room as {username}</p>
      )}
    </div>
  );}
