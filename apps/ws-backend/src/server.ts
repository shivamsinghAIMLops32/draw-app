import { WebSocketServer } from "ws";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map<string, Set<WebSocket>>();

wss.on("connection", (ws, request) => {
  const url = request.url; // [ws://localhost:8080/]?[token=abc123]
  if (!url) {
    ws.close(1008, "Missing URL");
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    ws.close(1008, "Missing token");
    return;
  }
const decoded = jsonwebtoken.verify(token, "your_jwt_secret");
  const userid = (decoded as JwtPayload)?.id;
  if (!userid) {
    ws.close(1008, "Invalid token");
    return;
  }
  console.log("Client connected:", userid);
  ws.on("error", console.error);

  // if this socket is in a room, store the room id here
  let currentRoomId: string | null = null;

  ws.on("message", (data) => {
    // in this part handle joining rooms and broadcasting messages
    const message = JSON.parse(data.toString());
    // Handle join: { type: 'join', payload: { roomId: 'room1' } }
    if (message.type === "join") {
      const roomId = message.payload && String(message.payload.roomId);
      if (!roomId) {
        if (ws.readyState === WebSocket.OPEN)
          ws.send(
            JSON.stringify({
              type: "error",
              payload: { message: "missing roomId in join payload" },
            })
          );
        return;
      }
      if (!clients.has(roomId)) clients.set(roomId, new Set<WebSocket>());
      clients.get(roomId)!.add(ws);
      currentRoomId = roomId;
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "joined", payload: { roomId } }));
      return;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
