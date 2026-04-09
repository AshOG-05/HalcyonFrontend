import React from 'react';
import './Marquee.css';

function Marquee() {
  // Array of event names or highlights to display in the marquee
  const items = [
    "Music Competitions",
    "Dance Performances",
    "Technical Workshops",
    "Gaming Tournaments",
    "Art Exhibitions",
    "Cultural Showcases",
    "Literary Events",
    "Fashion Show",
    "Talent Hunt",
    "DJ Night"
  ];

  return (
    <div className="marquee-container">
      <div className="marquee-title">
        <h2>Event Highlights</h2>
      </div>
      <div className="marquee-wrapper">
        <div className="marquee-content">
          {/* Duplicate the items to create a seamless loop */}
          {[...items, ...items].map((item, index) => (
            <div key={index} className="marquee-item">
              <span>{item}</span>
              <div className="marquee-separator">★</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
