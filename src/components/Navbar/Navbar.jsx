import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ loggedIn, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const adminToken = sessionStorage.getItem('admin_jwt');
    setIsAdminLoggedIn(!!adminToken);
  }, [loggedIn]);

  const handleLogin = (type) => {
    if (type === 'admin') navigate('/admin-login');
    else navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleMobileMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <div className="titles" onClick={handleLogoClick}>
          <div className="main-title">AI.MFU</div>
          <div className="sub-title">AI PORTAL FOR MFU</div>
        </div>
      </div>

      {/* Center: Nav Links + Login/Logout/Admin */}
      <div className={`navbar-center ${menuOpen ? 'active' : ''}`} onClick={handleMobileMenuClose}>
        <NavLink to="/home" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
          Home
        </NavLink>

        <div className="dropdown">
          <button className="navbar-link">Content ▾</button>
          <div className="dropdown-content">
            <NavLink to="/ai-article" className="dropdown-item">AI Article</NavLink>
            <NavLink to="/ai-work" className="dropdown-item">AI กับงานสายปฏิบัติการ</NavLink>
            <NavLink to="/gen-ai" className="dropdown-item">Learn Gen AI</NavLink>
            <NavLink to="/workflow" className="dropdown-item">Workflow and Automation</NavLink>
          </div>
        </div>

        <NavLink to="/tools" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
          Tools
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
          Contact
        </NavLink>

        {/* Admin Dashboard + Login/Logout */}
        {isAdminLoggedIn && (
          <NavLink to="/admin-dashboard" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
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

      {/* Right: Theme Toggle */}
      <div className="navbar-right">
        <button 
          onClick={toggleTheme} 
          className="navbar-link theme-toggle"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
          <span className="theme-toggle-text">
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
