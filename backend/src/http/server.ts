import express from "express";
import apiRouter from "./routes/api";
import cors from "cors";
import liveKitRouter from "./routes/livekit";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
app.use("/livekit",liveKitRouter);
export default app;
