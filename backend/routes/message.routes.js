import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/upload.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("file"), sendMessage);

export default router;
