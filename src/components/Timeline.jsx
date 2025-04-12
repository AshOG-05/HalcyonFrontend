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

  // Day 3 events
  const day3Events = [
    { title: "Open Mic", time: "11:00AM-12:30PM", link: "./EventPages/openmic.html" },
    { title: "Dance Battle", time: "1:00PM-3:00PM", link: "./EventPages/danceBattle.html" },
    { title: "Chess Finals", time: "3:00PM-6:00PM", link: "./EventPages/chess.html" },
    { title: "Valo Qualifiers", time: "7:00PM-12:30AM", link: "./EventPages/valoqual.html" }
  ];

  // Day 4 events
  const day4Events = [
    { title: "Open Mic", time: "11:00AM-12:30PM", link: "./EventPages/openmic.html" },
    { title: "COD Finals", time: "1:00PM - 3:00PM", link: "./EventPages/cod.html" },
    { title: "Valorant Finals", time: "3:00PM - 6:00PM", link: "./EventPages/valofinal.html" },
    { title: "Band Event", time: "7:00PM-12:30AM", link: "./EventPages/BandEvent.html" }
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
        <button
          className={activeDay === 3 ? 'active' : ''}
          onClick={() => setActiveDay(3)}
        >
          <span className="day-number">03</span>
          <span className="day-text">DAY 3</span>
        </button>
        <button
          className={activeDay === 4 ? 'active' : ''}
          onClick={() => setActiveDay(4)}
        >
          <span className="day-number">04</span>
          <span className="day-text">DAY 4</span>
        </button>
      </div>

      {/* Timeline visualization */}
      <div className="timeline-progress">
        <div className="timeline-track">
          <div className="timeline-progress-bar" style={{ width: `${activeDay * 25}%` }}></div>
          {[1, 2, 3, 4].map(day => (
            <div
              key={day}
              className={`timeline-node ${activeDay >= day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              <span>{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div className="timeline-container desktop-view">
        {activeDay === 1 && (
          <TimelineCard
            day="DAY 1"
            description="We kick off the event with an exciting fashion show, after which we crown our Mr and Ms Essence. Later at night, rack your brains as you hunt for treasure."
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

        {activeDay === 3 && (
          <TimelineCard
            day="Day 3"
            description="Impress the crowd with your voice, or with your moves on the dance floor. Then use your big brain to get through the chess finals and valorant qualifiers."
            events={day3Events}
            cardClass="day3-card"
            animation="fade-up"
          />
        )}

        {activeDay === 4 && (
          <TimelineCard
            day="Day 4"
            description="The final day sees the best gamers fight it out in the arena. Later, music groups from all over India have a battle of their own."
            events={day4Events}
            cardClass="day4-card"
            animation="fade-up"
          />
        )}
      </div>

      {/* Mobile view */}
      <div className="timeline-container mobile-view">
        {activeDay === 1 && <TimelineCardMobile events={day1Events} />}
        {activeDay === 2 && <TimelineCardMobile events={day2Events} />}
        {activeDay === 3 && <TimelineCardMobile events={day3Events} />}
        {activeDay === 4 && <TimelineCardMobile events={day4Events} />}
      </div>
    </div>
  );
}

export default Timeline;