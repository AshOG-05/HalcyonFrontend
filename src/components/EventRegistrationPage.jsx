import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, APP_CONFIG } from '../config';
import { isLoggedIn } from '../services/authService';
import EventRegistrationForm from './EventRegistrationForm';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './EventRegistrationPage.css';

function EventRegistrationPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    message: ''
  });

  // Generate stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 5 + 3}s`,
    delay: `${Math.random() * 5}s`
  }));

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: false,
      mirror: true
    });

    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate(`/RegisterLogin?redirect=/event/${eventId}`);
      return;
    }

    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/event/${eventId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate]);

  const handleOpenRegistrationForm = () => {
    setShowRegistrationForm(true);
  };

  const handleCloseRegistrationForm = () => {
    setShowRegistrationForm(false);
  };

  const handleRegistrationSuccess = () => {
    setRegistrationStatus({
      success: true,
      message: 'You have successfully registered for this event!'
    });
    setShowRegistrationForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="event-registration-page">
      {/* Background elements */}
      <div className="event-registration-bg">
        <div className="stars-container">
          {stars.map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: Math.random(),
                animation: `twinkle ${star.duration} infinite alternate ${star.delay}`
              }}
            />
          ))}
        </div>

        {/* Gradient shapes */}
        <div className="gradient-shape shape-1"></div>
        <div className="gradient-shape shape-2"></div>
        <div className="gradient-shape shape-3"></div>

        {/* Floating elements */}
        <img
          className="floating-element astronaut"
          src="/assets/Dancer.png"
          alt="Astronaut"
        />
        <img
          className="floating-element planet"
          src="/assets/circular.png"
          alt="Planet"
        />
      </div>

      {/* Content */}
      <div className="event-registration-content">
        <div className="event-registration-header">
          <h1>Event <span className="highlight">Registration</span></h1>
          <p>Join us for an unforgettable experience at Halcyon 2025!</p>
        </div>

        {loading ? (
          <div className="event-registration-card">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading event details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="event-registration-card">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button
                className="submit-button"
                onClick={() => navigate('/events')}
              >
                Back to Events
              </button>
            </div>
          </div>
        ) : event ? (
          <>
            <div className="event-registration-card" data-aos="fade-up">
              <h2>{event.name}</h2>

              <div className="event-details">
                <div className="event-detail" data-aos="fade-right" data-aos-delay="100">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Date: {formatDate(event.date)}</span>
                </div>

                <div className="event-detail" data-aos="fade-right" data-aos-delay="200">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Venue: {event.venue || 'TBA'}</span>
                </div>

                <div className="event-detail" data-aos="fade-right" data-aos-delay="300">
                  <i className="fas fa-users"></i>
                  <span>Team Size: {event.teamSize || 1} {event.isVariableTeamSize ? '(Variable)' : ''}</span>
                </div>

                <div className="event-detail" data-aos="fade-right" data-aos-delay="400">
                  <i className="fas fa-rupee-sign"></i>
                  <span>Registration Fee: {event.registrationFee === 0 ? 'Free' : event.registrationFee ? `₹${event.registrationFee}` : event.fees && parseInt(event.fees) > 0 ? `₹${event.fees}` : 'Free'}</span>
                </div>
              </div>

              <div className="event-description">
                <h3>About the Event</h3>
                <p>{event.description}</p>
              </div>

              {registrationStatus.success ? (
                <div className="registration-success">
                  <i className="fas fa-check-circle"></i>
                  <h3>Registration Successful!</h3>
                  <p>{registrationStatus.message}</p>
                  <button
                    className="submit-button"
                    onClick={() => navigate('/events')}
                  >
                    Explore More Events
                  </button>
                </div>
              ) : (
                <div className="registration-actions">
                  <button
                    className="submit-button"
                    onClick={handleOpenRegistrationForm}
                    disabled={!event.registrationOpen}
                  >
                    {event.registrationOpen ? 'Register Now' : 'Registration Closed'}
                  </button>

                  <button
                    className="back-button"
                    onClick={() => navigate('/events')}
                  >
                    Back to Events
                  </button>
                </div>
              )}
            </div>

            {event.rules && event.rules.length > 0 && (
              <div className="event-registration-card" data-aos="fade-up" data-aos-delay="100">
                <h3>Event Rules</h3>
                <ul className="event-rules">
                  {event.rules.map((rule, index) => (
                    <li key={index} data-aos="fade-left" data-aos-delay={100 * (index + 1)}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {event.prizes && event.prizes.length > 0 && (
              <div className="event-registration-card" data-aos="fade-up" data-aos-delay="200">
                <h3>Prizes</h3>
                <ul className="event-prizes">
                  {event.prizes.map((prize, index) => (
                    <li key={index} data-aos="fade-left" data-aos-delay={100 * (index + 1)}>{prize}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && event && (
        <EventRegistrationForm
          eventId={eventId}
          onClose={handleCloseRegistrationForm}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}

export default EventRegistrationPage;
