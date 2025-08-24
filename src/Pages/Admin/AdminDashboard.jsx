import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('admin_jwt');

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
      return;
    }

    axios
      .get('https://ai.mfu.ac.th/strapi/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAdmin(res.data);
        setLoading(false);
      })
      .catch(() => {
        sessionStorage.removeItem('admin_jwt');
        sessionStorage.removeItem('admin_user');
        navigate('/admin-login');
      });
  }, [navigate, token]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_jwt');
    sessionStorage.removeItem('admin_user');
    navigate('/admin-login');
  };

  const navigationItems = [
    {
      title: 'Video Upload',
      description: 'Upload and manage video content',
      path: '/admin-uplode',
      icon: '🎥'
    },
    {
      title: 'Special Content',
      description: 'Manage external links and resources',
      path: '/AdUplink',
      icon: '🔗'
    },
    {
      title: 'AI Tools',
      description: 'Create and edit AI-generated articles',
      path: '/Linkuplode',
      icon: '📝'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">


      <div className="dashboard-content">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Dashboard</h3>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <h2 className="panel-title">Content Management</h2>
          <p className="panel-description">
            Choose from the options below to manage your content and system resources
          </p>
          
          <div className="navigation-grid">
            {navigationItems.map((item, index) => (
              <div key={index} className="nav-card">
                <div className="nav-icon">{item.icon}</div>
                <h3 className="nav-title">{item.title}</h3>
                <p className="nav-description">{item.description}</p>
                <button
                  onClick={() => navigate(item.path)}
                  className="nav-button"
                >
                  Access {item.title}
                  <span className="button-arrow">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;