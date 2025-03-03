const express = require("express");
const router = express.Router();
const validatePaymentTime = require("../middleware/paymentMiddleware");
const Razorpay = require("razorpay");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const User = require("../model/User");
const Subscription = require("../model/Subscription");

const PLANS = {
  free: { amount: 0, tweets: 1 },
  bronze: { amount: 10000, tweets: 3 }, // Amount in paise
  silver: { amount: 30000, tweets: 5 },
  gold: { amount: 100000, tweets: -1 }, // -1 = unlimited
};

const config = {
  TIMEZONE: "Asia/Kolkata",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Replace with your SendGrid API key

const sendReceiptEmail = async (toEmail, userName, plan, paymentDetails) => {
  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_EMAIL, // Use your verified SendGrid email
    subject: "Payment Receipt - Subscription",
    html: `
        <h2>Payment Receipt</h2>
        <p>Thank you for your payment, <strong>${userName}</strong>!</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Payment ID:</strong> ${paymentDetails.razorpay_payment_id}</p>
        <p><strong>Order ID:</strong> ${paymentDetails.razorpay_order_id}</p>
        <p>Your subscription has been successfully activated. 🎉</p>
        <p>Enjoy your benefits!</p>
      `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/update-subscription", async (req, res) => {
  const { userId, plan } = req.body;

  if (!userId || !plan) {
    return res.status(400).json({ error: "Missing userId or plan" });
  }

  try {
    // **Check if user exists**
    const existingUser = await User.findOne({ uid: userId }).populate(
      "subscription"
    );

    if (!existingUser) {
      console.error("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("Before update - User:", existingUser);

    // **Find or create Subscription**
    let updatedSubscription = await Subscription.findOne({
      user: existingUser._id,
    });

    if (!updatedSubscription) {
      console.log("No subscription found, creating new...");
      updatedSubscription = new Subscription({
        user: existingUser._id, // 🔥 Fix: Assign correct user ID
        plan: plan,
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      await updatedSubscription.save();
    } else {
      // **Update existing subscription**
      updatedSubscription.plan = plan;
      updatedSubscription.validTill = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      );
      await updatedSubscription.save();
    }

    // **Sync User Model with Subscription**
    existingUser.plan = plan;
    existingUser.validTill = updatedSubscription.validTill;
    await existingUser.save();

    // console.log("After update - User:", existingUser);

    res.status(200).json({
      message: "Subscription updated successfully",
      user: existingUser,
    });
  } catch (error) {
    console.error("Subscription update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create-order", validatePaymentTime, async (req, res) => {
  try {
    const { plan, userId } = req.body;

    if (!plan || !userId) {
      return res.status(400).json({ error: "Plan and userId are required" });
    }

    if (!PLANS[plan]) {
      return res.status(400).json({ error: "Invalid subscription plan" });
    }

    const options = {
      amount: PLANS[plan].amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.post("/payment-success", async (req, res) => {
  try {
    // console.log("Incoming Payment:", req.body);

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userEmail,
      userName,
      userId,
      plan,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    // **Verify Razorpay signature**
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest("hex");

    // console.log("Generated Signature:", expectedSignature);
    // console.log("Received Signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // **Check if user exists**
    const existingUser = await User.findOne({ uid: userId }).populate(
      "subscription"
    );
    if (!existingUser) {
      console.error("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("Before update - User:", existingUser);

    // **Find or Create Subscription**
    let updatedSubscription = await Subscription.findOne({
      user: existingUser._id,
    });

    if (!updatedSubscription) {
      console.log("No subscription found, creating new...");
      updatedSubscription = new Subscription({
        user: existingUser._id, // ✅ Fix here: Use `existingUser._id`
        plan,
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      await updatedSubscription.save();
    } else {
      // **Update Subscription**
      updatedSubscription.plan = plan;
      updatedSubscription.validTill = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      );
      await updatedSubscription.save();
    }

    // **Sync User Model with Subscription**
    existingUser.subscription = updatedSubscription._id;
    await existingUser.save();

    // console.log("After update - User:", existingUser);

    // **Send success response before email**
    res.status(200).json({
      message: "Subscription updated successfully",
      user: existingUser,
    });

    // **Send receipt email asynchronously**
    sendReceiptEmail(userEmail, userName, plan, {
      razorpay_payment_id,
      razorpay_order_id,
    }).catch((err) => console.error("Error sending email:", err));
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
