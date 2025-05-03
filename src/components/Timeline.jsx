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
    "NFS",
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
    "Valedictory Function Musical Night"
  ];

  useEffect(() => {
    AOS.init({
      offset: 150,
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });
  }, []);

  return (
    <div className="panel timeline" id="timeline_anchor">
      <div className="timeline-header">
        <h1 data-aos="fade-up" data-aos-duration="400">
          <span className="timeline-title-text">TIMELINE</span>
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
      <div className="timeline-events-container" data-aos="fade-up" data-aos-delay="150">
        <div className="timeline-wrapper">
          <div className="timeline-line"></div>

          <div className="timeline-content">
            {activeDay === 1 ? (
              // Day 1 Events
              day1Events.map((event, index) => (
                <div
                  className={`timeline-event ${index % 2 === 0 ? 'left' : 'right'}`}
                  key={index}
                  data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                  data-aos-delay={50 + (index * 30)}
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
                  data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                  data-aos-delay={50 + (index * 30)}
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