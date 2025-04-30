import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL, EVENT_CATEGORIES } from '../../config';
import EventModal from '../../components/EventModal';
import './styles.css';

function CategoryEvents() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Get category details
  const category = EVENT_CATEGORIES.find(cat => cat.id === categoryId) || {
    id: categoryId || 'unknown',
    label: categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Unknown Category',
    icon: 'fas fa-question'
  };

  useEffect(() => {
    fetchCategoryEvents();
  }, [categoryId]);

  const fetchCategoryEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/event`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

      // Filter events by category
      const filteredEvents = data.filter(event =>
        (event.category || 'other') === categoryId
      );

      setEvents(filteredEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
  };

  const closeEventModal = () => {
    setSelectedEventId(null);
  };

  // Format date for display
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatEventTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="category-events-container">
      <div className="category-header">
        <Link to="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        <h1>
          <i className={category.icon}></i> {category.label} Events
        </h1>
        <p>Explore all {category.label.toLowerCase()} events at Halcyon 2025</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={fetchCategoryEvents} className="retry-button">
            Try Again
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="no-events-container">
          <i className="fas fa-calendar-times"></i>
          <p>No {category.label.toLowerCase()} events found</p>
          <Link to="/" className="back-home-button">
            Explore Other Categories
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <h3>{event.name}</h3>
                <span className="event-day">Day {event.day || 1}</span>
              </div>

              <div className="event-card-details">
                <div className="event-detail">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="event-detail">
                  <i className="fas fa-clock"></i>
                  <span>{formatEventTime(event.date)}</span>
                </div>
                <div className="event-detail">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className="event-card-description">
                <p>{event.description.substring(0, 150)}...</p>
              </div>

              <div className="event-card-actions">
                <button
                  className="view-details-button"
                  onClick={() => handleEventClick(event._id)}
                >
                  View Details & Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {selectedEventId && (
        <EventModal
          eventId={selectedEventId}
          onClose={closeEventModal}
        />
      )}
    </div>
  );
}

export default CategoryEvents;
