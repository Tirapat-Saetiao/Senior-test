import { faFacebook, faInstagram, faLine } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h4>Contact Us</h4>
          <p>Email: aiportal@mfu.ac.th</p>
          <p>Phone: 0-0000-0000</p>
        </div>
        <div className="footer-right">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <FontAwesomeIcon icon={faLine} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 MFU AI PORTAL.</p>
      </div>
    </footer>
  );
};

export default Footer;
