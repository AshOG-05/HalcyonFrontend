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
      title: "DANCE COMPETITION",
      image: "/assets/Dancer.png",
    },
    {
      id: 2,
      title: "MUSIC FESTIVAL",
      image: "/assets/anuvjain.webp",
    },
    {
      id: 3,
      title: "GAMING TOURNAMENT",
      image: "/assets/goodies-space.webp",
    },
    {
      id: 4,
      title: "THEATRE PLAY",
      image: "/assets/gradient.webp",
    },
    {
      id: 5,
      title: "ART EXHIBITION",
      image: "/assets/circular.png",
    },
    {
      id: 6,
      title: "POETRY SLAM",
      image: "/assets/astro-jelly.webp",
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
                  {event.title === "DANCE COMPETITION" && (
                    <a href="/events/dance" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                  {event.title === "MUSIC FESTIVAL" && (
                    <a href="/events/music" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                  {event.title === "GAMING TOURNAMENT" && (
                    <a href="/events/gaming" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                  {event.title === "THEATRE PLAY" && (
                    <a href="/events/theatre" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                  {event.title === "ART EXHIBITION" && (
                    <a href="/events/finearts" className="tilt-card-link">
                      <div className="tilt-card-link-overlay"></div>
                    </a>
                  )}
                  {event.title === "POETRY SLAM" && (
                    <a href="/events/literary" className="tilt-card-link">
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
