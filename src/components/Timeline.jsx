import { useEffect, useState } from 'react';
import TimelineCard from './TimelineCard';
import TimelineCardMobile from './TimelineCardMobile';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Timeline.css';

function Timeline() {
  const [activeDay, setActiveDay] = useState(1);
  // Day 1 events
  const day1Events = [
    { title: "Fashion Show", time: "1:00PM - 3:00PM", link: "./EventPages/fashion_show.html" },
    { title: "Mr and Ms Fest", time: "3:00PM - 6:00PM", link: "./EventPages/mrandmsfest.html" },
    { title: "Treasure Hunt", time: "7:00PM-12:30AM", link: "./EventPages/treasurehunt.html" }
  ];

  // Day 2 events
  const day2Events = [
    { title: "Naatak", time: "11:00AM-12:30PM", link: "./EventPages/nataak.html" },
    { title: "Code It", time: "1:00PM - 3:00PM", link: "./EventPages/codeit.html" },
    { title: "COD Qualifiers", time: "3:00PM - 6:00PM", link: "./EventPages/cod.html" },
    { title: "Chess Qualifiers", time: "7:00PM-12:30AM", link: "./EventPages/chess.html" }
  ];



  useEffect(() => {
    AOS.init({
      offset: 300,
      duration: 1500,
      once: true, // Prevents animation on scroll down only
    });
  }, []);

  return (
    <div className="panel timeline" id="timeline_anchor">
      <div className="timeline-header">
        <h1>
          <span data-aos="fade-right">TIME</span>
          <span data-aos="fade-left">LINE</span>
        </h1>
      </div>
      <div className="timeline-header-mob">
        <h1>TIMELINE</h1>
      </div>

      {/* Day selector tabs */}
      <div className="timeline-tabs">
        <button
          className={activeDay === 1 ? 'active' : ''}
          onClick={() => setActiveDay(1)}
        >
          <span className="day-number">01</span>
          <span className="day-text">DAY 1</span>
        </button>
        <button
          className={activeDay === 2 ? 'active' : ''}
          onClick={() => setActiveDay(2)}
        >
          <span className="day-number">02</span>
          <span className="day-text">DAY 2</span>
        </button>

      </div>

      {/* Timeline visualization */}
      <div className="timeline-progress" style={{ margin: '3rem 0 5rem' }}>
        <div className="timeline-track" style={{ position: 'relative', width: '80%', maxWidth: '600px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', margin: '0 auto' }}>
          <div
            className="timeline-progress-bar"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${activeDay === 1 ? '50%' : '100%'}`,
              backgroundColor: '#ff9800',
              borderRadius: '2px',
              transition: 'width 0.5s ease'
            }}
          ></div>

          {/* Day 1 node */}
          <div
            className={`timeline-node ${activeDay >= 1 ? 'active' : ''}`}
            onClick={() => setActiveDay(1)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '25%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: activeDay >= 1 ? '#ff9800' : 'rgba(255, 255, 255, 0.3)',
              border: '2px solid #ff9800',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>1</span>
          </div>

          {/* Day 2 node */}
          <div
            className={`timeline-node ${activeDay >= 2 ? 'active' : ''}`}
            onClick={() => setActiveDay(2)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '75%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: activeDay >= 2 ? '#ff9800' : 'rgba(255, 255, 255, 0.3)',
              border: '2px solid #ff9800',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>2</span>
          </div>

          {/* Day labels */}
          <div style={{
            position: 'absolute',
            top: '150%',
            left: '25%',
            transform: 'translateX(-50%)',
            color: activeDay === 1 ? '#ff9800' : '#fff',
            fontSize: '14px',
            fontWeight: activeDay === 1 ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            Day 1
          </div>

          <div style={{
            position: 'absolute',
            top: '150%',
            left: '75%',
            transform: 'translateX(-50%)',
            color: activeDay === 2 ? '#ff9800' : '#fff',
            fontSize: '14px',
            fontWeight: activeDay === 2 ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}>
            Day 2
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="timeline-container desktop-view">
        {activeDay === 1 && (
          <TimelineCard
            day="DAY 1"
            description="We kick off the event with an exciting fashion show, after which we crown our Mr and Ms Halcyon. Later at night, rack your brains as you hunt for treasure."
            events={day1Events}
            cardClass="day1-card"
            animation="fade-up"
          />
        )}

        {activeDay === 2 && (
          <TimelineCard
            day="Day 2"
            description="The fun continues through to the second day where you get to display all your skills, from acting to coding to gaming."
            events={day2Events}
            cardClass="day2-card"
            animation="fade-up"
          />
        )}


      </div>

      {/* Mobile view */}
      <div className="timeline-container mobile-view">
        {activeDay === 1 && <TimelineCardMobile events={day1Events} />}
        {activeDay === 2 && <TimelineCardMobile events={day2Events} />}
      </div>
    </div>
  );
}

export default Timeline;