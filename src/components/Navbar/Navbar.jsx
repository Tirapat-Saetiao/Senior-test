import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { authUtils, USER_TYPES } from '../../constants/config';

const Navbar = ({ loggedIn, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const adminToken = sessionStorage.getItem('admin_jwt');
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setIsAdminLoggedIn(!!adminToken);
    setUserData(storedUser);
  }, [loggedIn]); // Re-check when loggedIn state changes

  const handleLogin = (type) => {
    if (type === 'admin') navigate('/admin-login');
    else navigate('/login');
  };

  const handleLogoClick = () => {
    if (userData) {
      // Redirect to appropriate dashboard based on user type
      const userType = authUtils.getUserType(userData.email);
      if (userType === USER_TYPES.STUDENT) {
        navigate('/');
      } else if (userType === USER_TYPES.STAFF) {
        navigate('/');
      } else {
        navigate('/home');
      }
    } else {
      navigate('/'); // Default fallback
    }
  };

  const handleMobileMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="titles" onClick={handleLogoClick}>
          <div className="main-title">AI.MFU</div>
          <div className="sub-title">AI PORTAL FOR MFU</div>  
        </div>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`navbar-right ${menuOpen ? 'active' : ''}`} onClick={handleMobileMenuClose}>
        <NavLink to="/home" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>Home</NavLink>

        <div className="dropdown">
          <button className="navbar-link">Content ▾</button>
          <div className="dropdown-content">
            <NavLink to="/ai-article" className="dropdown-item">AI Article</NavLink>
            <NavLink to="/ai-work" className="dropdown-item">AI กับงานสายปฏิบัติการ</NavLink>
            <NavLink to="/gen-ai" className="dropdown-item">Learn Gen AI</NavLink>
            <NavLink to="/workflow" className="dropdown-item">Workflow and Automation</NavLink>
          </div>
        </div>

        <NavLink to="/tools" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>Tools</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>Contact</NavLink>
        <NavLink to="/special-blog" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>Special Blog</NavLink>

        {loggedIn && (
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          >
            Profile
          </NavLink>
        )}
        
        {isAdminLoggedIn && (
          <NavLink 
            to="/admin-dashboard" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          >
            Admin Dashboard
          </NavLink>
        )}

        {loggedIn || isAdminLoggedIn ? (
          <button onClick={onLogout} className="navbar-link">Logout</button>
        ) : (
          <div className="dropdown login-dropdown">
            <button className="navbar-link">Login ▾</button>
            <div className="login-dropdown-content">
              <button onClick={() => handleLogin('admin')} className="login-item">Admin</button>
              <button onClick={() => handleLogin('general')} className="login-item">General User</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;