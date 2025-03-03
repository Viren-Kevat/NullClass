import React, { useState, useEffect } from "react";
import TweetBox from "./tweetbox/TweetBox";
import Post from "./post/Post";
import { useTranslation } from "react-i18next";
import "./Feed.css";

function Feed() {
  const { t } = useTranslation(); // Use useTranslation hook
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/tweets/tweets`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tweets");
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return <div>{t("common.loading")}</div>;
  }

  if (error) {
    return (
      <div>
        {t("errors.something_went_wrong")}: {error}
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>{t("navbar.home")}</h2>
      </div>
      <TweetBox />
      {posts.map((post) => (
        <Post key={post._id} data={post} />
      ))}
    </div>
  );
}

export default Feed;
