import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user._id;
  try {
    const trimmedText = text.trim();
    if (trimmedText === "" || !receiverId) {
      return res.status(400).json("Text or Receiver was not provided");
    }
    // find conversation in DB
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    // if conversation does not exist
    if (!conversation) {
      return res
        .status(400)
        .json("Conversation does not exist. Please first create conversation");
    }

    const newMessage = await Message.create({ senderId, receiverId, text });
    conversation.messages.push(newMessage._id);
    await conversation.save();

    return res.status(201).json("Message is sent");
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    return res.status(500).json("Internal Server Error");
  }
};

// GET: getAllMessages

const getAllMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    let messages = await Conversation.findOne({
      _id: conversationId,
    }).populate("messages");

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getAllMessage controller: ", error);
    return res.status(500).json("Internal Server Error");
  }
};

export { sendMessage, getAllMessages };
