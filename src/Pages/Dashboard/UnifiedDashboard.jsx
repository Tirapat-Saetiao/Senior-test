import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import StudentDashboard from './StudentDashboard';
import StaffDashboard from './StaffDashboard';
import '../../CSS/test.css';
import { MESSAGES } from '../../constants/config';

const UnifiedDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState('unknown');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDashboard = () => {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      
      if (!storedUser) {
        // Redirect to login if no user data
        navigate('/');
        return;
      }

      setUserData(storedUser);
      
      // Use the apiService getUserType method for consistency
      const detectedUserType = apiService.getUserType(storedUser.email);
      setUserType(detectedUserType);
      
      // Handle unknown user types
      if (detectedUserType === 'unknown') {
        console.warn('Unknown user type for email:', storedUser.email);
        // Could redirect to an error page or show a message
      }
      
      setLoading(false);
    };

    initializeDashboard();
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state for unknown user types
  if (userType === 'unknown') {
    return (
      <div className="dashboard-error">
        <div className="error-container">
          <h2>Access Denied</h2>
          <p>Your email domain is not authorized to access this portal.</p>
          <p>{MESSAGES.INVALID_EMAIL}</p>
          <button onClick={() => navigate('/login')} className="retry-btn">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user type
  switch (userType) {
    case 'student':
      return <StudentDashboard userData={userData} />;
    case 'staff':
      return <StaffDashboard userData={userData} />;
    default:
      return (
        <div className="dashboard-error">
          <div className="error-container">
            <h2>Unexpected Error</h2>
            <p>Unable to determine your user type. Please try logging in again.</p>
            <button onClick={() => navigate('/login')} className="retry-btn">
              Back to Login
            </button>
          </div>
        </div>
      );
  }
};

export default UnifiedDashboard;
