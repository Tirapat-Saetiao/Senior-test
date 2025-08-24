import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AdminLogin.css';
import validator from 'validator';

const MAX_LOGIN_ATTEMPTS = 10;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours



const AdminLogin = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Check for existing lockout and attempts on component mount
  useEffect(() => {
    const storedLockout = sessionStorage.getItem('adminLoginLockout');
    const storedAttempts = sessionStorage.getItem('adminLoginAttempts');
    
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout);
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime);
      } else {
        sessionStorage.removeItem('adminLoginLockout');
      }
    }

    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
  }, []);



  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt started');

    // Check for lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 60000);
      console.log('Account is locked:', remainingTime, 'minutes remaining');
      setError(`Account is locked. Please try again in ${remainingTime} minutes.`);
      return;
    }

    setIsLoading(true);

    const sanitizedIdentifier = validator.trim(validator.escape(identifier));
    const sanitizedPassword = validator.trim(password);
    console.log('Attempting login for:', sanitizedIdentifier);



    try {
      // Add timestamp to prevent replay attacks
      const timestamp = Date.now();
      console.log('Sending login request to server...');
      const response = await axios.post(
        'https://ai.mfu.ac.th/strapi/api/auth/local',
        { 
          identifier: sanitizedIdentifier, 
          password: sanitizedPassword,
          timestamp
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Server response received:', response.status);
      const { jwt, user } = response.data;

      if (jwt) {
        console.log('Login successful, setting up session...');
        // Reset login attempts on successful login
        setLoginAttempts(0);
        sessionStorage.removeItem('adminLoginAttempts');
        sessionStorage.removeItem('adminLoginLockout');

        // Store JWT with enhanced security
        const tokenExpiry = new Date(Date.now() + TOKEN_EXPIRY);
        const secureCookieOptions = {
          path: '/',
          secure: true,
          sameSite: 'Strict',
          expires: tokenExpiry.toUTCString()
        };

        // Store token in both sessionStorage and cookie
        sessionStorage.setItem('admin_jwt', jwt);
        document.cookie = `admin_jwt=${jwt}; ${Object.entries(secureCookieOptions)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')}`;
        
        // Store user data with sensitive information removed
        const safeUserData = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role?.type || 'authenticated'
        };
        sessionStorage.setItem('admin_user', JSON.stringify(safeUserData));
        
        console.log('Session setup complete, redirecting to dashboard...');
        setLoggedIn?.(true);
        
        // Add a small delay to ensure storage is complete
        setTimeout(() => {
          navigate('/admin-dashboard', { replace: true });
        }, 100);
      } else {
        console.log('Login failed: No JWT received');
        handleFailedLogin();
      }
    } catch (err) {
      console.error('Login error:', err);
      handleFailedLogin();
      
      if (err.response) {
        console.log('Error response:', err.response.status, err.response.data);
        switch (err.response.status) {
          case 429:
            setError('Too many login attempts. Please try again later.');
            break;
          case 401:
            setError('Invalid username or password.');
            break;
          case 403:
            setError('Access denied. Please try again.');
            break;
          default:
            setError(`Server error (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        console.log('No response received from server');
        setError('No response from server. Please check your connection.');
      } else {
        console.log('Request setup error:', err.message);
        setError('Error connecting to server. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    sessionStorage.setItem('adminLoginAttempts', newAttempts.toString());

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION;
      setLockoutUntil(lockoutTime);
      sessionStorage.setItem('adminLoginLockout', lockoutTime.toString());
      setError(`Too many failed attempts. Account locked for 15 minutes.`);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="admin-login-input"
          required
          disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
          autoComplete="username"
          maxLength={100}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="admin-login-input"
          required
          disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
          autoComplete="current-password"
          maxLength={100}
        />
        <button 
          type="submit" 
          className="admin-login-button"
          disabled={isLoading || (lockoutUntil && Date.now() < lockoutUntil)}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="admin-login-error">{error}</p>}
        {loginAttempts > 0 && (
          <p className="login-attempts">
            Failed attempts: {loginAttempts}/{MAX_LOGIN_ATTEMPTS}
          </p>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;