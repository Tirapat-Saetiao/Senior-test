import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import '../../CSS/test.css';

const StaffDashboard = ({ userData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.email) {
      fetchStaffData(userData.email);
    }
  }, [userData]);

  const fetchStaffData = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.staff.fetchStaffData(email);
      // Staff data is minimal for now, just validate the call succeeds
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setError('Failed to load staff data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to MFU AI Portal</h1>
        <div className="user-info">
          <p>Welcome, {userData?.name || 'Staff Member'}</p>
          <p className="email">{userData?.email}</p>
          <span className="user-badge staff-badge">Staff</span>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Staff Management Cards */}
        <div className="staff-cards-section">
          <h2>wait information to input</h2>
        </div>

        

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading staff data...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              onClick={() => fetchStaffData(userData.email)} 
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
