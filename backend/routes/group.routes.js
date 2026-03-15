import express from "express";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  addMember,
  removeMember,
} from "../controllers/group.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);
router.put("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);

export default router;
