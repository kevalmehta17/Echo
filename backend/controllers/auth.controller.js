import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

// Signup User
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) return res.status(400).json("User already exists");

    // Hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      lastLogin: Date.now(),
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser._doc; // Exclude password
    res.status(201).json({ success: true, message: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password: userPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcryptjs.compare(userPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id); // Generate token
    user.lastLogin = Date.now(); // Update last login
    await user.save(); // Save updated user
    const { password, ...userWithoutPassword } = user._doc; // Exclude password
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
