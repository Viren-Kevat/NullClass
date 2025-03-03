const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User");

router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body);

    const {
      uid,
      username,
      email,
      password,
      displayName,
      avatar,
      mobileNumber,
    } = req.body;

    // Validate required fields
    if (!uid || !username || !email || !displayName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : "";

    // Create user
    const user = new User({
      uid,
      username,
      email,
      password: hashedPassword,
      displayName,
      avatar,
      mobileNumber, // Add mobile number to user creation
    });

    const savedUser = await user.save();
    // console.log("User saved to MongoDB:", savedUser);

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      displayName: savedUser.displayName,
      avatar: savedUser.avatar,
      password: savedUser.password,
      mobileNumber: savedUser.mobileNumber, // Include mobile number in response
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // console.log("Login request received:", req.body);

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      mobileNumber: user.mobileNumber, // Include mobile number in response
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
});

router.post("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate input
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "Email and new password are required" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

module.exports = router;
