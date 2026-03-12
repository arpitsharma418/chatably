import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const isProduction = process.env.NODE_ENV === "production";
const cookieSameSite = process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");
const cookieSecure = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === "true"
  : isProduction;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: cookieSecure,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: cookieSameSite,
};

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const normalizeName = (name = "") => String(name).trim();

const issueAuthCookie = (res, user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, COOKIE_OPTIONS);

  return res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    isGuest: Boolean(user.isGuest),
    message: "User Logged In Successfully!",
  });
};

const signup = async (req, res) => {
  try {
    const fullName = normalizeName(req.body?.fullName);
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!fullName || !email || !password) {
      return res.status(400).json("Full name, email and password are required.");
    }

    if (password.trim().length < 6) {
      return res.status(400).json("Password must be at least 6 characters.");
    }

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      return res.status(409).json("User already exists!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).json("User Signed Successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json("Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User does not exist");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("Invalid email or password");
    }
    return issueAuthCookie(res, user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const guestLogin = async (req, res) => {
  try {
    const guestId = crypto.randomBytes(6).toString("hex");
    const fullName = `Guest ${guestId.slice(-4).toUpperCase()}`;
    const email = `guest_${Date.now()}_${guestId}@guest.chatably.local`;
    const password = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isGuest: true,
    });

    return issueAuthCookie(res, newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const logout = async (req, res) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(400).json("You are already logged out!");
    }

    res.clearCookie("token", COOKIE_OPTIONS);
    return res.status(200).json("User logged out successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      isGuest: Boolean(req.user.isGuest),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const updates = {};

    if (typeof fullName === "string") {
      const trimmedName = normalizeName(fullName);
      if (!trimmedName) {
        return res.status(400).json("Full name cannot be empty.");
      }
      updates.fullName = trimmedName;
    }

    if (typeof email === "string") {
      const normalizedEmail = normalizeEmail(email);
      if (!normalizedEmail) {
        return res.status(400).json("Email cannot be empty.");
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(409).json("Email already in use.");
      }

      updates.email = normalizedEmail;
    }

    if (typeof password === "string" && password.trim() !== "") {
      if (password.trim().length < 6) {
        return res.status(400).json("Password must be at least 6 characters.");
      }
      updates.password = await bcrypt.hash(password.trim(), 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json("No profile fields provided for update.");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      isGuest: Boolean(updatedUser.isGuest),
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
    await Conversation.deleteMany({ members: userId });
    await User.findByIdAndDelete(userId);

    res.clearCookie("token", COOKIE_OPTIONS);
    return res.status(200).json("Account deleted successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export { signup, login, guestLogin, logout, getProfile, updateProfile, deleteAccount };
