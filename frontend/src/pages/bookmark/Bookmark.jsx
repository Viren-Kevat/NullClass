import React, { useEffect, useState } from "react";
import Post from "../feed/post/Post";
import Sidebar from "../sidebar/Sidebar";
import Widgets from "../widgets/Widgets";
import { useUserAuth } from "../../context/Userauthcontext";
import "./Bookmark.css";

function Bookmark() {
  const { user } = useUserAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/tweets/bookmarks`
        ); // Update API URL
        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks");
        }
        const data = await response.json();
        setBookmarks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  return (
    <div className="bookmark">
      <Sidebar user={user} />
      <div className="bookmark__main">
        <div className="bookmark__header">
          <h2>Bookmarks</h2>
        </div>

        {loading ? (
          Array(3)
            .fill()
            .map((_, i) => (
              <div key={i} className="loading__skeleton">
                <div className="loading__content"></div>
                <div className="loading__content"></div>
                <div className="loading__content"></div>
              </div>
            ))
        ) : error ? (
          <p className="error">{error}</p>
        ) : bookmarks.length > 0 ? (
          <div className="bookmark__posts">
            {bookmarks.map((item) => (
              <Post key={item._id} data={item} className="post-card" />
            ))}
          </div>
        ) : (
          <div className="bookmark__empty">
            <p>No bookmarks found</p>
            <p className="text-secondary">Save posts to view them later</p>
          </div>
        )}
      </div>
      <Widgets />
    </div>
  );
}

export default Bookmark;
