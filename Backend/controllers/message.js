import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const parseRepliesFromText = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed?.replies)) {
      return parsed.replies;
    }
  } catch (error) {
    // fall back to line parsing below
  }

  const lineParsed = text
    .split("\n")
    .map((line) => line.replace(/^[\s\-*\d.)]+/, "").trim())
    .filter(Boolean);

  const expanded = lineParsed.flatMap((line) =>
    line
      .split(/[|;]+/)
      .map((part) => part.trim())
      .filter(Boolean)
  );

  return expanded;
};

const buildFallbackReplies = (context = "") => {
  const normalized = String(context).toLowerCase();

  if (normalized.includes("?")) {
    return ["Yes, that works for me.", "I need a little more time.", "Can you share more details?"];
  }
  if (normalized.includes("thank")) {
    return ["You're welcome!", "Happy to help.", "Anytime, just message me."];
  }
  if (normalized.includes("meet") || normalized.includes("call")) {
    return ["Yes, I can do that.", "Can we do a bit later?", "Share a time that works for you."];
  }

  return ["Sounds good to me.", "Got it, thanks.", "Can you tell me a bit more?"];
};

const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user._id;
  try {
    const trimmedText = String(text || "").trim();
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

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: trimmedText,
    });
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
    const messages = await Conversation.findOne({
      _id: conversationId,
      members: req.user._id,
    }).populate("messages");

    if (!messages) {
      return res.status(404).json("Conversation not found.");
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getAllMessage controller: ", error);
    return res.status(500).json("Internal Server Error");
  }
};

const getSmartReplies = async (req, res) => {
  const { conversationId, draftText = "" } = req.body;
  const requesterId = req.user._id;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!conversationId) {
    return res.status(400).json("conversationId is required.");
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json("Smart replies are not configured on the server.");
  }

  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: requesterId,
    })
      .populate("members", "fullName")
      .populate("messages");

    if (!conversation) {
      return res.status(404).json("Conversation not found.");
    }

    const otherUser = conversation.members.find(
      (member) => member._id.toString() !== requesterId.toString()
    );

    const recentMessages = conversation.messages.slice(-12);
    const latestIncoming = [...recentMessages]
      .reverse()
      .find((message) => message.senderId.toString() !== requesterId.toString());
    const transcript = recentMessages
      .map((message) => {
        const role =
          message.senderId.toString() === requesterId.toString()
            ? "You"
            : otherUser?.fullName || "Contact";
        return `${role}: ${message.text}`;
      })
      .join("\n");

    const prompt = [
      "You are generating smart reply suggestions for a chat app.",
      "Return only compact JSON: {\"replies\":[\"...\",\"...\",\"...\"]}",
      "Rules:",
      "- Exactly 3 replies.",
      "- Each reply must be short (max 60 characters).",
      "- Natural and friendly tone.",
      "- Replies must directly respond to the latest incoming message.",
      "- Make all 3 replies different from each other.",
      "- No markdown, no extra keys, no explanations.",
      "",
      `Conversation with ${otherUser?.fullName || "Contact"}:`,
      transcript || "No previous messages.",
      `Latest incoming message: ${latestIncoming?.text || "N/A"}`,
      draftText?.trim()
        ? `User draft in input box: ${draftText.trim()}`
        : "No current draft from user.",
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 120,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Gemini API error (${response.status}):`, errorText);
      return res
        .status(502)
        .json(`Failed to generate smart replies (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const modelText =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("\n") || "";

    const replies = parseRepliesFromText(modelText)
      .map((reply) => String(reply).trim())
      .filter((reply) => Boolean(reply) && reply.length <= 120)
      .map((reply) => reply.replace(/^"(.*)"$/, "$1"))
      .filter((reply) => reply.length > 0);

    const uniqueReplies = [...new Set(replies)];
    const fallbackReplies = buildFallbackReplies(
      latestIncoming?.text || draftText || transcript
    );

    for (const fallback of fallbackReplies) {
      if (uniqueReplies.length >= 3) {
        break;
      }
      if (!uniqueReplies.includes(fallback)) {
        uniqueReplies.push(fallback);
      }
    }

    return res.status(200).json({ replies: uniqueReplies.slice(0, 3) });
  } catch (error) {
    console.log("Error in getSmartReplies controller: ", error);
    return res.status(500).json("Internal Server Error");
  }
};

export { sendMessage, getAllMessages, getSmartReplies };
