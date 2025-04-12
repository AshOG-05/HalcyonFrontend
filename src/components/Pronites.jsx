import { useState, useEffect, useRef } from 'react';

function Pronites() {
  const [index, setIndex] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState([false, false, false, false]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [backgroundTransitioning, setBackgroundTransitioning] = useState(false);
  const [currentBackground, setCurrentBackground] = useState('');
  const [nextBackground, setNextBackground] = useState('');
  const slideRef = useRef(null);
  const backgroundRef = useRef(null);
  const nextBackgroundRef = useRef(null);

  const proniteData = [
    {
      id: 1,
      name: "ANUV JAIN",
      date: "27th June 2023",
      time: "9:00PM-10:30PM",
      image: "/assets/anuvjain.webp",
      alt: "Anuv Jain",
      gradient: "url('/assets/anuvjain_bg.webp')",
      description: "Experience the soulful melodies of Anuv Jain as he performs his hit songs live on stage. Known for his heartfelt lyrics and captivating voice, this is a performance you won't want to miss.",
      venue: "Main Stage",
      icon: "fas fa-music"
    },
    {
      id: 2,
      name: "ANUBHAV SINGH BASSI",
      date: "28th June 2023",
      time: "9:30PM-10:30PM",
      image: "/assets/bassi.webp",
      alt: "Anubhav Singh Bassi",
      gradient: "url('/assets/bassi_bg.webp')",
      description: "Get ready for a night of laughter with stand-up comedian Anubhav Singh Bassi. His relatable stories and impeccable timing will have you laughing throughout the show.",
      venue: "Auditorium",
      icon: "fas fa-laugh"
    },
    {
      id: 3,
      name: "ABHISHEK UPMANYU",
      date: "29th June 2023",
      time: "9:45PM-10:30PM",
      image: "/assets/upmanyu.webp",
      alt: "Abhishek Upmanyu",
      gradient: "url('/assets/upmanyu_bg.webp')",
      description: "Join us for an evening of comedy with Abhishek Upmanyu. His observational humor and witty commentary on everyday life will leave you in splits.",
      venue: "Auditorium",
      icon: "fas fa-microphone-alt"
    },
    {
      id: 4,
      name: "ODESZA",
      date: "30th June 2023",
      time: "10:00PM-12:00AM",
      image: "/assets/odesza.webp",
      alt: "Odesza",
      gradient: "url('/assets/odesza_bg.webp')",
      description: "Experience the electronic music duo Odesza as they create an immersive audiovisual experience. Their unique blend of electronic sounds and live instruments creates an unforgettable performance.",
      venue: "Main Stage",
      icon: "fas fa-headphones-alt"
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("cookie");
    if (token) {
      setIsLoggedIn(true);
    }

    // Initialize backgrounds
    setCurrentBackground(proniteData[0].gradient);
    setNextBackground(proniteData[0].gradient);

    // Add keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Prepare the next background
    const nextIndex = (index + 1) % proniteData.length;
    setNextBackground(proniteData[nextIndex].gradient);
    setBackgroundTransitioning(true);

    if (slideRef.current) {
      slideRef.current.classList.add('slide-out-left');

      setTimeout(() => {
        setIndex(nextIndex);
        if (slideRef.current) {
          slideRef.current.classList.remove('slide-out-left');
          slideRef.current.classList.add('slide-in-right');

          // After the slide transition completes, update the current background
          setTimeout(() => {
            if (slideRef.current) {
              slideRef.current.classList.remove('slide-in-right');
              setIsAnimating(false);
              setCurrentBackground(proniteData[nextIndex].gradient);
              setBackgroundTransitioning(false);
            }
          }, 500);
        }
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Prepare the next background
    const prevIndex = (index - 1 + proniteData.length) % proniteData.length;
    setNextBackground(proniteData[prevIndex].gradient);
    setBackgroundTransitioning(true);

    if (slideRef.current) {
      slideRef.current.classList.add('slide-out-right');

      setTimeout(() => {
        setIndex(prevIndex);
        if (slideRef.current) {
          slideRef.current.classList.remove('slide-out-right');
          slideRef.current.classList.add('slide-in-left');

          // After the slide transition completes, update the current background
          setTimeout(() => {
            if (slideRef.current) {
              slideRef.current.classList.remove('slide-in-left');
              setIsAnimating(false);
              setCurrentBackground(proniteData[prevIndex].gradient);
              setBackgroundTransitioning(false);
            }
          }, 500);
        }
      }, 500);
    }
  };

  const handleRegistration = (proniteIndex) => {
    if (!isLoggedIn) {
      // Show alert for non-logged in users
      const confirmLogin = window.confirm("You need to be logged in to register for events. Would you like to log in now?");
      if (confirmLogin) {
        // Redirect to login page would go here
        console.log("Redirecting to login page...");
      }
      return;
    }

    // Toggle registration status locally (no backend call)
    const newStatus = [...registrationStatus];
    newStatus[proniteIndex] = !newStatus[proniteIndex];
    setRegistrationStatus(newStatus);

    // Show success message with more details
    const currentPronite = proniteData[proniteIndex];
    const message = newStatus[proniteIndex]
      ? `You have successfully registered for ${currentPronite.name} on ${currentPronite.date}!`
      : `You have unregistered from ${currentPronite.name}.`;

    // Use a more user-friendly notification instead of alert
    const notification = document.createElement('div');
    notification.className = 'pronite-notification';
    notification.innerHTML = `
      <div class="notification-content ${newStatus[proniteIndex] ? 'success' : 'warning'}">
        <i class="${newStatus[proniteIndex] ? 'fas fa-check-circle' : 'fas fa-info-circle'}"></i>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    }, 100);
  };

  const handleDotClick = (i) => {
    if (i === index || isAnimating) return;

    setIsAnimating(true);

    if (slideRef.current) {
      const direction = i > index ? 'left' : 'right';
      slideRef.current.classList.add(`slide-out-${direction}`);

      setTimeout(() => {
        setIndex(i);
        if (slideRef.current) {
          slideRef.current.classList.remove(`slide-out-${direction}`);
          slideRef.current.classList.add(`slide-in-${direction === 'left' ? 'right' : 'left'}`);

          setTimeout(() => {
            if (slideRef.current) {
              slideRef.current.classList.remove(`slide-in-${direction === 'left' ? 'right' : 'left'}`);
              setIsAnimating(false);
            }
          }, 500);
        }
      }, 500);
    }
  };

  const currentPronite = proniteData[index];

  return (
    <div className="pronites" id="pronites_anchor">
      <div
        className="pronite-background current"
        ref={backgroundRef}
        style={{
          backgroundImage: currentBackground,
          opacity: backgroundTransitioning ? 0 : 1
        }}
      ></div>
      <div
        className="pronite-background next"
        ref={nextBackgroundRef}
        style={{
          backgroundImage: nextBackground,
          opacity: backgroundTransitioning ? 1 : 0
        }}
      ></div>
      <div className="pronites-header">
        <h1>
          <span data-aos="fade-down">PRO</span>
          <span data-aos="fade-up">NITES</span>
        </h1>
      </div>
      <div className="pronites-header-mob">
        <h1>PRONITES</h1>
      </div>

      <div className="pronite-container">
        <div className="pronite-navigation">
          <button
            className="pronite-nav-btn prev"
            onClick={handlePrevious}
            aria-label="Previous pronite"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="pronite-content" ref={slideRef} style={{ opacity: isAnimating ? 0.7 : 1, transition: 'opacity 0.5s ease' }}>
            <div className="pronite-card">
              <div className="pronite-image-container">
                <div className="pronite-image-overlay">
                  <i className={currentPronite.icon}></i>
                </div>
                <img
                  src={currentPronite.image}
                  alt={currentPronite.alt}
                  className="pronite-image"
                />
              </div>

              <div className="pronite-details">
                <h2 className="pronite-name">{currentPronite.name}</h2>

                <div className="pronite-info">
                  <div className="pronite-info-item">
                    <i className="fas fa-calendar-day"></i>
                    <span>{currentPronite.date}</span>
                  </div>

                  <div className="pronite-info-item">
                    <i className="fas fa-clock"></i>
                    <span>{currentPronite.time}</span>
                  </div>

                  <div className="pronite-info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{currentPronite.venue}</span>
                  </div>
                </div>

                <p className="pronite-description">{currentPronite.description}</p>

                <button
                  className={`pronite-register-btn ${registrationStatus[index] ? 'registered' : ''}`}
                  onClick={() => handleRegistration(index)}
                >
                  {registrationStatus[index] ? (
                    <>
                      <i className="fas fa-check-circle"></i>
                      <span>Registered</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-ticket-alt"></i>
                      <span>Register Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            className="pronite-nav-btn next"
            onClick={handleNext}
            aria-label="Next pronite"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="pronite-indicators">
          {proniteData.map((_, i) => (
            <button
              key={i}
              className={`pronite-dot ${i === index ? 'active' : ''}`}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to pronite ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pronites;