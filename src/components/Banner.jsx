import { useState, useEffect } from 'react';
import Navbar from './Navbar';

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
    const festDay = new Date("July 27, 2021 11:00:00").getTime();
    
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
      <video src="/assets/background.mp4" loop muted autoPlay></video>
      <div className="overlay"></div>
      <div className="heading">
        <h1>Essence</h1>
        <h1>Essence</h1>
        <p>Step into the unknown.</p>
        <p>27th June 2021 - 30th June 2021</p>

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
            <li><div id="days">{days}</div>days</li>
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