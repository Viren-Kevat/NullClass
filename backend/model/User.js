const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      select: false,
    },
    bio: {
      type: String,
      maxlength: 160,
      default: "",
    },
    location: {
      type: String,
      maxlength: 30,
      default: "",
    },
    website: {
      type: String,
      validate: {
        validator: (v) => {
          if (!v) return true; // Allow empty strings
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
      },
      default: "",
    },
    dob: Date,
    avatar: {
      type: String,
      validate: {
        validator: (v) => {
          if (!v) return true; // Allow empty strings
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
      },
      default: "", // Allow empty string
    },
    verified: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: String,
      validate: {
        validator: (v) => {
          if (!v) return true; // Allow empty strings
          return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
      default: "",
    },
    tweetsLeft: {
      type: Number,
      default: 1, // Free plan starts with 1 tweet
    },
    validTill: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
    versionKey: "__v",
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Virtuals
userSchema.virtual("isSubscribed").get(function () {
  return this.validTill && this.validTill > new Date();
});

userSchema.virtual("age").get(function () {
  if (!this.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

// Pre-save hook to initialize subscription values
userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.tweetsLeft = this.getInitialTweetCount();
  }
  next();
});

// Methods
userSchema.methods.getInitialTweetCount = function () {
  switch (this.plan) {
    case "bronze":
      return 3;
    case "silver":
      return 5;
    case "gold":
      return Number.MAX_SAFE_INTEGER;
    default:
      return 1; // free
  }
};

userSchema.methods.canTweet = function () {
  if (this.plan === "gold") return true;
  if (!this.isSubscribed) return false;
  return this.tweetsLeft > 0;
};

userSchema.methods.decrementTweetCount = async function () {
  if (this.plan !== "gold" && this.tweetsLeft > 0) {
    this.tweetsLeft -= 1;
    await this.save();
  }
};

userSchema.methods.updateSubscription = async function (plan) {
  this.plan = plan;
  this.tweetsLeft = this.getInitialTweetCount();
  this.validTill = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 1 month
  await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
