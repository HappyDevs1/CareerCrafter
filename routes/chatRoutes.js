import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to access or create one-to-one chat
router.post("/", protect, accessChat);

// Route to fetch all chats for a user
router.get("/", protect, fetchChats);

// Route to create a group chat
router.post("/group", protect, createGroupChat);

export default router;
