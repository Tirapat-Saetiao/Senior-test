import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AdminDashboard.css';

const StudenDash = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);


  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <p>Welcome, {userData?.name || 'Student'}</p>
          <p className="email">{userData?.email}</p>
          
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate('/ai-article')}>
            <h3>AI Articles</h3>
            <p>Read and explore AI-related articles</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/ai-work')}>
            <h3>AI Work</h3>
            <p>View AI work examples and submissions</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/gen-ai')}>
            <h3>Gen AI</h3>
            <p>Learn about generative AI technologies</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/workflow')}>
            <h3>Workflow</h3>
            <p>Understand AI workflow processes</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/tools')}>
            <h3>Tools</h3>
            <p>Access student AI tools and resources</p>
          </div>
          
          <div className="dashboard-card" onClick={() => navigate('/profile')}>
            <h3>Profile</h3>
            <p>Manage your student profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudenDash;