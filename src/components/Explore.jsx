import React from 'react';
import InteractiveExplore from './InteractiveExplore';
import TiltCards from './TiltCards';
import './InteractiveExplore.css';
import './TiltCards.css';
import './Explore.css';

function Explore() {
  return (
    <div className="explore panel" id="explore_anchor">
      <div className="stars-container" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
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
      <div className="explore-container" style={{ position: 'relative', zIndex: 1 }}>
        <InteractiveExplore />
        <TiltCards />
      </div>
    </div>
  );
}

export default Explore;
