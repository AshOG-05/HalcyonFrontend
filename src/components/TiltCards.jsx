import React, { useEffect } from "react";
import "./TiltCards.css";

function TiltCards() {
  useEffect(() => {
    // Load vanilla-tilt.js library
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js";
    script.async = true;
    document.body.appendChild(script);

    // Initialize tilt effect after script loads
    script.onload = () => {
      if (window.VanillaTilt) {
        // Apply tilt effect on all devices with adjusted settings for mobile
        const isMobile = window.innerWidth <= 768;

        window.VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
          max: isMobile ? 10 : 15,
          speed: isMobile ? 1000 : 2000,
          glare: true,
          "max-glare": isMobile ? 0.2 : 0.3,
          scale: isMobile ? 1.05 : 1.1,
        });
      }
    };

    // Handle window resize for responsive behavior
    const handleResize = () => {
      if (window.VanillaTilt) {
        // Destroy and reinitialize tilt effect with appropriate settings
        window.VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
          max: window.innerWidth <= 768 ? 10 : 15,
          speed: window.innerWidth <= 768 ? 1000 : 2000,
          glare: true,
          "max-glare": window.innerWidth <= 768 ? 0.2 : 0.3,
          scale: window.innerWidth <= 768 ? 1.05 : 1.1,
          reset: true,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up script and event listeners when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const events = [
    {
      id: 1,
      title: "DJ NIGHT",
      image: "/assets/anuvjain.webp",
    },
    {
      id: 2,
      title: "CHOREOGRAPHY",
      image: "/assets/Dancer.png",
    },
    {
      id: 3,
      title: "ETHNIC SHOW",
      image: "/assets/gradient.webp",
    },
  ];

  return (
    <div className="tilt-cards-container">
      <h1 className="tilt-cards-title">Mega Events</h1>

      <div className="tilt-cards-grid">
        {events.map((event) => (
          <div key={event.id} data-tilt className="tilt-card-wrapper">
            <div className="tilt-card-animation">
              <div className="tilt-card-outer">
                <div className="tilt-card-inner">
                  <span className="tilt-card-label">{event.title}</span>
                  <div
                    className="tilt-card-image"
                    style={{ backgroundImage: `url(${event.image})` }}
                  ></div>
                  {event.title === "DJ NIGHT" && (
                    <a href="/events/music" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                  {event.title === "CHOREOGRAPHY" && (
                    <a href="/events/dance" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                  {event.title === "ETHNIC SHOW" && (
                    <a href="/events/dance" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TiltCards;
