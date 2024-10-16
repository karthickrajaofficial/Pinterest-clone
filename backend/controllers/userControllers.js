import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateToken.js";

// Register a new user
export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Already have an account with this email" });
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  // Generate a token for the user
  generateToken(newUser._id, res);

  // Respond with user details
  res.status(201).json({
    user: newUser,
    message: "User Registered",
  });
});

// Login a user
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "No user with this email" });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Wrong password" });
  }

  // Generate a token for the user
  generateToken(user._id, res);

  // Respond with user details
  res.json({
    user,
    message: "Logged in",
  });
});

// Get the profile of the logged-in user
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// Get a specific user's profile by ID
export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// Follow or unfollow a user
export const followAndUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "No user with this id" });
  }

  if (user._id.toString() === loggedInUser._id.toString()) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  // Check if the user is already being followed
  if (user.followers.includes(loggedInUser._id)) {
    // Unfollow user
    loggedInUser.following.pull(user._id);
    user.followers.pull(loggedInUser._id);
    await loggedInUser.save();
    await user.save();
    res.json({ message: "User unfollowed" });
  } else {
    // Follow user
    loggedInUser.following.push(user._id);
    user.followers.push(loggedInUser._id);
    await loggedInUser.save();
    await user.save();
    res.json({ message: "User followed" });
  }
});

// Logout the user
export const logOutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged Out Successfully" });
});
