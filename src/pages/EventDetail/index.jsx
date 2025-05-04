import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, APP_CONFIG } from '../../config';
import { isLoggedIn } from '../../services/authService';
import './styles.css';

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

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

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

  const handleRegister = async () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      // Redirect to login page with a return URL
      navigate(`/RegisterLogin?redirect=/event/${id}`);
      return;
    }

    setRegistering(true);
    setRegistrationStatus({
      success: false,
      message: ''
    });

    try {
      const token = localStorage.getItem(APP_CONFIG.tokenName);
      const response = await fetch(`${API_URL}/registration/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for event');
      }

      setRegistrationStatus({
        success: true,
        message: 'You have successfully registered for this event!'
      });
    } catch (err) {
      setRegistrationStatus({
        success: false,
        message: err.message
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="event-detail-container">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail-container">
        <div className="error">Error: {error}</div>
        <button
          className="back-button"
          onClick={() => navigate('/events')}
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-container">
        <div className="error">Event not found</div>
        <button
          className="back-button"
          onClick={() => navigate('/events')}
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="event-detail-container">
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

          <button
            className="register-button"
            onClick={handleRegister}
            disabled={registering}
          >
            {registering ? 'Registering...' : 'Register for this Event'}
          </button>

          <button
            className="back-button"
            onClick={() => navigate('/events')}
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
