// Added by Abhishek for testing PR
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';
import { APP_CONFIG } from '../config';
import { logout } from '../services/authService';
import './Banner.css';

const COUNTDOWN_COLORS = [
  { bg: '#FF1744', label: '#FFEB3B', border: '#000' },
  { bg: '#00B0FF', label: '#000000', border: '#000' },
  { bg: '#FFEB3B', label: '#000000', border: '#000' },
  { bg: '#9C27B0', label: '#ffffff', border: '#000' },
];

function Banner() {
  const [days,    setDays]    = useState(0);
  const [hours,   setHours]   = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarToggle, setSidebarToggle] = useState(null);

  const toggleSidebar = () => {
    const newValue = sidebarToggle === null ? 1 : sidebarToggle + 1;
    console.log('Banner - toggleSidebar called. Previous value:', sidebarToggle, 'New value:', newValue);
    setSidebarToggle(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem(APP_CONFIG.tokenName);
    if (token) setIsLoggedIn(true);

    const festDay = new Date("APRIL 17, 2026 12:00:00").getTime();
    const interval = setInterval(() => {
      const now      = new Date().getTime();
      const distance = festDay - now;
      setDays(   Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))));
      setHours(  Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))));
      setMinutes(Math.max(0, Math.floor((distance % (1000 * 60 * 60))      / (1000 * 60))));
      setSeconds(Math.max(0, Math.floor((distance % (1000 * 60))           / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const countdownItems = [
    { value: days,    label: 'DAYS'    },
    { value: hours,   label: 'HOURS'   },
    { value: minutes, label: 'MINUTES' },
    { value: seconds, label: 'SECONDS' },
  ];

  return (
    <div className="banner panel comic-banner-wrapper" id="top">

      {/* ── Static background image ── */}
      <img
        src="/assets/comic_background_9.jpg"
        alt="Halcyon comic background"
        className="comic-banner-video"
      />

      {/* ── Dark overlay ── */}
      <div className="overlay comic-banner-overlay" />

      {/* ── Halftone dot layer ── */}
      <div className="comic-banner-halftone" />

      {/* ── Corner sound-effects ── */}
      <span className="comic-sfx comic-sfx-tl">POW!</span>
      <span className="comic-sfx comic-sfx-tr">BAM!</span>
      <span className="comic-sfx comic-sfx-bl">ZAP!</span>
      <span className="comic-sfx comic-sfx-br">BOOM!</span>

      {/* ── Navbars ── */}
      <Navbar />
      <MobileNavbar toggleSidebar={toggleSidebar} />
      <Sidebar externalToggle={sidebarToggle} />

      {/* ── Hero content ── */}
      <div className="heading comic-banner-heading">

        {/* Title block */}
        <div className="comic-banner-title-block">
          <h1 className="samarkan comic-banner-title" style={{ fontFamily: 'CustomFont', fontSize: 'clamp(6rem, 16vw, 13rem)' }}>
            HALCYON
          </h1>
          <h1 className="samarkan comic-banner-year"  style={{ fontFamily: 'CustomFont', fontSize: 'clamp(3.2rem, 9vw, 7rem)' }}>
            2026
          </h1>
        </div>

        {/* Subtitle */}
        <p className="comic-banner-tagline">Celebrating the echoes of comicore</p>

        {/* Dates badge */}
        <div className="comic-banner-dates">
          <span className="comic-dates-badge">
             17th April 2026 — 18th April 2026
          </span>
        </div>

        {/* Register / Logout button */}
        {!isLoggedIn ? (
          <div className="comic-banner-btn-wrap">
            <a href="/RegisterLogin" title="Register" className="comic-banner-cta">
              REGISTER NOW!
              <span className="comic-cta-arrow">→</span>
            </a>
          </div>
        ) : (
          <div className="comic-banner-btn-wrap">
            <a href="#" onClick={handleLogout} className="comic-banner-cta comic-banner-cta--logout">
              LOG OUT
              <span className="comic-cta-arrow">↩</span>
            </a>
          </div>
        )}

        {/* ── Countdown ── */}
        <div className="comic-countdown-wrapper">
          
          <div className="comic-countdown-grid">
            {countdownItems.map((item, i) => {
              const color = COUNTDOWN_COLORS[i];
              return (
                <div
                  key={item.label}
                  className="comic-countdown-cell"
                  style={{
                    '--cell-bg':     color.bg,
                    '--cell-label':  color.label,
                    '--cell-border': color.border,
                  }}
                >
                  <div className="comic-countdown-value">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="comic-countdown-unit">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>{/* end .heading */}
    </div>
  );
}

export default Banner;