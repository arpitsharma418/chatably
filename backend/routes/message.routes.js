import express from "express";
import {
  getDMMessages,
  sendDMMessage,
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/dm/:userId", getDMMessages);
router.post("/dm/:userId", sendDMMessage);
router.get("/group/:groupId", getGroupMessages);
router.post("/group/:groupId", sendGroupMessage);

export default router;
