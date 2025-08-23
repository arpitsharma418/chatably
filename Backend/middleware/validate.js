import jwt from "jsonwebtoken";
import User from "../models/user.js";

const validate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("You are not logged in.");
    }
    const varified = jwt.verify(token, process.env.JWT_SECRET);
    if(!varified){
        return res.status(401).json("Invalid");
    }
    const user = await User.findById(varified.id).select("-password");
    if(!user){
        return res.status(401).json("User Not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export default validate;
