const express = require("express");
const router = express.Router();
const Tweet = require("../model/Tweet");

router.get("/tweets", async (req, res) => {
  try {
    const tweets = await Tweet.find();
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
});

router.get("/bookmarks", async (req, res) => {
  try {
    const bookmarks = await Tweet.find({ bookmarked: true }); // Fetch tweets that are bookmarked
    res.json(bookmarks);
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});
module.exports = router;
