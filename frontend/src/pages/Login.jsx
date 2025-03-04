import React, { useState } from "react";
import { useUserAuth } from "../context/Userauthcontext";
import { useNavigate, Link } from "react-router-dom";
import { FaTwitter, FaGoogle } from "react-icons/fa";
import { Button } from "@mui/material"; // Import Button from MUI
import "./Login.css";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Login = () => {
  const { t } = useTranslation(); // Use useTranslation hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(t("login.invalid_credentials"));
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithGoogle();

      navigate("/home");
    } catch (error) {
      setError(t("login.google_login_failed"));
    }
  };

  return (
    <div className="login-container">
      <div className="login-brand">
        <FaTwitter className="twitter-icon" />
        <h1>Twitter</h1>
      </div>

      <div className="login-card">
        <h2 className="login-title">{t("login.title")}</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">{t("Email")}</label>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">{t("login.password")}</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? t("hide") : t("show")}
            </button>
          </div>

          <Button component={Link} to="/forgot-password" sx={{ mt: 2 }}>
            {t("login.forgot_password")}
          </Button>

          <button type="submit" className="login-button">
            {t("login.log_in")}
          </button>
        </form>

        <div className="social-login">
          <p className="divider">
            <span>{t("or")}</span>
          </p>
          <button className="google-login" onClick={handleGoogleLogin}>
            <FaGoogle className="google-icon" />
            {t("login.continue_with_google")}
          </button>
        </div>

        <div className="signup-link">
          {t("login.no_account")} <Link to="/">{t("login.sign_up")}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
