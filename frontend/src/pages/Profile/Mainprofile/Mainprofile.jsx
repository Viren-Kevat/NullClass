import React, { useState, useEffect } from "react";
import Post from "../../feed/post/Post";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import { FaArrowLeft } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import { useTranslation } from "react-i18next";

const Mainprofile = ({ user, pic }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${user.uid}/tweets`
        );
        if (!response.ok) throw new Error("Failed to fetch tweets");
        const data = await response.json();
        setTweets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    user && fetchTweets();
  }, [user]);

  if (!user)
    return <div className="profile-error">{t("profile.no_user_data")}</div>;

  return (
    <main className="main-profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <FaArrowLeft className="back-icon" aria-label={t("common.back")} />
        </button>
        <div className="header-info">
          <h1 className="profile-display-name">
            {user.displayName || user.name}
          </h1>
          <p className="tweet-count">
            {tweets.length} {t("profile.tweets")}
          </p>
        </div>
      </header>

      <section className="profile-cover-section">
        <div
          className="profile-cover-photo"
          style={{
            backgroundImage: `url(https://picsum.photos/600/400?random=${Math.random()})`,

            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={t("profile.cover_photo")}
          onError={(e) => {
            // Fallback to gradient if image fails
            e.target.style.backgroundImage = `linear-gradient(45deg, 
              #${Math.random().toString(16).substr(2, 6)}, 
              #${Math.random().toString(16).substr(2, 6)})`;
          }}
        ></div>
        <div className="avatar-wrapper">
          <Avatar
            src={user.photoURL || user.avatar || ""}
            sx={{
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            className="profile-avatar"
            alt={t("profile.user_avatar")}
          />
        </div>
      </section>

      <article className="profile-content">
        <section className="profile-info-section">
          <div className="profile-meta">
            <h2 className="profile-name">{user.displayName || user.name}</h2>
            <p className="profile-handle">@{user.username}</p>
          </div>

          <div className="profile-details">
            <p className="profile-bio">{user.bio || t("profile.no_bio")}</p>

            <div className="profile-meta-grid">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                {user.location || t("profile.no_location")}
              </div>
              <div className="meta-item">
                <span className="meta-icon">🌐</span>
                {user.website ? (
                  user.website.startsWith("http") ? (
                    <a href={user.website} className="website-link">
                      {new URL(user.website).hostname}
                    </a>
                  ) : (
                    user.website
                  )
                ) : (
                  t("profile.no_website")
                )}
              </div>
              <div className="meta-item">
                <span className="meta-icon">🎂</span>
                {user.dob
                  ? new Date(user.dob).toLocaleDateString()
                  : t("profile.no_dob")}
              </div>
            </div>

            <div className="verification-badge">
              {user.verified && (
                <span className="verified-tag">✅ {t("profile.verified")}</span>
              )}
            </div>
          </div>

          <div className="profile-stats-container">
            <StatItem value={user.following} label={t("profile.following")} />
            <StatItem value={user.followers} label={t("profile.followers")} />
            <StatItem value={tweets.length} label={t("profile.tweets")} />
          </div>
        </section>

        <section className="tweets-section">
          {isLoading ? (
            [...Array(3)].map((_, i) => <TweetSkeleton key={i} />)
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            tweets.map((tweet) => <Post key={tweet.id} data={tweet} />)
          )}
        </section>
      </article>
    </main>
  );
};

const StatItem = ({ value, label }) => (
  <div className="stat-item">
    <span className="stat-value">{value || 0}</span>
    <span className="stat-label">{label}</span>
  </div>
);

const TweetSkeleton = () => (
  <div className="tweet-skeleton">
    <div className="skeleton-avatar" />
    <div className="skeleton-content">
      <div className="skeleton-line medium" />
      <div className="skeleton-line long" />
      <div className="skeleton-line short" />
    </div>
  </div>
);

export default Mainprofile;
