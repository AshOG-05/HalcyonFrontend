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
        window.VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
          max: 15,
          speed: 2000,
          glare: true,
          "max-glare": 0.3,
        });
      }
    };

    return () => {
      // Clean up script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const events = [
    {
      id: 1,
      title: "MUSIC NIGHT",
      image: "/assets/anuvjain.webp",
    },
    {
      id: 2,
      title: "DANCE BATTLE",
      image: "/assets/Dancer.png",
    },
    {
      id: 3,
      title: "TECH EXPO",
      image: "/assets/astro-jelly.webp",
    },
    {
      id: 4,
      title: "ART GALLERY",
      image: "/assets/circular.png",
    },
  ];

  return (
    <div className="tilt-cards-container">
      <h1 className="tilt-cards-title">Featured Events</h1>

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
