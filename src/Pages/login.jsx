import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import '../CSS/login.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch( {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        onLogin();
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while logging in.');
    }
  };

  const handleGoogleSuccess = (response) => {
    const token = response.credential;
    console.log('Google Login Success:', token);
    onLogin();
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const handleGoogleError = (error) => {
    console.error('Google Login Error:', error);
    setMessage('Google login failed. Please try again.');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <h1>Login</h1>
        </header>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap 
            theme="outline" 
            size="large" 
            shape="pill"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
