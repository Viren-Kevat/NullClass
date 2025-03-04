import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Bookmark from "./pages/bookmark/Bookmark";
import Explore from "./pages/explore/Explore";
import Message from "./pages/message/Message";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import SubscriptionPage from "./pages/Subscription/SubscriptionPage";
import { UserAuthContextProvider } from "./context/Userauthcontext";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import AudioUploder from "./pages/Audio/AudioUploder";
import { useUserAuth } from "./context/Userauthcontext";
import "./App.css";

function App() {
  const { t } = useTranslation();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout, user } = useUserAuth();
  const [userData, setUserData] = useState(null);

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
        setTweets(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${user.uid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);
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
    <UserAuthContextProvider>
      <I18nextProvider i18n={i18n}>
        <Router>
          <div className="App">
            <h1>{t("welcome")}</h1>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Signup />} />
              <Route path="/signup" element={<Login />} />
              <Route path="/bookmarks" element={<Bookmark data={tweets} />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/messages" element={<Message />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/audio" element={<AudioUploder />} />
              <Route path="*" element={<h1>Not Found</h1>} />
              <Route
                path="/subscription"
                element={<SubscriptionPage currentUser={user} />}
              />
            </Routes>
          </div>
        </Router>
      </I18nextProvider>
    </UserAuthContextProvider>
  );
}

export default App;
