import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

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
    let message = await Message.create(newMessage);
    message = await message
      .populate("sender", "username profilePicture")
      .execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "username email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
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
