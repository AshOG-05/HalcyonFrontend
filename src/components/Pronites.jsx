import { useState, useEffect } from 'react';

function Pronites() {
  const [index, setIndex] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState([false, false, false, false]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const locations = [
    "<h1>ANUV JAIN</h1><p>27th June 2021</p><p>9:00PM-10:30PM</p>",
    "<h1>ANUBHAV SINGH BASSI</h1><p>28th June 2021</p><p>9:30PM-10:30PM</p>",
    "<h1>ABHISHEK UPMANYU</h1><p>29th June 2021</p><p>9:45PM-10:30PM</p>",
    "<h1>ODESZA</h1><p>30th June 2021</p><p>10:00PM-12:00AM</p>",
  ];

  const backgrounds = [
    "/assets/anuvjain_bg.webp",
    "/assets/bassi_bg.webp",
    "/assets/upmanyu_bg.webp",
    "/assets/odesza_bg.webp",
  ];

  const slides = [
    { image: "/assets/anuvjain.webp", alt: "Anuv Jain" },
    { image: "/assets/bassi.webp", alt: "Anubhav Singh Bassi" },
    { image: "/assets/upmanyu.webp", alt: "Abhishek Upmanyu" },
    { image: "/assets/odesza.webp", alt: "Odesza" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("cookie");
    if (token) {
      setIsLoggedIn(true);
      
      // Fetch pronite registration status
      const apiUrl = "https://gentle-thicket-19334.herokuapp.com";
      fetch(`${apiUrl}/user/pronite`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        credentials: "same-origin",
      })
        .then((res) => res.json())
        .then((data) => {
          const newStatus = [...registrationStatus];
          for (let i = 0; i < data.data.length; i++) {
            newStatus[data.data[i].id - 1] = true;
          }
          setRegistrationStatus(newStatus);
        })
        .catch((err) => {
          console.error("Error fetching pronite data:", err);
        });
    }
  }, []);

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const handleRegistration = (proniteIndex) => {
    if (!isLoggedIn) {
      // Show alert and redirect to login
      alert("User not Signed In");
      window.location.href = "/RegisterLogin";
      return;
    }

    const token = localStorage.getItem("cookie");
    const apiUrl = "https://gentle-thicket-19334.herokuapp.com";
    const proniteId = proniteIndex + 1;
    
    // Toggle registration status
    if (!registrationStatus[proniteIndex]) {
      // Register
      fetch(`${apiUrl}/pronites/proniteRegn/${proniteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
            // Check the status code from the response
            if (data.status === 401) {
              window.location.href = "./RegisterLogin/";
            }
          } else {
            alert(data.message);
            const newStatus = [...registrationStatus];
            newStatus[proniteIndex] = true;
            setRegistrationStatus(newStatus);
          }
        });
    } else {
      // Unregister
      fetch(`${apiUrl}/pronites/proniteUnregister/${proniteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            const newStatus = [...registrationStatus];
            newStatus[proniteIndex] = false;
            setRegistrationStatus(newStatus);
          }
        });
    }
  };

  return (
    <div className="pronites" id="pronites_anchor" style={{ backgroundImage: `url(${backgrounds[index]})` }}>
      <div className="pronites-header">
        <h1>
          <span data-aos="fade-down">PRO</span>
          <span data-aos="fade-up">NITES</span>
        </h1>
      </div>
      <div className="pronites-header-mob">
        <h1>PRONITES</h1>
      </div>
      <div className="pronite-box">
        {slides.map((slide, i) => (
          <div 
            key={i} 
            className="pro-content" 
            style={{ display: i === index ? 'block' : 'none' }}
          >
            <img className="slide" alt={slide.alt} src={slide.image || "/placeholder.svg"} />
            <button onClick={() => handleRegistration(i)}>
              <a className={`pro${i+1}`}>
                {registrationStatus[i] ? "Unregister" : "Register"}
              </a>
            </button>
          </div>
        ))}

        <a id="previous" title="prev" className="arrow" onClick={handlePrevious}>&#10094;</a>
        <a id="next" title="next" className="arrow" onClick={handleNext}>&#10095;</a>
        <div id="text-bar">
          <div id="pro-name" dangerouslySetInnerHTML={{ __html: locations[index] }}></div>
        </div>
      </div>
    </div>
  );
}

export default Pronites;