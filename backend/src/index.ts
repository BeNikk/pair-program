import http from "http";
import app from "./http/server";
import dotenv from "dotenv";
import { setupWebSocket } from "./ws/socket";

dotenv.config();
const PORT = 3000;
const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
});
