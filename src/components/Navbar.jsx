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
      <a title="About" href="#about_anchor">About</a>
      <a title="Timeline" href="#timeline_anchor">Timeline</a>
      <a title="Explore" href="#explore_anchor">Explore</a>
      <a title="Pronites" href="#pronites_anchor">Pronites</a>
      <Link to="/events" title="Events">Events</Link>
      <a title="Contact" href="#contact_anchor">Contact</a>
      <a title="Sponsors" href="#sponsors_anchor">Sponsors</a>
      {isLoggedIn ? (
        <a title="Profile" href="./profile/" className="profile show">
          <i className="fas fa-user-astronaut"></i> User
        </a>
      ) : (
        <Link to="/RegisterLogin" title="Login" className="login-btn">
          <i className="fas fa-sign-in-alt"></i> Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;