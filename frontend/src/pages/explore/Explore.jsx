import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Post from "../feed/post/Post";
import Sidebar from "../sidebar/Sidebar";
import Widgets from "../widgets/Widgets";
import { useUserAuth } from "../../context/Userauthcontext";
import "./Explore.css";

function Explore() {
  const { user } = useUserAuth();
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/tweets/tweets`
        );
        const data = await response.json();
        // console.log("Fetched Tweets:", data);
        setTweets(data);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
  }, [user]);

  return (
    <div className="explore">
      <Sidebar user={user} />

      <div className="explore-content">
        {isLoading
          ? Array(5)
              .fill()
              .map((_, i) => (
                <div key={i} className="loading-tweet">
                  <div className="loading-content"></div>
                  <div className="loading-content"></div>
                  <div className="loading-content"></div>
                </div>
              ))
          : tweets.map((tweet) => <Post key={tweet._id} data={tweet} />)}
      </div>

      <Widgets />
    </div>
  );
}

export default Explore;
