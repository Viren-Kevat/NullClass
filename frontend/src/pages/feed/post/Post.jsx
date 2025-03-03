import React from "react";
import {
  FaRegComment,
  FaRetweet,
  FaHeart,
  FaShare,
  FaCheckCircle,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import "./Post.css";

function Post({ data = {} }) {
  const { t } = useTranslation(); // Use useTranslation hook
  const {
    user = {},
    text = "",
    image = "",
    timestamp = "",
    likes = 0,
    retweets = 0,
    replies = 0,
    isRetweet = false,
    retweetedBy = "",
  } = data;

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  return (
    <div className={`post ${isRetweet ? "post--retweet" : ""}`}>
      {isRetweet && (
        <div className="post__retweet-label">
          <FaRetweet /> {t("post.retweeted_by")} @{retweetedBy}
        </div>
      )}

      <div className="post__content">
        <div className="post__avatar">
          <img src={user.avatar} alt={user.displayName} />
          {user.verified && (
            <FaCheckCircle className="post__verification-badge" />
          )}
        </div>

        <div className="post__body">
          <div className="post__header">
            <div className="post__user-info">
              <h3 className="post__display-name">
                {user.displayName}
                {user.verified && (
                  <FaCheckCircle className="post__verification-badge--inline" />
                )}
              </h3>
              <span className="post__username">@{user.username}</span>
              <span className="post__timestamp">
                {isValidDate(timestamp)
                  ? `· ${formatDistanceToNow(new Date(timestamp))} ${t(
                      "post.ago"
                    )}`
                  : ""}
              </span>
            </div>
            <div className="post__text">
              <p>{text}</p>
            </div>
          </div>

          {image && (
            <div className="post__media">
              <img src={image} alt={t("post.media_alt")} />
            </div>
          )}

          <div className="post__engagement">
            <button className="post__engagement-button">
              <FaRegComment />
              <span>{replies > 0 && replies}</span>
            </button>

            <button className="post__engagement-button">
              <FaRetweet />
              <span>{retweets > 0 && retweets}</span>
            </button>

            <button className="post__engagement-button">
              <FaHeart />
              <span>{likes > 0 && likes}</span>
            </button>

            <button className="post__engagement-button">
              <FaShare />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
