import { useState, useEffect } from 'react';
import { isTeamLoggedIn, teamLogout } from '../../services/authService';
import { API_URL } from '../../config';
import './styles.css';

function TeamDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [spotRegistrationForm, setSpotRegistrationForm] = useState({
    participantName: '',
    participantEmail: '',
    eventId: ''
  });

  useEffect(() => {
    // Check if team member is logged in
    if (!isTeamLoggedIn()) {
      window.location.href = '/RegisterLogin';
      return;
    }

    // Fetch initial data
    fetchEvents();
    fetchRegistrations();
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

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('teamCookie');
      const response = await fetch(`${API_URL}/registration/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    teamLogout();
  };

  const handleSpotRegistrationChange = (e) => {
    const { name, value } = e.target;
    setSpotRegistrationForm({
      ...spotRegistrationForm,
      [name]: value
    });
  };

  const handleSpotRegistrationSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('teamCookie');
      const response = await fetch(`${API_URL}/registration/spot/${spotRegistrationForm.eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          participantName: spotRegistrationForm.participantName,
          participantEmail: spotRegistrationForm.participantEmail
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register participant');
      }

      // Reset form and refresh registrations
      setSpotRegistrationForm({
        participantName: '',
        participantEmail: '',
        eventId: ''
      });
      fetchRegistrations();

      alert('Participant registered successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    switch (activeTab) {
      case 'events':
        return (
          <div className="dashboard-table-container">
            <h3>Managed Events</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td>{event.name}</td>
                    <td>{event.description}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.venue}</td>
                    <td>
                      <button className="action-btn view-btn">View Details</button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => {
                          setSpotRegistrationForm({
                            ...spotRegistrationForm,
                            eventId: event._id
                          });
                          setActiveTab('spot-registration');
                        }}
                      >
                        Spot Register
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'registrations':
        return (
          <div className="dashboard-table-container">
            <h3>Event Registrations</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length > 0 ? (
                  registrations.map(reg => (
                    <tr key={reg._id}>
                      <td>{reg.participant?.name || 'Unknown'}</td>
                      <td>{reg.event?.name || 'Unknown'}</td>
                      <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      <td>
                        <button className="action-btn view-btn">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No registrations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'spot-registration':
        return (
          <div className="dashboard-form-container">
            <h3>Spot Registration</h3>
            <form onSubmit={handleSpotRegistrationSubmit} className="dashboard-form">
              <div className="form-group">
                <label htmlFor="eventId">Select Event</label>
                <select
                  id="eventId"
                  name="eventId"
                  value={spotRegistrationForm.eventId}
                  onChange={handleSpotRegistrationChange}
                  required
                >
                  <option value="">-- Select Event --</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="participantName">Participant Name</label>
                <input
                  type="text"
                  id="participantName"
                  name="participantName"
                  value={spotRegistrationForm.participantName}
                  onChange={handleSpotRegistrationChange}
                  required
                  placeholder="Enter participant's full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="participantEmail">Participant Email</label>
                <input
                  type="email"
                  id="participantEmail"
                  name="participantEmail"
                  value={spotRegistrationForm.participantEmail}
                  onChange={handleSpotRegistrationChange}
                  required
                  placeholder="Enter participant's email"
                />
              </div>

              <button type="submit" className="submit-btn">
                Register Participant
              </button>
            </form>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="dashboard-container team-dashboard">
      <div className="dashboard-header">
        <h2>Team Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-calendar-alt"></i> Managed Events
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <i className="fas fa-clipboard-list"></i> Registrations
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'spot-registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('spot-registration')}
          >
            <i className="fas fa-user-plus"></i> Spot Registration
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>

        <div className="dashboard-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default TeamDashboard;
