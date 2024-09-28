import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import post from "./routes/post.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { MONGO_URL } from "./config.js";

const app = express();
app.use(express.json()); // For parsing JSON

// Serve static files for profile pictures
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User routes
app.use("/api/users", userRoutes);
app.use("/api/posts", post);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/jobs", jobRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("newMessage", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.to(user._id).emit("messageReceived", newMessage);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
