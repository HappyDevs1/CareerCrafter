import express from "express";
import { sendMessage, allMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to send a message
router.post("/", protect, sendMessage);

// Route to fetch all messages in a chat
router.get("/:chatId", protect, allMessages);

export default router;
