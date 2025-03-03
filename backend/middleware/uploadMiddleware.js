const moment = require("moment-timezone");
const validateUploadTime = (req, res, next) => {
  const now = moment().tz("Asia/Kolkata");
  const start = moment().tz("Asia/Kolkata").set({ hour: 14, minute: 0 });
  const end = moment().tz("Asia/Kolkata").set({ hour: 19, minute: 0 });

  if (!now.isBetween(start, end)) {
    return res.status(403).json({
      error: "Audio uploads allowed only between 2 PM to 7 PM IST",
    });
  }
  next();
};
module.exports = validateUploadTime;
