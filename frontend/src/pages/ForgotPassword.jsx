import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../context/firebase";
import {
  Alert,
  Button,
  TextField,
  Snackbar,
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { keyframes } from "@mui/system";
import { useTranslation } from "react-i18next";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ForgotPassword = () => {
  const { t } = useTranslation(); // Use useTranslation hook
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lastRequest = localStorage.getItem("lastPasswordResetRequest");
    setLastRequestTime(lastRequest ? parseInt(lastRequest) : null);
  }, []);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setSuccess(t("forgot_password.password_copied"));
  };

  const updatePasswordInBackend = async (email, newPassword) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update password in backend");
      }

      setSuccess(t("forgot_password.password_updated"));
    } catch (error) {
      setError(t("forgot_password.update_failed"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (lastRequestTime && Date.now() - lastRequestTime < 24 * 60 * 60 * 1000) {
      setError(t("forgot_password.request_limit"));
      return;
    }

    if (!emailOrPhone) {
      setError(t("forgot_password.enter_email_or_phone"));
      return;
    }

    try {
      const isEmail = /\S+@\S+\.\S+/.test(emailOrPhone);
      const isPhone = /^\d{10}$/.test(emailOrPhone);

      if (!isEmail && !isPhone) {
        setError(t("forgot_password.invalid_format"));
        return;
      }

      if (isEmail) {
        await sendPasswordResetEmail(auth, emailOrPhone);
        setSuccess(t("forgot_password.reset_link_sent", { emailOrPhone }));
      } else {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
          },
          auth
        );
        await signInWithPhoneNumber(
          auth,
          `+1${emailOrPhone}`,
          window.recaptchaVerifier
        );
        setSuccess(t("forgot_password.verification_code_sent"));
      }

      // Update the password in the backend
      if (generatedPassword) {
        await updatePasswordInBackend(emailOrPhone, generatedPassword);
      }

      localStorage.setItem("lastPasswordResetRequest", Date.now());

      // Redirect to login page after successful password update
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
        backgroundImage:
          "radial-gradient(circle at center, #ffffff 0%, #f0f2f5 100%)",
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: "32px",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          width: "100%",
          maxWidth: "600px",
          ":is(&) :hover": {
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#333333",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "2rem",
            mb: 4,
            position: "relative",
            fontFamily: "'Segoe UI', system-ui",
            ":is(&):after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              backgroundColor: "#1DA1F2",
              borderRadius: "2px",
            },
          }}
        >
          {t("forgot_password.title")}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t("forgot_password.email_or_phone")}
            variant="outlined"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            sx={{
              mb: 3,
              ":is(&) .MuiOutlinedInput-root": {
                borderRadius: "16px",
                backgroundColor: "#f0f2f5",
                color: "#333333",
                ":is(&) fieldset": {
                  borderColor: "#e0e0e0",
                },
                ":is(&):hover fieldset": {
                  borderColor: "#1DA1F2",
                },
                ":is(&).Mui-focused fieldset": {
                  borderColor: "#1DA1F2",
                  boxShadow: "0 0 0 2px rgba(29, 161, 242, 0.2)",
                },
              },
              ":is(&) .MuiInputLabel-root": {
                color: "#666666",
              },
              ":is(&) .MuiInputBase-input": {
                color: "#333333",
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: "#1DA1F2",
                color: "#FFFFFF",
                borderRadius: "9999px",
                height: "48px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                ":is(&):hover": {
                  backgroundColor: "#1991DB",
                  transform: "scale(1.02)",
                },
                ":is(&):active": {
                  transform: "scale(0.98)",
                },
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {t("forgot_password.send_reset_link")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              fullWidth
              sx={{
                borderRadius: "8px",
                height: "48px",
                padding: "0 30px",
                transition: "all 0.3s ease",
                ":is(&):hover": {
                  transform: "translateY(-2px)",
                },
                mb: 2,
              }}
            >
              {t("forgot_password.back_to_login")}
            </Button>
          </Box>
        </form>

        <div id="recaptcha-container"></div>

        <Box sx={{ mt: 4, borderTop: "1px solid #e0e0e0", pt: 3 }}>
          <Typography variant="h6" sx={{ color: "#333333", mb: 2 }}>
            {t("forgot_password.generate_secure_password")}
          </Typography>
          <Button
            variant="contained"
            onClick={generatePassword}
            sx={{
              mb: 2,
              backgroundColor: "#1DA1F2",
              color: "#FFFFFF",
              borderRadius: "9999px",
              height: "48px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              ":is(&):hover": {
                backgroundColor: "#1991DB",
                transform: "scale(1.02)",
              },
              ":is(&):active": {
                transform: "scale(0.98)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {t("forgot_password.generate_secure_password")}
          </Button>

          {generatedPassword && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f0f2f5",
                borderRadius: "16px",
                p: 2,
                mt: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#333333",
                  fontFamily: "monospace",
                  letterSpacing: "0.1em",
                }}
              >
                {generatedPassword}
              </Typography>
              <IconButton onClick={copyToClipboard} sx={{ color: "#1DA1F2" }}>
                <ContentCopyIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Snackbar
          open={!!error || !!success}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={error ? "error" : "success"}
            sx={{
              backgroundColor: error ? "#f8d7da" : "#d1ecf1",
              color: "#333333",
              borderRadius: "16px",
              border: error ? "1px solid #f5c6cb" : "1px solid #bee5eb",
              ":is(&).MuiAlert-icon": {
                color: error ? "#721c24" : "#0c5460",
              },
            }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
