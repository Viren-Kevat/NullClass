const express = require("express");
const router = express.Router();
const validateUploadTime = require("../middleware/uploadMiddleware");
const cloudinary = require("../service/cloudinary");
const Audio = require("../model/Audio");
const sgMail = require("@sendgrid/mail");
const OTP = require("../model/OTP");

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Replace with your SendGrid API key

const handleErrors = (res, error) => {
  console.error("Database Error:", error);
  return res.status(500).json({
    error: "Server Error",
    message: error.message,
  });
};
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid email address" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

  try {
    // **Save OTP to MongoDB**
    await OTP.findOneAndUpdate(
      { email },
      { code: otp, expiresAt },
      { upsert: true, new: true }
    );

    const msg = {
      to: email,
      from: "viren0210@gmail.com",
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    };

    await sgMail.send(msg);
    console.log("OTP sent successfully!");

    res.json({
      success: true,
      message: "OTP sent successfully!! It's on Your Profile",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});
// ✅ **Verify OTP Endpoint**
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid/Expired OTP" });
    }

    if (otpRecord.code !== otp || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid/Expired OTP" });
    }

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "OTP Verification Failed" });
  }
});

// Audio Upload Endpoint
router.post("/upload-audio", validateUploadTime, async (req, res) => {
  try {
    // Basic validation
    if (!req.files?.audio || !req.body.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const audioFile = req.files.audio;

    // Basic file validation
    if (audioFile.size > 100 * 1024 * 1024) {
      // 100MB limit
      return res.status(400).json({ error: "File too large" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(audioFile.tempFilePath, {
      resource_type: "video", // Use "video" for audio files
      folder: "audio_uploads", // Optional: specify a folder in Cloudinary
    });

    // Save the Cloudinary URL to your database (optional)
    const audio = new Audio({
      email: req.body.email,
      audioUrl: result.secure_url,
      publicId: result.public_id,
    });

    await audio.save();

    res.status(200).json({
      success: true,
      audioUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Add delete endpoint
router.delete("/delete-audio/:id", async (req, res) => {
  try {
    // console.log("Deleting audio with ID:", req.params.id);
    // console.log("Session Data:", req.session); // Log session data
    // console.log("Request User:", req.user); // Log user data

    const audio = await Audio.findById(req.params.id);
    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }

    await cloudinary.uploader.destroy(audio.publicId, {
      resource_type: "video",
    });

    await Audio.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Deletion failed", details: error.message });
  }
});

// In your /api/user-audios endpoint
router.get("/user-audios", async (req, res) => {
  try {
    // Validate email parameter
    if (!req.query.email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    // Sanitize email input
    const email = req.query.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Fetch from database
    const audios = await Audio.find({ email })
      .sort({ createdAt: -1 })
      .select("audioUrl createdAt") // Only return needed fields
      .lean();

    return res.status(200).json(audios);
  } catch (error) {
    return handleErrors(res, error);
  }
});
module.exports = router;
