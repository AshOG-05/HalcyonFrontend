import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Banner() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("cookie");
    if (token) {
      setIsLoggedIn(true);
    }

    // Countdown Timer
    const festDay = new Date("MAY 29, 2025 11:00:00").getTime();

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
    localStorage.removeItem("cookie");
    window.location.href = "./";
  };

  return (
    <div className="banner panel" id="top">
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
        <h1>HALCYON</h1>
        <h1>2025</h1>
        <p>Step into the unknown.</p>
        <p>29th MAY 2025 - 30th MAY 2025</p>

        {!isLoggedIn ? (
          <div className="register-button">
            <div className="left"></div>
            <a title="Register" href="./RegisterLogin/">Enter !</a>
            <div className="right"></div>
          </div>
        ) : (
          <div className="logout-button" style={{ visibility: 'visible' }}>
            <div className="left"></div>
            <a href="#" onClick={handleLogout}>Log Out</a>
            <div className="right"></div>
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