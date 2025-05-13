import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../services/authService';
import './Sidebar.css';

function Sidebar({ externalToggle }) {
  // Initialize sidebar as explicitly closed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Minimum swipe distance (in px) to trigger sidebar close
  const minSwipeDistance = 50;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    // Calculate distance of swipe
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

    // If it's a left swipe and sidebar is open, close it
    if (isLeftSwipe && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Add touch event listeners to sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('touchstart', handleTouchStart);
      sidebar.addEventListener('touchmove', handleTouchMove);
      sidebar.addEventListener('touchend', handleTouchEnd);

      return () => {
        sidebar.removeEventListener('touchstart', handleTouchStart);
        sidebar.removeEventListener('touchmove', handleTouchMove);
        sidebar.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [sidebarOpen, touchStart, touchEnd, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Add resize event listener to update isMobile state and screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setScreenWidth(width);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Ensure sidebar is closed on initial render
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  // Handle external toggle from MobileNavbar
  useEffect(() => {
    // Only toggle if externalToggle is not null and not undefined
    if (externalToggle !== null && externalToggle !== undefined) {
      setSidebarOpen(prev => !prev);
    }
  }, [externalToggle]);



  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? 'auto' : 'none'
          }}
        />
      )}
      <div className="sidebar-container">
        <input
          type="checkbox"
          id="check"
          checked={sidebarOpen}
          onChange={toggleSidebar}
        />
        <label htmlFor="check" className={isMobile ? "mobile-hidden" : ""} style={{ background: 'none', boxShadow: 'none' }}>
          <i className="fas fa-bars" id="btn" style={{ background: 'none', boxShadow: 'none' }}></i>
        </label>
        <div
          className="sidebar"
          ref={sidebarRef}
          style={isMobile ?
            screenWidth <= 375 ? { width: '50%', maxWidth: '50%' } :
              screenWidth <= 480 ? { width: '55%', maxWidth: '55%' } :
                { width: '60%', maxWidth: '60%' }
            : {}}>
          <div className="sidebar-header">
            <header style={{ border: 'none', borderBottom: 'none', borderTop: 'none', boxShadow: 'none' }}>
              Explore
              <span className="desktop-only-space" style={{ display: 'inline-block', width: '10px' }}></span>
            </header>
            <button
              className="close-sidebar-btn"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="sidebar-content">
            <a title="Homepage" href="#top" className="active" onClick={closeSidebar}>
              <i className="fas fa-rocket"></i>
              <span>Homepage</span>
            </a>
            <a title="About" href="#about_anchor" onClick={closeSidebar}>
              <i className="fas fa-info-circle"></i>
              <span>About</span>
            </a>
            <a title="Timeline" href="#timeline_anchor" onClick={closeSidebar}>
              <i className="fas fa-calendar-alt"></i>
              <span>Timeline</span>
            </a>
            <a title="Events" href="#explore_anchor" onClick={closeSidebar}>
              <i className="fas fa-compass"></i>
              <span>Events</span>
            </a>
            <a title="Pronites" href="#special_guests" onClick={closeSidebar}>
              <i className="fas fa-star"></i>
              <span>Pronites</span>
            </a>
            <a title="Contact" href="#contact_anchor" onClick={closeSidebar}>
              <i className="fas fa-envelope"></i>
              <span>Contact</span>
            </a>
            {isLoggedIn() ? (
              <Link to="/profile" className="in" onClick={closeSidebar}>
                <i className="fas fa-user-astronaut"></i>
                <span>My Profile</span>
              </Link>
            ) : (
              <Link to="/RegisterLogin" className="in" onClick={closeSidebar}>
                <i className="fas fa-user"></i>
                <span>Sign-in</span>
              </Link>
            )}

            <a title="How to Reach Us" href="#reach_us" onClick={closeSidebar}>
              <i className="fas fa-question"></i>
              <span>FAQ's</span>
            </a>

          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
