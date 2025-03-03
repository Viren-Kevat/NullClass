require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload"); // Import express-fileupload
const app = express();
const port = process.env.PORT || 3000;
const audioRoutes = require("./routes/audioRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const otpRoutesTranslation = require("./routes/otpRoutesTranslation");
const tweetRoutes = require("./routes/tweetRoutes");

app.use(express.json({ limit: "100mb" }));
app.use(cors({ origin: "*" }));
app.use(fileUpload({ useTempFiles: true })); // Use express-fileupload middleware with temp files

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI) // Replace with your MongoDB URI
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/otp", otpRoutesTranslation);
app.use("/api/tweets", tweetRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
