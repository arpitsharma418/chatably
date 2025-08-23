import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const isExisting = await User.findOne({ email: email });

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

    await newUser
      .save()
      .then(() => {
        return res.status(200).json("User Signed Successfully!");
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json("Internal Server Error");
      });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("User does not exist");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json("Invalid email or password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      message: "User Logged In Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

const logout = async (req, res) => {
  const token = req.cookies.token;
  try {
    if(!token){
      return res.status(400).json("You are already logged out!");
    }
    res.clearCookie("token");
    res.status(200).json("User logged out successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};


export { signup, login, logout};
