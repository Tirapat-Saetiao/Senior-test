import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AdminDashboard.css';

const StaffDash = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <div className="user-info">
          <p>Welcome, {userData?.name || 'Staff Member'}</p>
          <p className="email">{userData?.email}</p>
          <div className="dashboard-actions">
            <button onClick={() => navigate('/home')} className="home-btn">
              🏠 Back to Home
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate('/ai-article')}>
            <h3>AI Articles</h3>
            <p>Access and manage AI-related articles</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/ai-work')}>
            <h3>AI Work</h3>
            <p>View and manage AI work submissions</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/gen-ai')}>
            <h3>Gen AI</h3>
            <p>Explore generative AI tools and resources</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/workflow')}>
            <h3>Workflow</h3>
            <p>Manage AI workflow processes</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/tools')}>
            <h3>Tools</h3>
            <p>Access AI tools and utilities</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/profile')}>
            <h3>Profile</h3>
            <p>Manage your profile and settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDash;