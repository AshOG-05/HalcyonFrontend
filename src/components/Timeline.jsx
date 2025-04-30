import React, { useEffect, useState } from 'react';
import TimelineCard from './TimelineCard';
import TimelineCardMobile from './TimelineCardMobile';
import EventModal from './EventModal';
import { API_URL, FESTIVAL_DAYS, EVENT_CATEGORIES } from '../config';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Timeline.css';

function Timeline() {
  const [activeDay, setActiveDay] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/event/`);

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();

        // Group events by festival day (1 or 2)
        const groupedEvents = data.reduce((acc, event) => {
          const eventDate = new Date(event.date);
          // Use the day field from the event, or default to 1
          const festivalDay = event.day || 1;
          // Use the category field from the event, or default to 'other'
          const category = event.category || 'other';

          // Format the time
          const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });

          // Create a formatted event object
          const formattedEvent = {
            id: event._id,
            title: event.name,
            time: formattedTime,
            date: eventDate,
            day: festivalDay,
            category: category
          };

          // Add to the appropriate day
          if (!acc[festivalDay]) {
            acc[festivalDay] = [];
          }
          acc[festivalDay].push(formattedEvent);

          return acc;
        }, {});

        console.log('Fetched events:', data);
        console.log('Grouped events:', groupedEvents);
        setEvents(groupedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get categories for the active day
  const getCategoriesForActiveDay = () => {
    if (loading || error || !events || Object.keys(events).length === 0) {
      console.log('Using empty array for categories due to loading/error/empty state');
      return [];
    }

    // Get events for the active day
    const dayEvents = events[activeDay] || [];

    // Group events by category
    const categoriesMap = dayEvents.reduce((acc, event) => {
      const category = event.category || 'other';
      if (!acc[category]) {
        // Find the category info from EVENT_CATEGORIES
        const categoryInfo = EVENT_CATEGORIES.find(cat => cat.id === category) || {
          id: category,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          icon: 'fas fa-star'
        };

        acc[category] = {
          id: category,
          title: categoryInfo.label,
          icon: categoryInfo.icon,
          events: [],
          time: '0 events'
        };
      }

      acc[category].events.push(event);
      acc[category].time = `${acc[category].events.length} event${acc[category].events.length !== 1 ? 's' : ''}`;

      return acc;
    }, {});

    // Convert to array
    return Object.values(categoriesMap);
  };

  // Fallback categories in case API fails
  const getFallbackCategories = () => {
    console.log('Using fallback categories for day', activeDay);
    if (activeDay === 1) {
      return [
        { id: 'dance', title: "Dance", icon: "fas fa-music", time: "2 events" },
        { id: 'music', title: "Music", icon: "fas fa-guitar", time: "3 events" },
        { id: 'gaming', title: "Gaming", icon: "fas fa-gamepad", time: "1 event" }
      ];
    } else {
      // Fallback categories for Day 2
      return [
        { id: 'theatre', title: "Theatre", icon: "fas fa-theater-masks", time: "1 event" },
        { id: 'literary', title: "Literary", icon: "fas fa-book", time: "2 events" }
      ];
    }
  };

  const handleCategoryClick = (categoryId) => {
    console.log('Category clicked with ID:', categoryId);
    // Navigate to category page
    window.location.href = `/category/${categoryId}`;
  };

  const closeEventModal = () => {
    setSelectedEventId(null);
  };

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
        {FESTIVAL_DAYS.map((day) => (
          <button
            key={day.id}
            className={activeDay === day.id ? 'active' : ''}
            onClick={() => setActiveDay(day.id)}
          >
            <span className="day-number">{String(day.id).padStart(2, '0')}</span>
            <span className="day-text">{day.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline visualization */}
      <div className="timeline-progress" style={{ margin: '3rem auto 5rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div className="timeline-track" style={{ position: 'relative', width: '80%', maxWidth: '600px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}>
          <div
            className="timeline-progress-bar"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${(activeDay / FESTIVAL_DAYS.length) * 100}%`,
              backgroundColor: '#ff9800',
              borderRadius: '2px',
              transition: 'width 0.5s ease'
            }}
          ></div>

          {/* Day nodes */}
          {FESTIVAL_DAYS.map((day, index) => {
            const leftPosition = ((index + 1) / (FESTIVAL_DAYS.length + 1)) * 100;
            return (
              <React.Fragment key={day.id}>
                {/* Node */}
                <div
                  className={`timeline-node ${activeDay >= day.id ? 'active' : ''}`}
                  onClick={() => setActiveDay(day.id)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${leftPosition}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: activeDay >= day.id ? '#ff9800' : 'rgba(255, 255, 255, 0.3)',
                    border: '2px solid #ff9800',
                    cursor: 'pointer',
                    zIndex: 2,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>{day.id}</span>
                </div>

                {/* Label */}
                <div style={{
                  position: 'absolute',
                  top: '150%',
                  left: `${leftPosition}%`,
                  transform: 'translateX(-50%)',
                  color: activeDay === day.id ? '#ff9800' : '#fff',
                  fontSize: '14px',
                  fontWeight: activeDay === day.id ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}>
                  {day.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Category filters removed */}

      {/* Desktop view */}
      <div className="timeline-container desktop-view">
        <TimelineCard
          day={FESTIVAL_DAYS[activeDay - 1].label}
          description={FESTIVAL_DAYS[activeDay - 1].description}
          categories={error || getCategoriesForActiveDay().length === 0 ? getFallbackCategories() : getCategoriesForActiveDay()}
          cardClass={`day${activeDay}-card`}
          animation="fade-up"
          onCategoryClick={handleCategoryClick}
          loading={loading}
        />
      </div>

      {/* No Event Modal needed as we're navigating to category pages */}

      {/* Mobile view */}
      <div className="timeline-container mobile-view">
        <TimelineCardMobile
          categories={error || getCategoriesForActiveDay().length === 0 ? getFallbackCategories() : getCategoriesForActiveDay()}
          onCategoryClick={handleCategoryClick}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Timeline;