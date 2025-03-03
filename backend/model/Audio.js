const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Audio", audioSchema);
