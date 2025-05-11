import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Timeline.css';

function Timeline() {
  const [activeDay, setActiveDay] = useState(1);

  // Day 1 and Day 2 events from the image
  const day1Events = [
    "Inauguration",
    "Face painting",
    "Classical and Folk Dance",
    "Classical Vocal Solo",
    "Creative Writing",
    "BGMI",
    "20Q (Prelims)",
    "Battle of Bands",
    "Western Solo Dance",
    "Duet Dance",
    "Quiz (Prelims)",
    "Street Play",
    "20Q (Finals)",
    "Quiz (Finals)",
    "Collage",
    "Indian Ethnic Show",
    "Choreography"
  ];

  const day2Events = [
    "Mime",
    "Skit",
    "Spell Bee",
    "Ludo King",
    "Jam (Prelims)",
    "Indo western vocal solo",
    "Valorant",
    "Sketching",
    "Duet Singing",
    "Blind fold Texting",
    "Creative Photography",
    "JAM (Finals)",
    "Valedictory Function", 
    "Musical Night"
  ];

  useEffect(() => {
    // Initialize AOS with faster settings
    AOS.init({
      offset: 50,
      duration: 200,
      easing: 'ease',
      once: true,
      mirror: false,
      anchorPlacement: 'top-center',
      disable: 'phone',  // Disable AOS on phones initially
    });

    // Custom function to handle sequential animations on mobile
    const handleMobileAnimations = () => {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Re-enable AOS with faster mobile-specific settings
        AOS.init({
          offset: 30,
          duration: 200,
          easing: 'ease',
          once: true,
          mirror: false,
          anchorPlacement: 'top-center',
          disable: false,
        });

        // Force refresh to apply new settings immediately
        setTimeout(() => {
          AOS.refresh();
        }, 10);
      }
    };

    // Initial call
    handleMobileAnimations();

    // Add event listener for resize
    window.addEventListener('resize', handleMobileAnimations);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleMobileAnimations);
    };
  }, []);

  return (
    <div className="panel timeline" id="timeline_anchor">
      <div className="timeline-header mobile-visible">
        <h1 className="mobile-visible">
          <span className="timeline-title-text mobile-visible">TIMELINE</span>
        </h1>
      </div>

      {/* Day selector tabs */}
      <div className="timeline-tabs" data-aos="fade-up" data-aos-delay="100">
        <button
          className={activeDay === 1 ? 'active' : ''}
          onClick={() => setActiveDay(1)}
        >
          <span className="day-text">Day 1</span>
        </button>
        <button
          className={activeDay === 2 ? 'active' : ''}
          onClick={() => setActiveDay(2)}
        >
          <span className="day-text">Day 2</span>
        </button>
      </div>

      {/* Events Display */}
      <div className="timeline-events-container" data-aos="fade-up" data-aos-delay="30" data-aos-duration="150">
        <div className="timeline-wrapper">
          <div className="timeline-line"></div>

          <div className="timeline-content">
            {activeDay === 1 ? (
              // Day 1 Events
              day1Events.map((event, index) => (
                <div
                  className={`timeline-event ${index % 2 === 0 ? 'left' : 'right'}`}
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={50 + (index * 30)}
                  data-aos-duration="200"
                  data-aos-anchor-placement="top-center"
                >
                  <div className="timeline-event-content">
                    <div className="timeline-event-dot"></div>
                    <h3 className="timeline-event-title">{event}</h3>
                  </div>
                </div>
              ))
            ) : (
              // Day 2 Events
              day2Events.map((event, index) => (
                <div
                  className={`timeline-event ${index % 2 === 0 ? 'left' : 'right'}`}
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={50 + (index * 30)}
                  data-aos-duration="200"
                  data-aos-anchor-placement="top-center"
                >
                  <div className="timeline-event-content">
                    <div className="timeline-event-dot"></div>
                    <h3 className="timeline-event-title">{event}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;