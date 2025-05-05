import { useState } from 'react';
import './MobileNavbar.css';

function MobileNavbar({ toggleSidebar }) {
  return (
    <div className="mobile-navbar">
      {/* Completely transparent background overlay for touch targets */}
      <div className="mobile-navbar-bg"></div>

      <div className="mobile-navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      <div className="mobile-navbar-right">
        <div className="logos-container">
          <div className="logo-container sit-logo-container">
            <img
              src="/assets/sit_logo-removebg-preview.png"
              alt="SIT Logo"
              className="mobile-navbar-logo sit-logo"
            />
          </div>
          <div className="logo-container halcyon-logo-container">
            <img
              src="/assets/final LOGO.png"
              alt="Halcyon 2025 Logo"
              className="mobile-navbar-logo halcyon-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNavbar;
