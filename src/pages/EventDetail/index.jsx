import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, getCategoryPageThemeStyle } from '../../config';
import { isLoggedIn } from '../../services/authService';
import EventRegistrationForm from '../../components/EventRegistrationForm';
import './styles.css';
import '../../components/comicLoading.css';

function EventDetail() {
  const { id } = useParams();
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
  }, [id]);

  useLayoutEffect(() => {
    document.body.style.setProperty('background-image', 'none');
    document.body.style.setProperty('background-color', 'transparent');
    document.body.style.setProperty('background-attachment', 'scroll');
    const hideBodyDecor = document.createElement('style');
    hideBodyDecor.setAttribute('data-event-detail-fix', '1');
    hideBodyDecor.textContent =
      'body::before, body::after { display: none !important; }';
    document.head.appendChild(hideBodyDecor);
    return () => {
      document.body.style.removeProperty('background-image');
      document.body.style.removeProperty('background-color');
      document.body.style.removeProperty('background-attachment');
      hideBodyDecor.remove();
    };
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/event/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }

      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (!isLoggedIn()) {
      navigate(
        '/RegisterLogin?redirect=' + encodeURIComponent('/event/' + id)
      );
      return;
    }
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

  if (loading) {
    return (
      <div
        className="event-detail-container"
        style={getCategoryPageThemeStyle('other')}
      >
        <div className="event-detail-inner">
          <div className="loading">
            <div className="comic-loading-wrap">
              <div
                className="comic-loading"
                role="status"
                aria-live="polite"
                aria-label="Loading event details"
              >
                <div className="comic-loading__sun" />
              </div>
              <div className="comic-loading-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
            <p>Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="event-detail-container"
        style={getCategoryPageThemeStyle('other')}
      >
        <div className="event-detail-inner">
          <div className="error">Error: {error}</div>
          <button
            className="back-button"
            onClick={() => navigate('/events')}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        className="event-detail-container"
        style={getCategoryPageThemeStyle('other')}
      >
        <div className="event-detail-inner">
          <div className="error">Event not found</div>
          <button
            className="back-button"
            onClick={() => navigate('/events')}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="event-detail-container"
      style={getCategoryPageThemeStyle(event.category || 'other')}
    >
      <div className="event-detail-inner">
      {showRegistrationForm ? (
        <EventRegistrationForm
          eventId={id}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={handleRegistrationSuccess}
        />
      ) : (
        <div className="event-detail-content">
          <div className="navigation-buttons">
            <button
              className="back-button"
              onClick={() => navigate('/events')}
            >
              <i className="fas fa-arrow-left"></i> Back to Events
            </button>
          </div>
          <div className="event-detail-card">
          <div className="event-header">
            <h1 className="event-title">{event.name}</h1>
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
            </div>
          </div>

          <div className="event-content">
            <div className="event-description-full">
              <h3>About This Event</h3>
              <p>{event.description}</p>
            </div>

            {event.rules && (
              <div className="event-rules">
                <h3>Rules</h3>
                <ul>
                  {event.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {event.prizes && (
              <div className="event-prizes">
                <h3>Prizes</h3>
                <ul>
                  {event.prizes.map((prize, index) => (
                    <li key={index}>{prize}</li>
                  ))}
                </ul>
              </div>
            )}

            {event.coordinators && (
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

          <div className="event-actions">
            {registrationStatus.message && (
              <div className={`registration-message ${registrationStatus.success ? 'success' : 'error'}`}>
                {registrationStatus.message}
              </div>
            )}

            <div className="event-registration-info">
              <div className="registration-fee">
                <i className="fas fa-ticket-alt"></i>
                <span>Registration Fee: <strong>{event.registrationFee === 0 ? 'Free' : event.registrationFee ? `₹${event.registrationFee}` : event.fees && parseInt(event.fees) > 0 ? `₹${event.fees}` : 'Free'}</strong></span>
              </div>

              <div className="team-size-info">
                <i className="fas fa-users"></i>
                <span>
                  {event.teamSize === 1
                    ? 'Individual Event'
                    : event.teamSize === 2
                      ? 'Duo Event (2 participants)'
                      : `Team Event (${event.minTeamSize === event.maxTeamSize
                        ? `${event.minTeamSize} participants`
                        : `${event.minTeamSize}-${event.maxTeamSize} participants`})`
                  }
                </span>
              </div>
            </div>

            <div className="registration-buttons">
              <button
                className={`register-button ${registrationStatus.success ? 'success' : ''}`}
                onClick={handleRegister}
                disabled={registering || registrationStatus.success}
              >
                {registering ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Registering...
                  </>
                ) : registrationStatus.success ? (
                  <>
                    <i className="fas fa-check"></i>
                    Registered Successfully!
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    Register Now
                  </>
                )}
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default EventDetail;
