const moment = require("moment-timezone");
const config = {
  TIMEZONE: "Asia/Kolkata",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};
const validatePaymentTime = (req, res, next) => {
  const currentTime = moment().tz(config.TIMEZONE);
  const start = moment().tz(config.TIMEZONE).set({ hour: 10, minute: 0 });
  const end = moment().tz(config.TIMEZONE).set({ hour: 11, minute: 0 });

  if (!currentTime.isBetween(start, end)) {
    return res
      .status(403)
      .json({ error: "Payments only allowed between 10-11 AM IST" });
  }
  next();
};

module.exports = validatePaymentTime;
