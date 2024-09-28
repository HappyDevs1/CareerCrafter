import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// Send a message
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res
      .status(400)
      .json({ message: "Invalid data passed into request" });
  }

  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    // Create the new message
    let message = await Message.create(newMessage);

    // Populate the sender and chat details in one go
    message = await Message.findById(message._id)
      .populate("sender", "username profilePicture") // Populate sender
      .populate("chat"); // Populate chat details

    // Populate users in the chat
    message = await User.populate(message, {
      path: "chat.users",
      select: "username email",
    });

    // Update the chat with the latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // Respond with the populated message
    res.json(message);
  } catch (error) {
    console.error("Error sending message:", error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  }
};

// Fetch all messages for a chat
export const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username email profilePicture")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
