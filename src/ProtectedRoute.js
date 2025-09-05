import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authUtils } from "./constants/config";

/**
 * ProtectedRoute Component
 * - Handles access control based on user email domain or admin JWT.
 */
const ProtectedRoute = ({ children, isLoggingOut }) => {
  const navigate = useNavigate();
  const alertShown = useRef(false);

  useEffect(() => {
    // Don't run validation if user is in the process of logging out
    if (isLoggingOut) return;

    const validateAccess = () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const adminToken = sessionStorage.getItem("admin_jwt");

      if (!user && !adminToken) {
        if (!alertShown.current) {
          alertShown.current = true;
          alert("Please log in to access this page.");
          navigate("/login");
        }
        return false;
      }

      const isAuthorized = adminToken || (user && authUtils.isEmailAllowed(user.email));

      if (!isAuthorized && !alertShown.current) {
        alertShown.current = true;
        alert("Access Denied: You must log in with a valid MFU email.");
        navigate("/login");
      }

      return isAuthorized;
    };

    validateAccess();

    return () => {
      alertShown.current = false;
    };
  }, [navigate, isLoggingOut]);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const adminToken = sessionStorage.getItem("admin_jwt");
  const isAuthorized = adminToken || (user && authUtils.isEmailAllowed(user.email));

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
