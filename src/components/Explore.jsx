import React from 'react';
import InteractiveExplore from './InteractiveExplore';
import TiltCards from './TiltCards';
import './InteractiveExplore.css';
import './TiltCards.css';
import './Explore.css';

function Explore() {
  return (
    <div className="explore comic-explore-section" id="explore_anchor">
      
      {/* 🌟 Background Stars (UNCHANGED) */}
      <div className="stars-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: 'white',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
              animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* 🎯 Main Content */}
      <div className="explore-container comic-explore-container">

        {/* ⚡ Your Existing Components (UNCHANGED) */}
        <InteractiveExplore />
        <TiltCards />
        
      </div>
    </div>
  );
}

export default Explore;