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
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);
  const [isExtraSmallMobile, setIsExtraSmallMobile] = useState(window.innerWidth <= 375);

  // Minimum swipe distance (in px) to trigger sidebar close - adjusted for mobile
  const minSwipeDistance = isMobile ? 30 : 50;

  // Calculate optimal sidebar width based on screen size
  const getSidebarWidth = () => {
    if (!isMobile) return '400px';

    if (screenWidth <= 320) return '75%';      // Very small phones (iPhone SE, etc.)
    if (screenWidth <= 375) return '70%';      // Small phones (iPhone 12 mini, etc.)
    if (screenWidth <= 414) return '65%';      // Medium phones (iPhone 12, etc.)
    if (screenWidth <= 480) return '60%';      // Large phones
    if (screenWidth <= 640) return '55%';      // Small tablets in portrait
    return '50%';                              // Larger screens in mobile range
  };

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

    // Prevent scrolling when swiping on sidebar
    if (sidebarOpen && isMobile) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    // Calculate distance of swipe
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = touchEnd - touchStart > minSwipeDistance;

    // If it's a left swipe and sidebar is open, close it
    if (isLeftSwipe && sidebarOpen) {
      setSidebarOpen(false);
    }

    // If it's a right swipe and sidebar is closed, open it (only on mobile)
    if (isRightSwipe && !sidebarOpen && isMobile && touchStart < 50) {
      setSidebarOpen(true);
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

  // Add resize event listener to update responsive states
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      setIsSmallMobile(width <= 480);
      setIsExtraSmallMobile(width <= 375);
      setScreenWidth(width);

      // Close sidebar when switching from mobile to desktop
      if (width > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

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
            background: isMobile ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
            backdropFilter: isMobile ? 'blur(5px)' : 'blur(3px)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? 'auto' : 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
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
          style={isMobile ? {
            width: getSidebarWidth(),
            maxWidth: getSidebarWidth(),
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          } : {}}>
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
