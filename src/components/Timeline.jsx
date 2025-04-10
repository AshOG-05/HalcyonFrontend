import { useEffect } from 'react';
import TimelineCard from './TimelineCard';
import TimelineCardMobile from './TimelineCardMobile';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Timeline() {
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
      <div className="timeline-container">
        <TimelineCard 
          day="DAY 1" 
          description="We kick off the event with an exciting fashion show, after which we crown our Mr and Ms Essence. Later at night, rack your brains as you hunt for treasure."
          events={day1Events}
          cardClass="day1-card"
          animation="fade-right"
        />
        <TimelineCardMobile events={day1Events} />
        
        <TimelineCard 
          day="Day 2" 
          description="The fun continues through to the second day where you get to display all your skills, from acting to coding to gaming."
          events={day2Events}
          cardClass="day2-card"
          animation="fade-left"
        />
        <TimelineCardMobile events={day2Events} />
        
        <TimelineCard 
          day="Day 3" 
          description="Impress the crowd with your voice, or with your moves on the dance floor. Then use your big brain to get through the chess finals and valorant qualifiers."
          events={day3Events}
          cardClass="day3-card"
          animation="fade-right"
        />
        <TimelineCardMobile events={day3Events} />
        
        <TimelineCard 
          day="Day 4" 
          description="The final day sees the best gamers fight it out in the arena. Later, music groups from all over India have a battle of their own."
          events={day4Events}
          cardClass="day4-card"
          animation="fade-left"
        />
        <TimelineCardMobile events={day4Events} />
        
        <div className="timeline-line"></div>
      </div>
    </div>
  );
}

export default Timeline;