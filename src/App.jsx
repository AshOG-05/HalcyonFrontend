import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import About from './components/About'
import Timeline from './components/Timeline'
import Pronites from './components/Pronites' // Special Guests component (file name kept as Pronites for consistency)
// import Sponsors from './components/Sponsors'
import Footer from './components/Footer'
import ParticlesComponent from './components/ParticlesComponent'
import Explore from './components/Explore'
import ReachUs from './components/ReachUs'
import BrochureDownload from './components/BrochureDownload'

import './components/CommonStyles.css'
import './App.css'

function App() {
  // Initialize loading state based on device type
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const [loading, setLoading] = useState(!isMobile); // Start with loading=false on mobile

  useEffect(() => {
    // Only set up the timer for desktop devices
    if (!isMobile) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000); // Increased from 2500ms to 5000ms for better visibility
      return () => clearTimeout(timer);
    }
    // No timer needed for mobile - already set to false
  }, [isMobile]);

  return (
    <>
      {loading && !isMobile && (
        <div
          style={{
            position: 'fixed',
            zIndex: 99999,
            background: '#000000',
            height: '100vh',
            width: '100vw',
            top: 0,
            left: 0,
            display: 'grid',
            placeItems: 'center' // CSS Grid's simplest centering technique
          }}
        >
          <img
            src="/assets/final LOGO.png"
            alt="Preloader"
            style={{
              height: '25vh',
              objectFit: 'contain',
              animation: 'glow 3s ease-in-out infinite'
            }}
          />
          <style>
            {`
              @keyframes glow {
                0% {
                  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
                }
                50% {
                  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
                }
                100% {
                  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
                }
              }
            `}
          </style>
        </div>
      )}
      <div className="well" id="well">
        <a href="#top" title="Back to top">
          <button id="back-to-top-btn">
            <i className="fas fa-angle-double-up"></i>
          </button>
        </a>
        <Banner />
        <div className="content">
          <About />
          <Timeline />
          {/* <ParticlesComponent /> */}
        </div>
        <Explore />
        <Pronites /> {/* Special Guests component */}
        {/* Sponsors section commented out until sponsors are confirmed */}
        {/* <Sponsors /> */}
        <ReachUs />
        <BrochureDownload />
        <Footer />
      </div>
    </>
  )
}

export default App