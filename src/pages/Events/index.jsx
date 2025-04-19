import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import './styles.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/event`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>
      <p className="events-subtitle">Join us for these exciting events at Halcyon 2025</p>
      
      {events.length === 0 ? (
        <div className="no-events">No events found. Check back later!</div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-date">
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <h3 className="event-name">{event.name}</h3>
              <p className="event-venue">
                <i className="fas fa-map-marker-alt"></i> {event.venue}
              </p>
              <p className="event-description">
                {event.description.length > 100 
                  ? `${event.description.substring(0, 100)}...` 
                  : event.description}
              </p>
              <Link to={`/events/${event._id}`} className="event-details-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
