import express from "express";
import {
  signup,
  login,
  guestLogin,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/user.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/guest", guestLogin);
router.get("/logout", logout);
router.get("/profile", validate, getProfile);
router.patch("/profile", validate, updateProfile);
router.delete("/profile", validate, deleteAccount);

export default router;
