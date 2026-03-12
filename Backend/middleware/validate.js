import jwt from "jsonwebtoken";
import User from "../models/user.js";

const validate = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json("JWT secret is not configured.");
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("You are not logged in.");
    }

    let verified;
    try {
      verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json("Invalid token.");
    }

    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      return res.status(401).json("User Not Found");
    }

    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export default validate;
