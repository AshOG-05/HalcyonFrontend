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
      offset: 300,
      duration: 1500,
      once: true,
    });
  }, []);

  return (
    <div className="panel timeline" id="timeline_anchor">
      <div className="timeline-header">
        <h1 data-aos="fade-up" data-aos-duration="800">
          <span className="timeline-title-text">TIMELINE</span>
        </h1>
      </div>

      {/* Day selector tabs */}
      <div className="timeline-tabs" data-aos="fade-up" data-aos-delay="200">
        <button
          className={activeDay === 1 ? 'active' : ''}
          onClick={() => setActiveDay(1)}
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <span className="day-number">01</span>
          <span className="day-text">Day 1</span>
        </button>
        <button
          className={activeDay === 2 ? 'active' : ''}
          onClick={() => setActiveDay(2)}
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <span className="day-number">02</span>
          <span className="day-text">Day 2</span>
        </button>
      </div>

      {/* Timeline visualization */}
      <div className="timeline-progress" data-aos="fade-up" data-aos-delay="500">
        <div className="timeline-track" data-aos="width" data-aos-delay="600">
          <div
            className="timeline-progress-bar"
            style={{
              width: `${(activeDay / 2) * 100}%`,
            }}
          ></div>

          {/* Day nodes */}
          {[1, 2].map((day, index) => {
            const leftPosition = ((index + 1) / 3) * 100;
            return (
              <React.Fragment key={day}>
                {/* Node */}
                <div
                  className={`timeline-node ${activeDay >= day ? 'active' : ''}`}
                  onClick={() => setActiveDay(day)}
                  style={{
                    left: `${leftPosition}%`,
                  }}
                  data-aos="zoom-in"
                  data-aos-delay={700 + (day * 100)}
                >
                  <span>{day}</span>
                </div>

                {/* Label */}
                <div
                  className="timeline-node-label"
                  style={{
                    left: `${leftPosition}%`,
                    color: activeDay === day ? '#ff9800' : '#fff',
                    fontWeight: activeDay === day ? 'bold' : 'normal',
                  }}
                  data-aos="fade-up"
                  data-aos-delay={800 + (day * 100)}
                >
                  Day {day}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Events Display */}
      <div className="timeline-events-container" data-aos="fade-up">
        <div className="timeline-split-container">
          {/* Left Column */}
          <div className="timeline-split-column">
            <div className="timeline-events-list">
              {activeDay === 1 ?
                // For Day 1, show odd-indexed events (0, 2, 4, etc.)
                day1Events.filter((_, index) => index % 2 === 0).map((event, index) => (
                  <div
                    className="timeline-event-item"
                    key={index}
                    style={{
                      marginTop: index === 0 ? '0' : '2.5rem',
                      marginBottom: '2.5rem'
                    }}
                    data-aos="fade-right"
                    data-aos-delay={1000 + (index * 100)}
                  >
                    {event}
                  </div>
                ))
                :
                // For Day 2, show odd-indexed events
                day2Events.filter((_, index) => index % 2 === 0).map((event, index) => (
                  <div
                    className="timeline-event-item"
                    key={index}
                    style={{
                      marginTop: index === 0 ? '0' : '2.5rem',
                      marginBottom: '2.5rem'
                    }}
                    data-aos="fade-right"
                    data-aos-delay={1000 + (index * 100)}
                  >
                    {event}
                  </div>
                ))
              }
            </div>
          </div>

          {/* Center Divider */}
          <div className="timeline-divider"></div>

          {/* Right Column */}
          <div className="timeline-split-column">
            <div className="timeline-events-list">
              {activeDay === 1 ?
                // For Day 1, show even-indexed events (1, 3, 5, etc.)
                day1Events.filter((_, index) => index % 2 === 1).map((event, index) => (
                  <div
                    className="timeline-event-item"
                    key={index}
                    style={{
                      marginTop: index === 0 ? '1.25rem' : '2.5rem',
                      marginBottom: '2.5rem'
                    }}
                    data-aos="fade-left"
                    data-aos-delay={1100 + (index * 100)}
                  >
                    {event}
                  </div>
                ))
                :
                // For Day 2, show even-indexed events
                day2Events.filter((_, index) => index % 2 === 1).map((event, index) => (
                  <div
                    className="timeline-event-item"
                    key={index}
                    style={{
                      marginTop: index === 0 ? '1.25rem' : '2.5rem',
                      marginBottom: '2.5rem'
                    }}
                    data-aos="fade-left"
                    data-aos-delay={1100 + (index * 100)}
                  >
                    {event}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;