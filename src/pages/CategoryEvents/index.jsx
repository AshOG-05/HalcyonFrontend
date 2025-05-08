import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EVENT_CATEGORIES } from '../../config';
import { corsProtectedFetch } from '../../utils/corsHelper';
import EventModal from '../../components/EventModal';
import './styles.css';

function CategoryEvents() {
  const { eventName } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Get category details
  const category = EVENT_CATEGORIES.find(cat => cat.id === eventName) || {
    id: eventName || 'unknown',
    label: eventName ? eventName.charAt(0).toUpperCase() + eventName.slice(1) : 'Unknown Category',
    icon: 'fas fa-question'
  };

  useEffect(() => {
    fetchCategoryEvents();
  }, [eventName]);

  const fetchCategoryEvents = async () => {
    try {
      setLoading(true);

      // Try using the CORS-protected fetch
      const response = await corsProtectedFetch('event');

      // Check if we got an opaque response (from no-cors mode)
      if (response.type === 'opaque') {
        console.log('Received opaque response, using mock data');
        const mockData = getMockEvents();
        const filteredMockEvents = mockData.filter(event =>
          (event.category || 'other') === eventName
        );
        setEvents(filteredMockEvents);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      console.log('Successfully fetched events for category:', eventName);
      console.log('Event data from backend:', data);

      // Filter events by category
      const filteredEvents = data.filter(event =>
        (event.category || 'other') === eventName
      );

      setEvents(filteredEvents);
    } catch (err) {
      console.error('Error in fetchCategoryEvents:', err);
      setError(err.message);

      // Use mock data as a fallback
      console.log('Using mock data due to fetch failures');
      const mockData = getMockEvents();
      const filteredMockEvents = mockData.filter(event =>
        (event.category || 'other') === eventName
      );
      setEvents(filteredMockEvents);
    } finally {
      setLoading(false);
    }
  };

  // Mock data function for fallback
  const getMockEvents = () => {
    // Create 5 mock events for the current category
    return Array.from({ length: 5 }, (_, index) => ({
      _id: `mock-${eventName}-${index}`,
      name: `${category.label} Event ${index + 1}`,
      description: `This is a sample ${category.label.toLowerCase()} event for Halcyon 2025. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nisl.`,
      date: new Date().toISOString(),
      venue: 'Main Auditorium',
      category: eventName,
      day: Math.floor(Math.random() * 2) + 1,
      rules: [
        'Participants must register in advance',
        'Teams of 2-4 members are allowed',
        'Time limit: 2 hours',
        'Judges decision will be final'
      ],
      prizes: [
        '1st Prize: ₹10,000',
        '2nd Prize: ₹5,000',
        '3rd Prize: ₹2,000'
      ],
      registrationFee: Math.floor(Math.random() * 3) === 0 ? 0 : (Math.floor(Math.random() * 5) + 1) * 100,
      coordinators: [
        { name: 'John Doe', phone: '9876543210' },
        { name: 'Jane Smith', phone: '9876543211' }
      ]
    }));
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

  // Format registration fee for display
  const formatRegistrationFee = (fee) => {
    if (fee === undefined || fee === null) return 'Free';
    if (fee === 0) return 'Free';
    return `₹${fee}`;
  };

  // Get the correct fee from either registrationFee or fees field
  const getEventFee = (event) => {
    if (event.registrationFee === 0) return 'Free';
    if (event.registrationFee) return `₹${event.registrationFee}`;
    if (event.fees && parseInt(event.fees) > 0) return `₹${event.fees}`;
    return 'Free';
  };

  return (
    <div className="category-events-container">
      <div className="category-header">
        <Link to="/events" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Events
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
          <Link to="/events" className="back-home-button">
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
                <div className="event-detail">
                  <i className="fas fa-ticket-alt"></i>
                  <span>
                    Registration: <strong>{getEventFee(event)}</strong>
                  </span>
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
