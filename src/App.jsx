import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import About from './components/About'
import Timeline from './components/Timeline'
import Pronites from './components/Pronites'
import Footer from './components/Footer'
import ParticlesComponent from './components/ParticlesComponent'
import Explore from './components/Explore'
import ReachUs from './components/ReachUs'
import BrochureDownload from './components/BrochureDownload'

import './components/CommonStyles.css'
import './App.css'

function App() {
  // Show loader on all devices for consistent styling
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for at least 1.5 seconds on mobile, 2.5 seconds on desktop
    const loaderDuration = isMobile ? 1500 : 2500;
    const timer = setTimeout(() => {
      setLoading(false);
    }, loaderDuration);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <>
      {loading && (
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
              height: '32vh',
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
        <span className="comic-page-callout comic-page-callout-pow" aria-hidden="true" />
        <span className="comic-page-callout comic-page-callout-wow" aria-hidden="true" />
        <span className="comic-page-callout comic-page-callout-boom" aria-hidden="true" />
        <span className="comic-page-callout comic-page-callout-poof" aria-hidden="true" />
        <span className="comic-page-callout comic-page-callout-yeah" aria-hidden="true" />
        <a href="#top" title="Back to top">
          <button id="back-to-top-btn">
            <i className="fas fa-angle-double-up"></i>
          </button>
        </a>
        <Banner />
        <div className="content">
          <About />
          <div className="simple-black-break" aria-hidden="true" />
          <Timeline />
          <div className="simple-black-break" aria-hidden="true" />
          {/* <ParticlesComponent /> */}
        </div>
        <Explore />
        {/* <Pronites /> Special Guests component */}
        {/* Sponsors section commented out until sponsors are confirmed */}
        {/* <Sponsors /> */}
        <ReachUs />
        <BrochureDownload />
        {/*testing*/}
        <Footer />
      </div>
    </>
  )
}

export default App