import React, { useState } from "react";
import {
  FaUserCircle,
  FaImage,
  FaPoll,
  FaSmile,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./TweetBox.css";

function TweetBox() {
  const { t } = useTranslation(); // Use useTranslation hook
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const MAX_CHARACTERS = 280;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!tweetMessage.trim()) {
      setError(t("tweet.error_empty_message"));
      return;
    }

    if (tweetMessage.length > MAX_CHARACTERS) {
      setError(t("tweet.error_exceeds_characters", { max: MAX_CHARACTERS }));
      return;
    }

    if (tweetImage && !isValidUrl(tweetImage)) {
      setError(t("tweet.error_invalid_image_url"));
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // console.log("Tweet submitted", { tweetMessage, tweetImage });
      setTweetMessage("");
      setTweetImage("");
    } catch (err) {
      setError(t("tweet.error_failed_post"));
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const remainingCharacters = MAX_CHARACTERS - tweetMessage.length;

  return (
    <div className="tweetBox">
      <form onSubmit={handleSubmit}>
        <div className="tweetBox__input">
          <FaUserCircle className="tweetBox__avatar" size={24} />
          <div className="tweetBox__inputWrapper">
            <textarea
              value={tweetMessage}
              onChange={(e) => setTweetMessage(e.target.value)}
              placeholder={t("tweet.placeholder")}
              rows="2"
              maxLength={MAX_CHARACTERS}
              disabled={isLoading}
            />
            <div className="tweetBox__characterCount">
              {remainingCharacters}
            </div>
          </div>
        </div>

        <input
          value={tweetImage}
          onChange={(e) => setTweetImage(e.target.value)}
          className="tweetBox__imageInput"
          placeholder={t("tweet.image_placeholder")}
          type="url"
          pattern="https?://.*"
          disabled={isLoading}
        />

        {error && <div className="tweetBox__error">{error}</div>}

        <div className="tweetBox__footer">
          <div className="tweetBox__icons">
            <button type="button" className="tweetBox__iconButton">
              <FaImage
                className="tweetBox__icon"
                aria-label={t("tweet.add_media")}
              />
            </button>
            <button type="button" className="tweetBox__iconButton">
              <FaPoll
                className="tweetBox__icon"
                aria-label={t("tweet.add_poll")}
              />
            </button>
            <button type="button" className="tweetBox__iconButton">
              <FaSmile
                className="tweetBox__icon"
                aria-label={t("tweet.add_emoji")}
              />
            </button>
            <button type="button" className="tweetBox__iconButton">
              <FaCalendarAlt
                className="tweetBox__icon"
                aria-label={t("tweet.schedule_tweet")}
              />
            </button>
          </div>

          <button
            type="submit"
            className="tweetBox__tweetButton"
            disabled={
              isLoading || !tweetMessage.trim() || remainingCharacters < 0
            }
          >
            {isLoading ? (
              <FaSpinner className="tweetBox__spinner" />
            ) : (
              t("tweet.post")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TweetBox;
