import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { APP_CONFIG } from '../config';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem(APP_CONFIG.tokenName);
    if (token) {
      setIsLoggedIn(true);
    }

    // Show navbar on scroll
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="nav" style={{ opacity: showNav ? 1 : 0 }}>
      <img
        src="/assets/sit_logo-removebg-preview.png"
        alt="SIT Logo"
        className="nav-logo sit-logo"
      />

      <a title="About" href="#about_anchor">About</a>
      <a title="Timeline" href="#timeline_anchor">Timeline</a>
      <a title="Explore" href="#explore_anchor">Explore</a>
      <a title="Special Guests" href="#special_guests">Special Guests</a>
      <Link to="/events" title="Events">Events</Link>
      <a title="Reach Us" href="#reach_us">Reach Us</a>
      <a title="Contact" href="#contact_anchor">Contact</a>
      <a title="Sponsors" href="#sponsors_anchor">Sponsors</a>

      {isLoggedIn ? (
        <Link to="/profile" title="Profile" className="profile show">
          <i className="fas fa-user-astronaut"></i> Profile
        </Link>
      ) : (
        <Link to="/RegisterLogin" title="Login">
          Login
        </Link>
      )}

      <img
        src="/assets/final LOGO.png"
        alt="Halcyon 2025 Logo"
        className="nav-logo halcyon-logo"
      />
    </nav>
  );
}

export default Navbar;