// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
// 	cors: {
// 		origin: ["http://localhost:3000"],
// 		methods: ["GET", "POST"],
// 	},
// });

// export const getReceiverSocketId = (receiverId) => {
// 	return userSocketMap[receiverId];
// };

// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
// 	console.log("a user connected", socket.id);

// 	const userId = socket.handshake.query.userId;
// 	if (userId != "undefined") userSocketMap[userId] = socket.id;

// 	// io.emit() is used to send events to all the connected clients
// 	io.emit("getOnlineUsers", Object.keys(userSocketMap));

// 	// socket.on() is used to listen to the events. can be used both on client and server side
// 	socket.on("disconnect", () => {
// 		console.log("user disconnected", socket.id);
// 		delete userSocketMap[userId];
// 		io.emit("getOnlineUsers", Object.keys(userSocketMap));
// 	});
// });

// export { app, io, server };




import { Server } from "socket.io";
import http from "http";
import express from "express";

// Create express + HTTP server instance
const app = express();
const server = http.createServer(app);

// Store online users (maps userId → socketId)
const userSocketMap = {}; // { userId: socketId }

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Helper: Get socketId of receiver by userId
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Extract userId from client query
  const userId = socket.handshake.query.userId;

  // Only map valid user IDs
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`✅ User ${userId} connected on socket ${socket.id}`);
  }

  // Send updated online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Listen for manual message emit (optional)
  // If you ever want the client to emit "sendMessage" directly (e.g. bypass API)
  socket.on("sendMessage", (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    // Find which user disconnected
    for (const [userId, id] of Object.entries(userSocketMap)) {
      if (id === socket.id) {
        delete userSocketMap[userId];
        console.log(`❌ User ${userId} removed from active sockets`);
        break;
      }
    }

    // Update online users for all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export shared instances
export { app, io, server };
