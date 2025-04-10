import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import About from './components/About'
import Timeline from './components/Timeline'
import Pronites from './components/Pronites'
import Sponsors from './components/Sponsors'
import Footer from './components/Footer'
import GoodieBanner from './components/GoodieBanner'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div className="loader-bg">
          <div className="loader">
            <img src="/assets/preloader.webp" alt="Preloader" />
          </div>
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
          <div id="particles-js"></div>
        </div>
        <Pronites />
        <GoodieBanner />
        <Sponsors />
        <Footer />
      </div>
    </>
  )
}

export default App