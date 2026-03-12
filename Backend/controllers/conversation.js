import User from '../models/user.js';
import Conversation from '../models/conversation.js';

const connectWithUserByEmail = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json("Email is not there");
    }
    const currentUserId = req.user._id; 

    // 1. Check if user with that email exists
    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Prevent connecting with self
    if (targetUser._id.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You can't chat with yourself!" });
    }

    // 3. Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      members: { $all: [currentUserId, targetUser._id] }
    });

    if (existingConversation) {
      return res.status(200).json({ conversation: existingConversation, message: "Conversation already exists" });
    }

    // 4. Create new conversation
    const newConversation = new Conversation({
      members: [currentUserId, targetUser._id]
    });

    await newConversation.save();

    return res.status(201).json({ conversation: newConversation, message: "Conversation created successfully" });

  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      members: userId,
    }).populate("members", "-password");

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export {connectWithUserByEmail, getMyConversations};
