import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth.route.js";
import cors from "cors";

import path from "path";

import { connectWithDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./config/socket.js";

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectWithDB();
  console.log("App is running on port :", PORT);
});
