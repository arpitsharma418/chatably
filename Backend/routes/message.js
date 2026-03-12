import express from "express";
import {sendMessage, getAllMessages, getSmartReplies} from "../controllers/message.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/message", validate, sendMessage);
router.post("/message/smart-replies", validate, getSmartReplies);
router.get("/message/:conversationId", validate, getAllMessages);

export default router;
