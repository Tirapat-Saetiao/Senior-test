import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ALLOWED_DOMAINS = ["@lamduan.mfu.ac.th", "@mfu.ac.th"];

/**
 * Checks if the provided email is within the allowed domains.
 */
const isEmailAllowed = (email) => {
  return ALLOWED_DOMAINS.some((domain) => email.endsWith(domain));
};

/**
 * ProtectedRoute Component
 * - Handles access control based on user email domain or admin JWT.
 */
const ProtectedRoute = ({ children, isLoggingOut }) => {
  const navigate = useNavigate();
  const alertShown = useRef(false);

  useEffect(() => {
    const validateAccess = () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const adminToken = sessionStorage.getItem("admin_jwt");

      if (!user && !adminToken) {
        if (!alertShown.current && !isLoggingOut) {
          alertShown.current = true;
          alert("Please log in to access this page.");
          navigate("/login");
        }
        return false;
      }

      const isAuthorized = adminToken || (user && isEmailAllowed(user.email));

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
  const isAuthorized = adminToken || (user && isEmailAllowed(user.email));

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
