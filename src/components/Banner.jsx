// Added by Abhishek for testing PR
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';
import { APP_CONFIG } from '../config';
import { logout } from '../services/authService';
import './Banner.css';

function Banner() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Initialize with null to prevent triggering the sidebar toggle on first render
  const [sidebarToggle, setSidebarToggle] = useState(null);

  const toggleSidebar = () => {
    setSidebarToggle(prev => (prev === null ? 1 : prev + 1));
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem(APP_CONFIG.tokenName);
    if (token) {
      setIsLoggedIn(true);
    }

    // Countdown Timer
    const festDay = new Date("MAY 16, 2025 12:00:00").getTime();

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
          /* Global outline removal */
          *:focus {
            outline: none !important;
            box-shadow: none !important;
          }

          /* Specific button styles */
          .banner .register-button a, .banner .logout-button a,
          .banner .register-button a:focus, .banner .logout-button a:focus,
          .banner .register-button a:active, .banner .logout-button a:active,
          .banner .register-button a:-moz-focusring, .banner .logout-button a:-moz-focusring,
          .banner .register-button a::-moz-focus-inner, .banner .logout-button a::-moz-focus-inner {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
            outline: none !important;
            outline-width: 0 !important;
            outline-color: transparent !important;
            -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
            -webkit-focus-ring-color: rgba(0,0,0,0) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
          }

          /* Firefox specific */
          .banner .register-button a::-moz-focus-inner, .banner .logout-button a::-moz-focus-inner {
            border: 0 !important;
          }

          /* Override any browser defaults */
          .banner .register-button a:focus, .banner .logout-button a:focus {
            border-color: rgba(255, 255, 255, 0.8) !important;
            outline: none !important;
            outline-color: transparent !important;
          }

          /* Ensure no orange outline on any state */
          .banner .register-button a,
          .banner .register-button a:hover,
          .banner .register-button a:focus,
          .banner .register-button a:active {
            outline: none !important;
            outline-color: transparent !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            -moz-box-shadow: none !important;
          }

          .banner .register-button a:hover,
          .banner .logout-button a:hover {
            border-color: rgba(255, 255, 255, 0.8) !important;
          }
        `}
      </style>
      <Navbar />
      <MobileNavbar toggleSidebar={toggleSidebar} />
      <Sidebar externalToggle={sidebarToggle} />
      <video src="/assets/background_halcyon.mp4" loop muted autoPlay style={{
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
        <p>Vividhta ka utsav sanskrithi ka samrajya</p>
        <p>16th MAY 2025 - 17th MAY 2025</p>
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
                MozAppearance: 'none',
                outline: 'none',
                outlineWidth: '0',
                outlineColor: 'transparent',
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                WebkitFocusRingColor: 'rgba(0,0,0,0)',
                outlineOffset: '0'
              }}
            >
              Register !
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
                MozAppearance: 'none',
                outline: 'none',
                outlineWidth: '0',
                outlineColor: 'transparent',
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                WebkitFocusRingColor: 'rgba(0,0,0,0)',
                outlineOffset: '0'
              }}
            >
              Log Out
            </a>
          </div>
        )}

        {/* Countdown timer */}
        <div id="countdown" className="responsive-countdown">
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