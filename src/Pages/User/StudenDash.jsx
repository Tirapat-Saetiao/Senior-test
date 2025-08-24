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
            <h1>Wait infomation from AJARN</h1>
            <p>We will inform you soon</p>
          </div>
        </div>
  );
};

export default StudenDash;