const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
// New endpoint to send OTP for translation
const validateUploadTime = require("../middleware/uploadMiddleware");
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Replace with your SendGrid API key

router.post("/send-otp", validateUploadTime, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL, // Replace with your verified email from SendGrid
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };
    // console.log(otp);

    await sgMail.send(msg);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
