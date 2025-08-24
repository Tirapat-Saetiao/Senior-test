import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

const API_URL = "https://ai.mfu.ac.th/strapi/api/users/me";
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieves the admin token from session storage
 */
const getToken = () => sessionStorage.getItem("admin_jwt");

/**
 * PrivateRoute Component - Handles Admin Access Control
 */
const PrivateRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  /**
   * Clears the session data
   */
  const clearAuthData = () => {
    sessionStorage.removeItem("admin_jwt");
    sessionStorage.removeItem("admin_user");
  };

  /**
   * Validates the token by making an API request
   */
  const validateToken = async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  };

  /**
   * Check Authentication on Component Mount
   */
  useEffect(() => {
    const checkAuthorization = async () => {
      const token = getToken();

      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      const isValid = await validateToken(token);
      setIsAuthorized(isValid);
      setIsLoading(false);

      if (!isValid) {
        clearAuthData();
      }
    };

    checkAuthorization();
    const interval = setInterval(checkAuthorization, TOKEN_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [location.pathname]);

  if (isLoading) return <p>Loading...</p>;

  return isAuthorized ? children : <Navigate to="/admin-login" state={{ from: location }} replace />;
};

export default PrivateRoute;
