import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js"; // includes io, exported from socket.js

dotenv.config();

// Create uploads folder if missing
const uploadPath = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Define __dirname for ESM
const __dirname = path.resolve();

// Load environment port
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json()); // Parse JSON request body
app.use(cookieParser());

// Allow frontend (localhost:3000) to access backend
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-production-domain.com"],
    credentials: true,
  })
);

// ✅ Static route for uploaded files
app.use("/uploads", express.static(uploadPath));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ✅ Serve frontend build (Vite)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ✅ Connect MongoDB and start server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
