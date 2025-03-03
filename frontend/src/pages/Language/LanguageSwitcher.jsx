import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useUserAuth } from "../../context/Userauthcontext";
import "./LanguageSwitcher.css";

const LANGUAGE_OPTIONS = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh", name: "中文/Mandarin/Chinese", flag: "🇨🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { user: currentUser } = useUserAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const filteredLanguages = LANGUAGE_OPTIONS.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
      localStorage.setItem("selectedLanguage", lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleLanguageSelection = async (lang) => {
    if (lang === "en") {
      i18n.changeLanguage(lang);
      return;
    }

    if (currentUser && currentUser.email) {
      const email = currentUser.email;
      setSelectedLanguage(lang);
      const otp = generateOTP();
      setGeneratedOTP(otp);

      try {
        await sendEmailOTP(email, otp);
        setShowOTPModal(true);
      } catch (error) {
        alert("Error sending OTP: " + error.message);
      }
    } else {
      alert("User is not logged in or email is not available.");
    }
  };

  const sendEmailOTP = async (email, otp, phone) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/otp/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, phone }),
        }
      );

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const verifyOTP = () => {
    if (otp === generatedOTP) {
      i18n.changeLanguage(selectedLanguage);
      setShowOTPModal(false);
      alert(`Language changed to ${selectedLanguage.toUpperCase()}!`);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <h3>Language Switcher</h3>
      <div
        className="switcher-header"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="current-language">
          <span className="flag">
            {LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage)?.flag}
          </span>
          <span className="name">
            {LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage)?.name}
          </span>
        </div>
        <div className={`dropdown-indicator ${isDropdownOpen ? "open" : ""}`}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="language-dropdown">
          <div className="language-list">
            {filteredLanguages.map(({ code, name, flag }) => (
              <div
                key={code}
                className={`language-item ${
                  currentLanguage === code ? "selected" : ""
                }`}
                onClick={() => {
                  handleLanguageSelection(code);
                  setIsDropdownOpen(false);
                }}
              >
                <span className="flag">{flag}</span>
                <span className="name">{name}</span>
                {currentLanguage === code && (
                  <span className="checkmark">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showOTPModal && (
        <div className="otp-modal">
          <div
            className="modal-backdrop"
            onClick={() => setShowOTPModal(false)}
          />
          <div className="modal-content">
            <div className="modal-header">
              <h3>Verify Language Change</h3>
              <button
                onClick={() => setShowOTPModal(false)}
                className="close-btn"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>We've sent a verification code to your email.</p>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
                maxLength="6"
              />
            </div>
            <div className="modal-footer">
              <button onClick={verifyOTP} className="verify-btn">
                Confirm Change
              </button>
              <button
                onClick={() => setShowOTPModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
