const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Tweet = require("../model/Tweet");
router.get("/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching logged in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId/tweets", async (req, res) => {
  try {
    const { userId } = req.params;
    const tweets = await Tweet.find({ user: userId });
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
});
// Update User Endpoint
router.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const updatedData = req.body;
    const user = await User.findOneAndUpdate({ uid }, updatedData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
