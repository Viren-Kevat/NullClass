import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  FaTwitter,
  FaHome,
  FaHashtag,
  FaEnvelope,
  FaBookmark,
  FaUser,
  FaMicrophone,
  FaDollarSign, // Add this import
} from "react-icons/fa";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/Userauthcontext";
import SidebarOperation from "./SidebarOperation";
import { useTranslation } from "react-i18next";
import AudioUploder from "../Audio/AudioUploder"; // Import AudioUploder
import userLoggedinuser from "../../hooks/userLoggedinuser"; // Import custom hook
import LanguageSwitcher from "../Language/LanguageSwitcher"; // Import LanguageSwitcher
import "./Sidebar.css";

const Sidebar = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { logout, user } = useUserAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAudioUploder, setShowAudioUploder] = useState(false); // New state
  const [loggedinuser] = userLoggedinuser(); // Use custom hook
  const openmenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const result = user?.email ? user.email.split("@") : ["", ""];

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="sidebar">
          <FaTwitter
            className="sidebar__twitterIcon"
            style={{ fontSize: "4rem" }}
          />
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation active icon={FaHome} text={t("navbar.home")} />
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation
              active
              icon={FaHashtag}
              text={t("navbar.explore")}
            />
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation
              active
              icon={FaEnvelope}
              text={t("navbar.messages")}
            />
          </NavLink>
          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation
              active
              icon={FaBookmark}
              text={t("navbar.bookmarks")}
            />
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation active icon={FaUser} text={t("navbar.profile")} />
          </NavLink>

          <NavLink
            to="/audio"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation
              icon={FaMicrophone}
              text={t("navbar.recordAudio")}
            />
          </NavLink>

          <NavLink
            to="/subscription"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation
              icon={FaDollarSign}
              text={t("navbar.subscription")}
            />
          </NavLink>

          <button className="sidebar__tweet">{t("tweet.post")}</button>

          <div className="profile_info">
            <Avatar src={loggedinuser?.avatar || ""} />
            <div className="user-info">
              <h4>{loggedinuser?.displayName}</h4>
              <h5>{result[0]}</h5>
            </div>
            <IconButton onClick={handleClick}>
              <MoreHorizIcon className="sidebar__more" />
            </IconButton>
          </div>

          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={openmenu}
            onClose={handleClose}
          >
            <MenuItem
              className="profile-info"
              onClick={() => {
                navigate("/profile");
                handleClose();
              }}
            >
              <Avatar src={loggedinuser?.avatar || ""} />
              <div className="user-info sub-user-info">
                <h4>{loggedinuser?.displayName}</h4>
                <h5>{result[0]}</h5>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>{t("navbar.more")}</MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              {t("logout")} @{result[0]}
            </MenuItem>
          </Menu>

          {showAudioUploder && (
            <div className="audio-recorder-modal">
              <div className="modal-content">
                <AudioUploder onClose={() => setShowAudioUploder(false)} />
                <button
                  className="close-button"
                  onClick={() => setShowAudioUploder(false)}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation icon={FaHome} />
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation icon={FaHashtag} />
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation icon={FaEnvelope} />
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation icon={FaUser} />
          </NavLink>
          <NavLink
            to="/audio"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation
              icon={FaMicrophone}
              text={t("navbar.recordAudio")}
            />
          </NavLink>

          <NavLink
            to="/subscription"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <SidebarOperation icon={FaDollarSign} />
          </NavLink>

          {showAudioUploder && (
            <div className="mobile-audio-recorder-modal">
              <div className="modal-content">
                <AudioUploder onClose={() => setShowAudioUploder(false)} />
                <button
                  className="close-button"
                  onClick={() => setShowAudioUploder(false)}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar;
