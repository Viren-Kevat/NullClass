import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUserAuth } from "../../context/Userauthcontext";
import "./AudioUploder.css";
import Sidebar from "../sidebar/Sidebar";
import Widgets from "../widgets/Widgets";

const AudioRecorder = () => {
  const { t } = useTranslation();
  const { user, logout } = useUserAuth(); // Fetch logged-in user details
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  // Handle file selection and trigger OTP sending
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      await sendOTP(user.email);
    }
  };

  // Send OTP to the logged-in user's email
  const sendOTP = async (email) => {
    if (!email) {
      alert(t("audio.no_email_found"));
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/audio/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowOTPModal(true);
        setCooldown(30);
        alert(t("audio.otp_sent"));
      } else {
        alert(data.message || t("audio.otp_failed"));
      }
    } catch (error) {
      console.error(t("audio.error_sending_otp"), error);
      alert(t("audio.error_sending_otp"));
    }
  };

  // Verify the OTP entered by the user
  const verifyOTP = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/audio/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, otp }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowOTPModal(false);
        await uploadFile();
        setOtp("");
      } else {
        alert(t("audio.invalid_otp"));
      }
    } catch (error) {
      console.error(t("audio.error_verifying_otp"), error);
      alert(t("audio.error_verifying_otp"));
    }
  };

  // Upload file after OTP verification
  const uploadFile = async () => {
    if (!selectedFile) {
      alert(t("audio.no_file_selected"));
      return;
    }

    const formData = new FormData();
    formData.append("audio", selectedFile);
    formData.append("email", user.email);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/audio/upload-audio`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        // console.log(t("audio.audio_uploaded"), data.audioUrl);
        alert(t("audio.file_uploaded"));
        setSelectedFile(null);
      } else {
        console.error(t("audio.upload_failed"), data.error);
        alert(data.error || t("audio.upload_failed"));
      }
    } catch (error) {
      console.error(t("audio.error_uploading_audio"), error);
      alert(t("audio.error_uploading_file"));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  if (loading) {
    return <div>{t("audio.loading")}</div>;
  }

  return (
    <div className="app-container">
      <Sidebar handleLogout={handleLogout} user={user} />

      <main className="main-content">
        <section className="audio-recorder__container">
          {showOTPModal && (
            <div className="otp-modal__backdrop">
              <div className="otp-modal__content">
                <h2 className="otp-modal__title">
                  {t("audio.secure_upload_verification")}
                </h2>
                <p className="otp-modal__instruction">
                  {t("audio.otp_sent_to")} {user?.email}
                </p>

                <div className="otp-input__container">
                  <input
                    type="tel"
                    autoFocus
                    className="otp-input"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    style={{ color: otp.length === 6 ? "green" : "black" }}
                  />
                </div>

                <div className="otp-modal__actions">
                  <button
                    className="btn btn--primary"
                    onClick={verifyOTP}
                    disabled={otp.length !== 6}
                  >
                    {t("audio.verify_upload")}
                  </button>
                  <button
                    className="btn btn--secondary"
                    onClick={() => sendOTP(user.email)}
                    disabled={cooldown > 0}
                  >
                    {cooldown > 0
                      ? `${t("audio.resend_in")} ${cooldown}s`
                      : t("audio.resend_code")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <article className="upload-card">
            <header className="upload-card__header">
              <h1 className="upload-card__title">
                {t("audio.secure_audio_upload")}
              </h1>
              <p className="upload-card__user">
                {t("audio.logged_in_as")}: {user?.email}
              </p>
            </header>

            <div className="upload-card__body">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                id="audio-upload-input"
                className="visually-hidden"
              />

              <label
                htmlFor="audio-upload-input"
                className="file-upload__label"
              >
                <div className="file-upload__content">
                  <svg className="upload-icon" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                    <path d="M16 13h-3V10h-2v3H8l4 4 4-4z" />
                  </svg>
                  <span className="file-upload__text">
                    {selectedFile
                      ? selectedFile.name
                      : t("audio.choose_audio_file")}
                  </span>
                  {selectedFile && (
                    <div className="file-metadata">
                      <span className="file-size">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </article>
        </section>
        <Widgets />
      </main>
    </div>
  );
};

export default AudioRecorder;
