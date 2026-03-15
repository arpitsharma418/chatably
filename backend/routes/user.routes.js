import express from "express";
import { searchUsers, getUserById } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/search", searchUsers);
router.get("/:id", getUserById);

export default router;
