import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "../../CSS/Login.css";
import { authUtils } from "../../constants/config";

const LoginPage = ({ onLogin, userData }) => {
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already logged in - but don't redirect automatically
    // Let App.js handle the initial redirect to avoid navigation conflicts
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser && authUtils.isEmailAllowed(storedUser.email)) {
      // User is already logged in, but we won't redirect here
      // This prevents navigation conflicts with App.js
    }
  }, []);

  const handleSuccess = (response) => {
    try {
      if (!response.credential) {
        alert("Login failed. Please try again.");
        return;
      }

      const userObject = jwtDecode(response.credential);
      const userEmail = userObject.email;

      if (!authUtils.isEmailAllowed(userEmail)) {
        alert("❌ Access Denied: Only @lamduan.mfu.ac.th or @mfu.ac.th emails are allowed.");
        return;
      }

      // Store user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userObject));
      setLoginSuccess(true);
      onLogin(userObject);

      // Let App.js handle the redirection to avoid conflicts
      // App.js will redirect all users to /home

    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  // 🌠 Starfall background
  const generateStars = (count = 70) => {
    return Array.from({ length: count }).map((_, index) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 5;

      return (
        <div
          key={index}
          className="star"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      );
    });
  };

  return (
    <div className="login-container">
      <div className="starfall-background">{generateStars(70)}</div>
      <h2>Login with Google</h2>
      {loginSuccess ? (
        <p className="login-message success">✅ Login successful! Redirecting...</p>
      ) : userData ? (
        <p className="login-message">✅ Logged in as {userData.name}</p>
      ) : (
        <p>Please log in with your MFU email</p>
      )}
      <div className="google-login-button">
        <GoogleLogin onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
