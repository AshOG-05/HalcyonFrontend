// Added by Abhishek for testing PR 2
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { APP_CONFIG } from '../config';
import { logout } from '../services/authService';
import './Banner.css';

function Banner() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem(APP_CONFIG.tokenName);
    if (token) {
      setIsLoggedIn(true);
    }

    // Countdown Timer
    const festDay = new Date("MAY 16, 2025 11:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = festDay - now;

      setDays(Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))));
      setHours(Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))));
      setMinutes(Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))));
      setSeconds(Math.max(0, Math.floor((distance % (1000 * 60)) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="banner panel" id="top">
      <style>
        {`
          .banner .register-button a, .banner .logout-button a {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
          }
        `}
      </style>
      <Navbar />
      <Sidebar />
      <video src="/assets/background.mp4" loop muted autoPlay style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -2
      }}></video>
      <div className="overlay"></div>
      <div className="heading">
        <h1 className="samarkan" style={{fontFamily:'CustomFont'}}>HALCYON</h1>
        <h1 className="samarkan" style={{fontFamily:'CustomFont'}}>2025</h1>
        <p>Step into the unknown.</p>
        <p>29th MAY 2025 - 30th MAY 2025</p>
        {!isLoggedIn ? (
          <div className="register-button">
            <a
              title="Register"
              href="/RegisterLogin"
              style={{
                backgroundColor: 'transparent',
                background: 'none',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '30px',
                padding: '0.8rem 2rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.2rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                boxShadow: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              Enter !
            </a>
          </div>
        ) : (
          <div className="logout-button">
            <a
              href="#"
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                background: 'none',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '30px',
                padding: '0.8rem 2rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.2rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                boxShadow: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              Log Out
            </a>
          </div>
        )}

        {/* Countdown timer */}
        <div id="countdown">
          <ul>
            <li><div id="days">{days}</div>Days</li>
            <li><div id="hours">{hours}</div>Hours</li>
            <li><div id="minutes">{minutes}</div>Minutes</li>
            <li><div id="seconds">{seconds}</div>Seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Banner;