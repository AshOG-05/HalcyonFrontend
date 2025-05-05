import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG, EVENT_CATEGORIES } from '../config';
import { corsProtectedFetch, ORIGINAL_API_URL } from '../utils/corsHelper';
import { isLoggedIn } from '../services/authService';
import EventRegistrationForm from './EventRegistrationForm';
import './EventModal.css';

// Helper function to create mock data for fallback events
const createMockEventData = (eventId) => {
  const fallbackEvents = {
    'fallback1': {
      _id: 'fallback1',
      name: 'Fashion Show',
      description: 'Showcase your style and creativity in our annual fashion show. Walk the ramp with confidence and flair.',
      date: new Date('2025-03-15T13:00:00'),
      venue: 'Main Auditorium',
      day: 1,
      category: 'theatre',
      rules: [
        'Participants must register in teams of 3-5 members',
        'Each team will get 10 minutes for their performance',
        'Props are allowed but must be approved beforehand',
        'Theme will be announced one week before the event'
      ],
      prizes: [
        '1st Prize: ₹10,000',
        '2nd Prize: ₹5,000',
        '3rd Prize: ₹3,000'
      ],
      coordinators: [
        { name: 'Priya Sharma', phone: '9876543210' },
        { name: 'Rahul Verma', phone: '8765432109' }
      ]
    },
    'fallback2': {
      _id: 'fallback2',
      name: 'Mr and Ms Fest',
      description: 'Compete for the prestigious title of Mr. and Ms. Halcyon 2025. Show your talent, wit, and personality.',
      date: new Date('2025-03-15T15:00:00'),
      venue: 'Main Stage',
      day: 1,
      category: 'other',
      rules: [
        'Individual participation only',
        'Three rounds: Introduction, Talent, and Q&A',
        'Each participant gets 5 minutes for the talent round',
        'Judges decision will be final'
      ],
      prizes: [
        'Mr. Halcyon: Trophy + ₹7,000',
        'Ms. Halcyon: Trophy + ₹7,000',
        'Runners-up: ₹3,000 each'
      ],
      coordinators: [
        { name: 'Ananya Patel', phone: '7654321098' },
        { name: 'Vikram Singh', phone: '6543210987' }
      ]
    },
    'fallback3': {
      _id: 'fallback3',
      name: 'Treasure Hunt',
      description: 'Put your problem-solving skills to the test in this exciting treasure hunt across the campus.',
      date: new Date('2025-03-15T19:00:00'),
      venue: 'Entire Campus',
      day: 1,
      category: 'gaming',
      rules: [
        'Teams of 3-4 members',
        'All clues must be solved in sequence',
        'No external help or internet allowed',
        'Time limit: 3 hours'
      ],
      prizes: [
        '1st Prize: ₹8,000',
        '2nd Prize: ₹4,000',
        '3rd Prize: ₹2,000'
      ],
      coordinators: [
        { name: 'Arjun Mehta', phone: '5432109876' },
        { name: 'Neha Gupta', phone: '4321098765' }
      ]
    },
    // Day 2 events will be added through the admin page
  };

  return fallbackEvents[eventId] || {
    _id: eventId,
    name: 'Unknown Event',
    description: 'Details for this event are not available.',
    date: new Date(),
    venue: 'TBD',
    day: 1,
    category: 'other',
    rules: [],
    prizes: [],
    coordinators: []
  };
};

function EventModal({ eventId, onClose }) {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    message: ''
  });
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    fetchEventDetails();

    // Add event listener to close modal when clicking outside
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('event-modal-overlay')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      console.log('Fetching event details for ID:', eventId);
      setLoading(true);

      // Check if this is a mock event ID (starts with 'mock')
      if (eventId && eventId.toString().startsWith('mock')) {
        console.log('This is a mock event, creating mock data');
        // Create mock data for mock events
        const mockEvent = createMockEventData(eventId);
        setEvent(mockEvent);
        setLoading(false);
        return;
      }

      // Try using the CORS-protected fetch
      let response;
      try {
        response = await corsProtectedFetch(`event/${eventId}`);

        // Check if we got an opaque response (from no-cors mode)
        if (response.type === 'opaque') {
          console.log('Received opaque response, using mock data');
          const mockEvent = createMockEventData(eventId);
          setEvent(mockEvent);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch event details: ${response.status}`);
        }

        const data = await response.json();
        console.log('Event data received:', data);
        setEvent(data);
      } catch (corsError) {
        console.error('All fetch attempts failed:', corsError);

        // Create mock data as fallback
        console.log('Using mock data due to fetch failures');
        const mockEvent = createMockEventData(eventId);
        setEvent(mockEvent);
      }
    } catch (err) {
      console.error('Error in fetchEventDetails:', err);
      setError(err.message);

      // Use mock data as a fallback
      const mockEvent = createMockEventData(eventId);
      setEvent(mockEvent);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      // Close the modal and redirect to login page with a return URL
      onClose();
      navigate(`/RegisterLogin?redirect=/event/${eventId}`);
      return;
    }

    // Show the registration form
    setShowRegistrationForm(true);
  };

  const handleRegistrationSuccess = (data) => {
    // Handle successful registration
    setRegistrationStatus({
      success: true,
      message: 'You have successfully registered for this event!'
    });

    // Hide the registration form
    setShowRegistrationForm(false);
  };

  return (
    <div className="event-modal-overlay">
      {showRegistrationForm && event ? (
        <EventRegistrationForm
          eventId={eventId}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={handleRegistrationSuccess}
        />
      ) : (
        <div className="event-modal">
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>

          {loading ? (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Loading event details...</p>
            </div>
          ) : error ? (
            <div className="modal-error">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : event ? (
            <>
              <div className="event-modal-header">
                <h2>{event.name}</h2>
                <div className="event-meta">
                  <div className="event-date-time">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="event-location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{event.venue}</span>
                  </div>
                  <div className="event-category">
                    <i className={EVENT_CATEGORIES.find(cat => cat.id === (event.category || 'other'))?.icon || 'fas fa-star'}></i>
                    <span>{EVENT_CATEGORIES.find(cat => cat.id === (event.category || 'other'))?.label || 'Other'}</span>
                  </div>
                  <div className="event-day-badge">
                    <i className="fas fa-calendar-day"></i>
                    <span>Day {event.day || 1}</span>
                  </div>
                </div>
              </div>

              <div className="event-modal-content">
                <div className="event-description">
                  <h3>About This Event</h3>
                  <p>{event.description}</p>
                </div>

                {event.rules && event.rules.length > 0 && (
                  <div className="event-rules">
                    <h3>Rules</h3>
                    <ul>
                      {event.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.prizes && event.prizes.length > 0 && (
                  <div className="event-prizes">
                    <h3>Prizes</h3>
                    <ul>
                      {event.prizes.map((prize, index) => (
                        <li key={index}>{prize}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.coordinators && event.coordinators.length > 0 && (
                  <div className="event-coordinators">
                    <h3>Event Coordinators</h3>
                    <ul>
                      {event.coordinators.map((coordinator, index) => (
                        <li key={index}>{coordinator.name} - {coordinator.phone}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="event-modal-actions">
                {registrationStatus.message && (
                  <div className={`registration-message ${registrationStatus.success ? 'success' : 'error'}`}>
                    {registrationStatus.message}
                  </div>
                )}

                <div className="event-registration-info">
                  <div className="registration-fee">
                    <i className="fas fa-ticket-alt"></i>
                    <span>Registration Fee: {event.fees ? `₹${event.fees}` : 'Free'}</span>
                  </div>

                  <div className="team-size-info">
                    <i className="fas fa-users"></i>
                    <span>
                      {event.teamSize === 1
                        ? 'Individual Event'
                        : event.teamSize === 2
                          ? 'Duo Event (2 participants)'
                          : `Team Event (${event.isVariableTeamSize
                            ? `Up to ${event.teamSize} participants`
                            : `${event.teamSize} participants`})`
                      }
                    </span>
                  </div>
                </div>

                <button
                  className="register-button"
                  onClick={handleRegister}
                  disabled={registering || registrationStatus.success}
                >
                  {registering ? 'Registering...' : 'Register for this Event'}
                </button>
              </div>
            </>
          ) : (
            <div className="modal-error">
              <i className="fas fa-exclamation-circle"></i>
              <p>Event not found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EventModal;
