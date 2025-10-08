import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"

dotenv.config();


export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });


    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      history: [{ action: "account_created", details: "User signed up" }],
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addHistory = async (req, res) => {
  try {
    const { userId, action, details } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.history.push({ action, details });
    await user.save();

    res.status(200).json({ message: "History added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};