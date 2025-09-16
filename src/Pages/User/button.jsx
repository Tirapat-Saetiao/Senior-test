import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faLine, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faComments, faTimes, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import '../../CSS/Button.css'

const Button = () => {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  const toggleContactMenu = () => {
    setIsContactOpen(!isContactOpen)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="floating-buttons-container">
      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top-btn ${showScrollTop ? 'visible' : 'hidden'}`}
        onClick={scrollToTop}
        title="Scroll to top"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>

      {/* Floating Contact Widget */}
      <div className={`floating-contact-widget ${isContactOpen ? 'open' : ''}`}>
        {/* Contact Options */}
        <div className="contact-options">
          <a 
            href="https://www.facebook.com/tirapat.saetiao.2025" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-option facebook"
            title="Contact us on Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} />
            <span>Facebook</span>
          </a>
          <a 
            href="https://line.me/your-line-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-option line"
            title="Contact us on Line"
          >
            <FontAwesomeIcon icon={faLine} />
            <span>Line</span>
          </a>
          <a 
            href="https://www.instagram.com/your-instagram" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-option instagram"
            title="Contact us on Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
            <span>Instagram</span>
          </a>
        </div>

        {/* Main Contact Button */}
        <button 
          className="main-contact-btn"
          onClick={toggleContactMenu}
          title={isContactOpen ? "Close contact menu" : "Open contact menu"}
        >
          <FontAwesomeIcon icon={isContactOpen ? faTimes : faComments} />
        </button>
      </div>
    </div>
  )
}

export default Button