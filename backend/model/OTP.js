// model/OTP.js
const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    code: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "5m" }, // Auto-delete after 5 minutes
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("OTP", OTPSchema);
