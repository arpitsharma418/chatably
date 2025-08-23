import express from "express";
import {connectWithUserByEmail, getMyConversations} from "../controllers/conversation.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/conversation", validate, connectWithUserByEmail);
router.get("/conversation", validate, getMyConversations);

export default router;