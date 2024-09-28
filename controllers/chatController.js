import Chat from "../models/Chat.js";
import User from "../models/User.js";

// Create or get one-to-one chat
export const accessChat = async (req, res) => {
  const { userId, receiverUserId } = req.body;

  try {
    // Check if chat between the two users already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId, receiverUserId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // If chat exists, return it
    if (chat) {
      return res.status(200).json(chat);
    }

    // If chat does not exist, create new one
    const newChat = {
      chatName: "sender", // You can adjust this as needed
      isGroupChat: false,
      users: [userId, receiverUserId], // Add both users here
    };

    const createdChat = await Chat.create(newChat);

    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    res.status(200).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all chats for a user
export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a group chat
export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
