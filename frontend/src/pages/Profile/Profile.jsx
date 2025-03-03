import React, { useState, useEffect } from "react";
import Mainprofile from "./Mainprofile/Mainprofile";
import Sidebar from "../sidebar/Sidebar";
import Widgets from "../widgets/Widgets";
import Editprofile from "../Profile/Editprofile/Editprofile";
import { useUserAuth } from "../../context/Userauthcontext";
import AudioList from "../Audio/AudioList";
import "./Profile.css";

const Profile = () => {
  const { user } = useUserAuth(); // Get logged-in user
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${user.uid}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Loading State
  if (isLoading) return <div className="loader">Loading...</div>;

  // Error State with Retry Button
  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // No User Data Found
  if (!userData) return <div>No user data available</div>;

  return (
    <div className="profilePage">
      <Sidebar user={user} />
      <main className="profile-main-content">
        <Editprofile user={userData} />
        <Mainprofile user={userData} pic={user.photoURL} />

        {user?.email && <AudioList userEmail={user.email} />}
      </main>
      <Widgets />
    </div>
  );
};

export default Profile;
