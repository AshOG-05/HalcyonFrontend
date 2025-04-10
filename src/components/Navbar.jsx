import { useState, useEffect } from 'react';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cookie");
    
    if (token) {
      setIsLoggedIn(true);
      // Fetch user data from API
      const apiUrl = "https://gentle-thicket-19334.herokuapp.com";
      
      fetch(`${apiUrl}/user/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        credentials: "same-origin",
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data.data[0]);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }

    // Show navbar on scroll
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="nav" style={{ opacity: showNav ? 1 : 0 }}>
      <a title="About" href="#about_anchor">About</a>
      <a title="Timeline" href="#timeline_anchor">Timeline</a>
      <a title="Pronites" href="#pronites_anchor">Pronites</a>
      <a title="Contact" href="#contact_anchor">Contact</a>
      <a title="Sponsors" href="#sponsors_anchor">Sponsors</a>
      {isLoggedIn && userData && (
        <a title="Profile" href="./profile/" className="profile show">
          <i className="fas fa-user-astronaut"></i> {userData.name}
        </a>
      )}
    </nav>
  );
}

export default Navbar;