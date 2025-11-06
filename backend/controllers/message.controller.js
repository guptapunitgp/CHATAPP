// // backend/controllers/message.controller.js
// import Message from "../models/message.model.js";
// import { io, getReceiverSocketId } from "../socket/socket.js";
// import path from "path";

// /**
//  * Get all messages between the logged-in user and another user
//  * Route: GET /api/messages/:id
//  * protectRoute middleware must set req.user
//  */
// export const getMessages = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const otherUserId = req.params.id;

//     if (!userId) return res.status(401).json({ error: "Unauthorized" });
//     if (!otherUserId) return res.status(400).json({ error: "Missing other user id" });

//     // find messages where (sender = me && receiver = other) OR (sender = other && receiver = me)
//     const messages = await Message.find({
//       $or: [
//         { senderId: userId, receiverId: otherUserId },
//         { senderId: otherUserId, receiverId: userId },
//       ],
//     })
//       .sort({ createdAt: 1 }) // oldest first
//       .populate("senderId", "fullName username profilePic");

//     return res.status(200).json(messages);
//   } catch (error) {
//     console.error("Error in getMessages:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// /**
//  * Send a message (text and/or optional file)
//  * Route: POST /api/messages/send/:id
//  * Uses multer middleware: upload.single("file")
//  * protectRoute middleware must set req.user
//  */
// export const sendMessage = async (req, res) => {
//   try {
//     const senderId = req.user?._id;
//     const receiverId = req.params.id;

//     if (!senderId) return res.status(401).json({ error: "Unauthorized" });
//     if (!receiverId) return res.status(400).json({ error: "Missing receiver id" });

//     const text = (req.body?.message || "").toString();

//     // file info (if multer stored a file)
//     let fileUrl = "";
//     let fileName = "";
//     let fileType = "";

//     if (req.file) {
//       // Construct a URL clients can use to fetch the uploaded file
//       // Example: http://localhost:5000/uploads/1632423423-myfile.png
//       fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//       fileName = req.file.originalname || req.file.filename;
//       fileType = req.file.mimetype || "";
//     }

//     // Create and save message
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message: text || "",
//       fileUrl,
//       fileName,
//       fileType,
//     });

//     const saved = await newMessage.save();

//     // Populate sender info for the client (no password)
//     const populated = await saved.populate("senderId", "fullName username profilePic");

//     // Emit to receiver if online
//     try {
//       const receiverSocketId = getReceiverSocketId(receiverId);
//       if (receiverSocketId && io) {
//         io.to(receiverSocketId).emit("newMessage", populated);
//       } else if (io) {
//         // fallback: emit globally (optional)
//         io.emit("newMessage", populated);
//       }
//     } catch (emitErr) {
//       console.warn("Socket emit error in sendMessage:", emitErr.message);
//     }

//     return res.status(201).json(populated);
//   } catch (error) {
//     console.error("Error in sendMessage:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };




import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

/**
 * GET /api/messages/:id
 * Fetch all messages between the logged-in user and another user.
 */
export const getMessages = async (req, res) => {
  try {
    const userId = req.user?._id;
    const otherUserId = req.params.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!otherUserId) return res.status(400).json({ error: "Missing receiver id" });

    // Find all messages for this conversation
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 }) // oldest → newest
      .populate("senderId", "fullName username profilePic");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * POST /api/messages/send/:id
 * Send a message (text, emoji, or optional file/image)
 * Requires protectRoute middleware (req.user)
 * Uses multer middleware upload.single("file")
 */
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user?._id;
    const receiverId = req.params.id;

    if (!senderId) return res.status(401).json({ error: "Unauthorized" });
    if (!receiverId) return res.status(400).json({ error: "Missing receiver id" });

    const text = (req.body?.message || "").trim();

    // Handle file upload (if present)
    let fileUrl = "";
    let fileName = "";
    let fileType = "";

    if (req.file) {
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      fileName = req.file.originalname || req.file.filename;
      fileType = req.file.mimetype || "";
    }

    // Don’t allow empty messages
    if (!text && !fileUrl) {
      return res.status(400).json({ error: "Cannot send empty message" });
    }

    // Create and save the message
    const newMessage = new Message({
      senderId,
      receiverId,
      message: text,
      fileUrl,
      fileName,
      fileType,
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate(
      "senderId",
      "fullName username profilePic"
    );

    // Convert for frontend consistency (avoid populated objects)
    const finalMessage = {
      ...populatedMessage.toObject(),
      senderId: populatedMessage.senderId._id,
    };

    // Emit the new message in real-time to receiver (if online)
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", finalMessage);
    }

    // Respond with the message for sender (so UI updates instantly)
    res.status(201).json(finalMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
