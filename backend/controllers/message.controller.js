import Message from "../models/Message.js";
import { getIO } from "../config/socket.js";

export const getDMMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
      group: null,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendDMMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { userId } = req.params;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: userId,
      content: content.trim(),
      type: "text",
    });

    await message.populate("sender", "name avatar");

    // Emit to the DM room (sorted user IDs for consistent room name)
    const roomId = [req.user._id.toString(), userId].sort().join("-");
    getIO().to(roomId).emit("message:new", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { groupId } = req.params;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const message = await Message.create({
      sender: req.user._id,
      group: groupId,
      content: content.trim(),
      type: "text",
    });

    await message.populate("sender", "name avatar");

    getIO().to(groupId).emit("message:new", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
