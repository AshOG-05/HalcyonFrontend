import { useState, useRef, useEffect } from 'react';
import './Sidebar.css';

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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
        <label htmlFor="check" style={{ background: 'none', boxShadow: 'none' }}>
          <i className="fas fa-bars" id="btn" style={{ background: 'none', boxShadow: 'none' }}></i>
        </label>
        <div className="sidebar" ref={sidebarRef}>
          <div className="sidebar-header">
            <header>Explore</header>
            <button
              className="close-sidebar-btn"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
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
          <a title="Explore" href="#explore_anchor" onClick={closeSidebar}>
            <i className="fas fa-compass"></i>
            <span>Explore</span>
          </a>
          <a title="Pronites" href="#pronites_anchor" onClick={closeSidebar}>
            <i className="fas fa-music"></i>
            <span>Pronites</span>
          </a>
          <a title="Sponsors" href="#sponsors_anchor" onClick={closeSidebar}>
            <i className="fas fa-handshake"></i>
            <span>Sponsors</span>
          </a>
          <a title="Contact" href="#contact_anchor" onClick={closeSidebar}>
            <i className="fas fa-envelope"></i>
            <span>Contact</span>
          </a>
          <a title="Sign-in" href="./RegisterLogin/" className="in" onClick={closeSidebar}>
            <i className="fas fa-user"></i>
            <span>Sign-in</span>
          </a>

          <a title="FAQ" href="./faqpage" onClick={closeSidebar}>
            <i className="fas fa-question"></i>
            <span>FAQ's</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
