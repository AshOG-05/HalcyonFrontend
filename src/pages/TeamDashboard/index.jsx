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
    eventId: '',
    teamName: '',
    teamSize: 1,
    commonCollegeName: '',
    participants: [
      {
        name: '',
        email: '',
        mobile: '',
        usn: ''
      }
    ]
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [teamSizeOptions, setTeamSizeOptions] = useState([1]);

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

  // Handle event selection and fetch event details
  const handleEventChange = async (e) => {
    const eventId = e.target.value;

    // Reset form if no event is selected
    if (!eventId) {
      setSpotRegistrationForm({
        eventId: '',
        teamName: '',
        teamSize: 1,
        commonCollegeName: '',
        participants: [
          {
            name: '',
            email: '',
            mobile: '',
            usn: ''
          }
        ]
      });
      setSelectedEvent(null);
      setTeamSizeOptions([1]);
      return;
    }

    setSpotRegistrationForm({
      ...spotRegistrationForm,
      eventId
    });

    try {
      // Fetch event details to get team size configuration
      const response = await fetch(`${API_URL}/event/${eventId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }

      const eventData = await response.json();
      setSelectedEvent(eventData);

      // Set team size options based on event configuration
      if (eventData.isVariableTeamSize) {
        // If variable team size, provide options from 1 to max team size
        const options = Array.from({ length: eventData.teamSize }, (_, i) => i + 1);
        setTeamSizeOptions(options);
      } else {
        // If fixed team size, only provide the specified team size
        setTeamSizeOptions([eventData.teamSize || 1]);

        // Update form with the required team size
        const newTeamSize = eventData.teamSize || 1;

        // Initialize participants array based on team size
        const newParticipants = Array.from({ length: newTeamSize }, (_, i) => {
          return {
            name: '',
            email: '',
            mobile: '',
            usn: ''
          };
        });

        setSpotRegistrationForm(prev => ({
          ...prev,
          teamSize: newTeamSize,
          participants: newParticipants
        }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle team size change
  const handleTeamSizeChange = (e) => {
    const newTeamSize = parseInt(e.target.value);

    // Initialize participants array based on new team size
    const newParticipants = Array.from({ length: newTeamSize }, (_, i) => {
      // Keep existing participant data if available
      return spotRegistrationForm.participants[i] || {
        name: '',
        email: '',
        mobile: '',
        usn: ''
      };
    });

    setSpotRegistrationForm(prev => ({
      ...prev,
      teamSize: newTeamSize,
      participants: newParticipants
    }));
  };

  // Handle changes to common fields
  const handleCommonFieldChange = (e) => {
    const { name, value } = e.target;
    setSpotRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle changes to participant fields
  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...spotRegistrationForm.participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };

    setSpotRegistrationForm(prev => ({
      ...prev,
      participants: updatedParticipants
    }));
  };

  const handleSpotRegistrationSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!spotRegistrationForm.eventId) {
        throw new Error('Please select an event');
      }

      if (!spotRegistrationForm.commonCollegeName) {
        throw new Error('Please enter the college name');
      }

      // Validate team name for teams with more than 2 members
      if (spotRegistrationForm.teamSize > 2 && !spotRegistrationForm.teamName) {
        throw new Error('Team name is required for teams with more than 2 members');
      }

      // Validate all participants have required fields
      const missingFields = [];
      spotRegistrationForm.participants.forEach((participant, index) => {
        if (!participant.name) missingFields.push(`Participant ${index + 1} name`);
        if (!participant.email) missingFields.push(`Participant ${index + 1} email`);
        if (!participant.mobile) missingFields.push(`Participant ${index + 1} mobile`);
        if (!participant.usn) missingFields.push(`Participant ${index + 1} USN`);
      });

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Extract team leader (first participant) and team members (rest of participants)
      const teamLeader = spotRegistrationForm.participants[0];
      const teamMembers = spotRegistrationForm.participants.slice(1);

      // Prepare registration data according to backend requirements
      const registrationData = {
        teamLeaderDetails: {
          collegeName: spotRegistrationForm.commonCollegeName,
          usn: teamLeader.usn
        },
        teamName: spotRegistrationForm.teamSize > 2 ? spotRegistrationForm.teamName : null,
        teamSize: spotRegistrationForm.teamSize,
        teamMembers: teamMembers.map(member => ({
          name: member.name,
          email: member.email,
          mobile: member.mobile,
          usn: member.usn,
          collegeName: spotRegistrationForm.commonCollegeName
        }))
      };

      // If the event has a fee, handle payment (for spot registration, we'll assume payment is handled separately)
      if (selectedEvent && selectedEvent.fees > 0) {
        registrationData.paymentStatus = 'completed';
        registrationData.paymentId = 'SPOT_PAYMENT_' + Date.now();
        registrationData.orderId = 'SPOT_ORDER_' + Date.now();
      }

      // Send registration request using the regular registration endpoint
      const token = localStorage.getItem('teamCookie');

      // Log the data being sent for debugging
      console.log('Sending spot registration data:', registrationData);

      const response = await fetch(`${API_URL}/registration/${spotRegistrationForm.eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register participant');
      }

      // Reset form and refresh registrations
      setSpotRegistrationForm({
        eventId: '',
        teamName: '',
        teamSize: 1,
        commonCollegeName: '',
        participants: [
          {
            name: '',
            email: '',
            mobile: '',
            usn: ''
          }
        ]
      });
      setSelectedEvent(null);
      fetchRegistrations();

      alert('Registration completed successfully!');
    } catch (err) {
      setError(err.message);
      alert('Error: ' + err.message);
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
                        className="action-btn register-btn"
                        onClick={() => {
                          // Reset form and set the selected event ID
                          setSpotRegistrationForm({
                            eventId: event._id,
                            teamName: '',
                            teamSize: 1,
                            commonCollegeName: '',
                            participants: [
                              {
                                name: '',
                                email: '',
                                mobile: '',
                                usn: ''
                              }
                            ]
                          });
                          // Trigger event change to fetch event details
                          handleEventChange({ target: { value: event._id } });
                          setActiveTab('spot-registration');
                        }}
                      >
                        <i className="fas fa-user-plus"></i> Register Participant
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
                  <th>Event</th>
                  <th>Team Leader</th>
                  <th>Team Size</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length > 0 ? (
                  registrations.map(reg => (
                    <tr key={reg._id}>
                      <td>{reg.event?.name || 'Unknown Event'}</td>
                      <td>
                        {reg.teamLeader?.name || 'Unknown'}
                        {reg.spotRegistration ? ' (Spot Registration)' : ''}
                      </td>
                      <td>{reg.teamSize || 1} {reg.teamSize > 1 ? 'members' : 'member'}</td>
                      <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${reg.paymentStatus}`}>
                          {reg.paymentStatus === 'completed' ? 'Paid' :
                            reg.paymentStatus === 'not_required' ? 'Free Event' :
                              reg.paymentStatus === 'pending' ? 'Payment Pending' :
                                reg.paymentStatus === 'failed' ? 'Payment Failed' : 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn view-btn"
                          onClick={() => alert(`Registration details for ${reg.event?.name || 'Unknown Event'}\n\nTeam: ${reg.teamName || 'Individual'}\nTeam Size: ${reg.teamSize || 1}\nCollege: ${reg.teamLeaderDetails?.collegeName || 'Unknown'}`)}
                        >
                          <i className="fas fa-eye"></i> Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No registrations found</td>
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

            {selectedEvent && selectedEvent.fees > 0 && (
              <div className="event-fee-notice">
                <i className="fas fa-info-circle"></i>
                <p>This event has a registration fee of ₹{selectedEvent.fees}. For spot registrations, please collect the payment separately and mark as paid in the system.</p>
              </div>
            )}

            <form onSubmit={handleSpotRegistrationSubmit} className="dashboard-form">
              {/* Event Selection */}
              <div className="form-group">
                <label htmlFor="eventId">Select Event</label>
                <select
                  id="eventId"
                  name="eventId"
                  value={spotRegistrationForm.eventId}
                  onChange={handleEventChange}
                  required
                >
                  <option value="">-- Select Event --</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>
                      {event.name} - {event.category} (Day {event.day || 1})
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Size Selection - Only show if event is selected */}
              {selectedEvent && (
                <div className="form-group">
                  <label htmlFor="teamSize">Team Size</label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={spotRegistrationForm.teamSize}
                    onChange={handleTeamSizeChange}
                    required
                    disabled={teamSizeOptions.length === 1} // Disable if only one option
                  >
                    {teamSizeOptions.map(size => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'Participant' : 'Participants'}
                      </option>
                    ))}
                  </select>
                  {teamSizeOptions.length === 1 && (
                    <div className="form-hint">This event requires exactly {teamSizeOptions[0]} participant(s).</div>
                  )}
                </div>
              )}

              {/* Team Name - Only show for teams with more than 2 members */}
              {spotRegistrationForm.teamSize > 2 && (
                <div className="form-group">
                  <label htmlFor="teamName">Team Name</label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    value={spotRegistrationForm.teamName}
                    onChange={handleCommonFieldChange}
                    required
                    placeholder="Enter team name"
                  />
                </div>
              )}

              {/* Common College Name */}
              <div className="form-group">
                <label htmlFor="commonCollegeName">College Name</label>
                <input
                  type="text"
                  id="commonCollegeName"
                  name="commonCollegeName"
                  value={spotRegistrationForm.commonCollegeName}
                  onChange={handleCommonFieldChange}
                  required
                  placeholder="Enter college name (same for all participants)"
                />
              </div>

              {/* Participant Details */}
              <div className="participants-section">
                <h4>Participant Details</h4>

                {spotRegistrationForm.participants.map((participant, index) => (
                  <div key={index} className="participant-card">
                    <h5>{index === 0 ? 'Team Leader' : `Participant ${index + 1}`}</h5>

                    <div className="participant-form">
                      <div className="form-group">
                        <label htmlFor={`participant-${index}-name`}>Full Name</label>
                        <input
                          type="text"
                          id={`participant-${index}-name`}
                          value={participant.name}
                          onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                          required
                          placeholder="Enter full name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`participant-${index}-email`}>Email</label>
                        <input
                          type="email"
                          id={`participant-${index}-email`}
                          value={participant.email}
                          onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                          required
                          placeholder="Enter email address"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`participant-${index}-mobile`}>Mobile Number</label>
                        <input
                          type="tel"
                          id={`participant-${index}-mobile`}
                          value={participant.mobile}
                          onChange={(e) => handleParticipantChange(index, 'mobile', e.target.value)}
                          required
                          placeholder="Enter 10-digit mobile number"
                          pattern="[0-9]{10}"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`participant-${index}-usn`}>USN</label>
                        <input
                          type="text"
                          id={`participant-${index}-usn`}
                          value={participant.usn}
                          onChange={(e) => handleParticipantChange(index, 'usn', e.target.value)}
                          required
                          placeholder="Enter USN"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="submit-btn">
                <i className="fas fa-user-plus"></i> Complete Registration
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
