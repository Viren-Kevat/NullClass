const mongoose = require("mongoose");
const tweetSchema = new mongoose.Schema(
  {
    user: {
      displayName: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        required: true,
      },
    },
    text: {
      type: String,
      required: true,
      maxlength: 280,
    },
    image: {
      type: String,
      default: null,
      validate: {
        validator: (v) => {
          if (!v) return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
      },
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    retweets: {
      type: Number,
      default: 0,
    },
    replies: {
      type: Number,
      default: 0,
    },
    isRetweet: {
      type: Boolean,
      default: false,
    },
    retweetedBy: {
      type: String,
      validate: {
        validator: function (v) {
          return this.isRetweet ? !!v : true;
        },
      },
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);
const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
