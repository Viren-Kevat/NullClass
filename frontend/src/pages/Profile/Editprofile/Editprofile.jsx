import React, { useState } from "react";
import "./Editprofile.css";
import { Box, IconButton, Modal, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaChevronRight } from "react-icons/fa";

const Editprofile = ({ user }) => {
  const [name, setName] = useState(user.displayName || "");
  const [bio, setBio] = useState(user.bio || "");
  const [location, setLocation] = useState(user.location || "");
  const [website, setWebsite] = useState(user.website || "");
  const [dob, setDob] = useState(
    user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
  );
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [open, setOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || "");

  const handleSave = async () => {
    const updatedProfile = {
      displayName: name,
      bio,
      location,
      website,
      dob,
      avatar,
      mobileNumber,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="edit-profile-container">
      <Button
        variant="outlined"
        className="edit-profile__button"
        onClick={() => setOpen(true)}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 1000,
          backgroundColor: "var(--background) !important",
          borderColor: "var(--border-color) !important",
          color: "var(--text-primary) !important",
          ":is(&):hover": {
            backgroundColor: "var(--hover-bg) !important",
          },
        }}
      >
        Edit Profile
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="edit-profile-modal"
      >
        <Box className="edit-profile__modal">
          <div className="edit-profile__header">
            <IconButton
              className="edit-profile__close-button"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <h2 className="edit-profile__title">Edit Profile</h2>
            <Button
              variant="contained"
              className="edit-profile__save-button"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>

          <form className="edit-profile__form">
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="edit-profile__input"
            />

            <TextField
              fullWidth
              label="Bio"
              variant="outlined"
              multiline
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="edit-profile__input"
            />
            <TextField
              fullWidth
              label="Mobile Number"
              variant="outlined"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="edit-profile__input"
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="edit-profile__input"
            />

            <TextField
              fullWidth
              label="Website"
              variant="outlined"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="edit-profile__input"
            />

            <TextField
              fullWidth
              label="Avatar URL"
              variant="outlined"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="edit-profile__input"
            />
          </form>

          <BirthdaySection dob={dob} setDob={setDob} />

          <div className="edit-profile__professional-section">
            <Button
              fullWidth
              endIcon={<FaChevronRight />}
              className="edit-profile__professional-button"
            >
              Switch to Professional
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const BirthdaySection = ({ dob, setDob }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="birthday-section">
      <div className="birthday-section__content" onClick={() => setOpen(true)}>
        <span className="birthday-section__label">Birth Date</span>
        <span className="birthday-section__value">
          {dob || "Add your date of birth"}
        </span>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="birthday-modal"
      >
        <Box className="birthday-modal">
          <h3 className="birthday-modal__title">Edit Date of Birth</h3>
          <p className="birthday-modal__description">
            This can only be changed a few times. Make sure you enter the age of
            the person who will be using this account.
          </p>

          <input
            type="date"
            className="birthday-modal__date-input"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <div className="birthday-modal__actions">
            <Button
              variant="outlined"
              className="birthday-modal__cancel"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="birthday-modal__save"
              onClick={() => setOpen(false)}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Editprofile;
