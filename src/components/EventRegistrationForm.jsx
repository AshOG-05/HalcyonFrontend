import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config';
import { corsProtectedFetch } from '../utils/corsHelper';
import './EventRegistrationForm.css';

function EventRegistrationForm({ eventId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [eventName, setEventName] = useState('');

  // User data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  // Form data
  const [teamSize, setTeamSize] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [participants, setParticipants] = useState([
    { name: '', usn: '', mobile: '', email: '', collegeName: '' }
  ]);
  const [teamSizeOptions, setTeamSizeOptions] = useState([1]);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      console.log('Fetching user data from backend...');

      // Get authentication token
      const token = localStorage.getItem(APP_CONFIG.tokenName);
      console.log('Token exists:', !!token);

      if (!token) {
        console.error('No authentication token found in localStorage');
        setError('No authentication token found. Please try logging in again.');
        return null;
      }

      // Make API request to get user data
      console.log('Making API request to auth/me endpoint...');
      const response = await corsProtectedFetch('auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch user data. Status:', response.status, 'Response:', errorText);
        throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('User data fetched successfully:', data);

      // Check if we have the required user data
      if (!data || !data.email) {
        console.error('User data is incomplete:', data);
        throw new Error('User data is incomplete or invalid');
      }

      // Update user data state
      setUserData({
        name: data.name || '',
        email: data.email || '',
        mobile: data.mobile || ''
      });

      // Update the first participant with user data
      const updatedParticipants = [...participants];
      if (updatedParticipants.length > 0) {
        updatedParticipants[0] = {
          ...updatedParticipants[0],
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || ''
        };
        setParticipants(updatedParticipants);
      }

      return data;
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('User data is missing. Please try logging in again.');
      return null;
    }
  };

  // Fetch user data and event details on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting data fetch for event registration form...');
        setLoading(true);
        setError('');

        // First fetch user data from backend
        const userData = await fetchUserData();

        if (!userData) {
          console.error('Failed to fetch user data, stopping form initialization');
          setError('User data is missing. Please try logging in again.');
          setLoading(false);
          return;
        }

        // Then fetch event details
        await fetchEventDetails();

      } catch (err) {
        console.error('Error in registration form initialization:', err);
        setError('Failed to load registration form. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Fetch event details
  const fetchEventDetails = async () => {
    try {
      console.log('Fetching event details for ID:', eventId);
      const response = await corsProtectedFetch(`event/${eventId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch event details. Status:', response.status, 'Response:', errorText);
        throw new Error(`Failed to fetch event details: ${response.status}`);
      }

      const data = await response.json();
      console.log('Event details fetched successfully:', data);
      setEventName(data.name || 'Unknown Event');

      // Set team size options based on event configuration
      if (data.isVariableTeamSize) {
        // If variable team size, provide options from 1 to max team size
        const options = Array.from({ length: data.teamSize }, (_, i) => i + 1);
        setTeamSizeOptions(options);
      } else {
        // If fixed team size, only provide the specified team size
        setTeamSizeOptions([data.teamSize || 1]);
        setTeamSize(data.teamSize || 1);
      }

      // Initialize participants array based on team size and current user data
      const size = data.isVariableTeamSize ? 1 : (data.teamSize || 1);
      const newParticipants = Array.from({ length: size }, (_, i) => {
        // For the first participant (team leader), use the current user data
        if (i === 0) {
          return {
            name: userData.name || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            usn: '',
            collegeName: ''
          };
        }
        // For other participants, create empty fields
        return {
          name: '',
          email: '',
          mobile: '',
          usn: '',
          collegeName: ''
        };
      });

      console.log('Setting initial participants:', newParticipants);
      setParticipants(newParticipants);
    } catch (err) {
      console.error('Error in fetchEventDetails:', err);
      setError('Failed to fetch event details. Please try again.');
    }
  };

  // Handle team size change
  const handleTeamSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setTeamSize(size);

    // Initialize participants array based on new team size
    const newParticipants = Array.from({ length: size }, (_, i) => {
      // Keep existing participant data if available
      return participants[i] || {
        name: '',
        email: '',
        mobile: '',
        usn: '',
        collegeName: ''
      };
    });

    // Set the first participant's data to the current user's data
    if (newParticipants.length > 0 && userData) {
      newParticipants[0] = {
        ...newParticipants[0],
        name: userData.name || '',
        email: userData.email || '',
        mobile: userData.mobile || ''
      };
    }

    setParticipants(newParticipants);
  };

  // Handle participant field changes
  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };
    setParticipants(updatedParticipants);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!userData.name || !userData.email || !userData.mobile) {
      setError('User data is missing. Please try logging in again.');
      return;
    }

    // Validate all participants have required fields
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      if (!participant.name || !participant.usn || !participant.mobile ||
        (i > 0 && (!participant.email || !participant.collegeName))) {
        setError(`All fields for participant ${i + 1} are required`);
        return;
      }
    }

    // Validate team name if team size > 2
    if (teamSize > 2 && !teamName) {
      setError('Team name is required for teams with more than 2 members');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem(APP_CONFIG.tokenName);
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Extract team leader (first participant) and team members (rest of participants)
      const teamLeader = participants[0];
      const teamMembers = participants.slice(1);

      // Prepare registration data according to backend requirements
      const registrationData = {
        teamLeaderDetails: {
          collegeName: teamLeader.collegeName,
          usn: teamLeader.usn
        },
        teamName: teamSize > 2 ? teamName : null,
        teamSize: teamSize,
        teamMembers: teamMembers.map(member => ({
          name: member.name,
          email: member.email,
          mobile: member.mobile,
          usn: member.usn,
          collegeName: member.collegeName
        }))
      };

      // Log the data being sent to ensure it matches the backend model
      console.log('Team leader details:', {
        id: userData.id || 'Not available',
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        collegeName: teamLeader.collegeName,
        usn: teamLeader.usn
      });

      console.log('Sending registration data:', registrationData);

      // Send registration request
      const response = await corsProtectedFetch(`registration/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register for event');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setSuccess(true);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="event-registration-overlay">
        <div className="event-registration-modal">
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <div className="loading">Loading registration form...</div>
        </div>
      </div>
    );
  }

  // Render success state
  if (success) {
    return (
      <div className="event-registration-overlay">
        <div className="event-registration-modal">
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h3>Registration Successful!</h3>
            <p>You have successfully registered for {eventName}.</p>
            <button className="auth-button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-registration-overlay">
      <div className="event-registration-modal">
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <h2>Register for {eventName}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h3>Team Registration</h3>

            {/* Team Size Selection */}
            <div className="form-group">
              <label htmlFor="teamSize">Team Size *</label>
              <select
                id="teamSize"
                value={teamSize}
                onChange={handleTeamSizeChange}
                required
              >
                {teamSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Team Name (required for teams > 2) */}
            {teamSize > 2 && (
              <div className="form-group">
                <label htmlFor="teamName">Team Name *</label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  placeholder="Enter your team name"
                />
              </div>
            )}
          </div>

          {/* Participant Details */}
          <div className="form-section">
            <h3>Participant Details</h3>

            {participants.map((participant, index) => (
              <div key={index} className="team-member">
                <h5>Participant {index + 1} {index === 0 ? '(Team Leader)' : ''}</h5>

                {/* Show user info for team leader (first participant) */}
                {index === 0 && (
                  <div className="user-info">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Mobile:</strong> {userData.mobile}</p>
                  </div>
                )}

                {/* Show name, email, mobile fields for additional participants */}
                {index > 0 && (
                  <>
                    <div className="form-group">
                      <label htmlFor={`participant-${index}-name`}>Name *</label>
                      <input
                        type="text"
                        id={`participant-${index}-name`}
                        value={participant.name}
                        onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                        required
                        placeholder="Enter participant name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`participant-${index}-email`}>Email *</label>
                      <input
                        type="email"
                        id={`participant-${index}-email`}
                        value={participant.email}
                        onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                        required
                        placeholder="Enter participant email"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`participant-${index}-mobile`}>Mobile *</label>
                      <input
                        type="tel"
                        id={`participant-${index}-mobile`}
                        value={participant.mobile}
                        onChange={(e) => handleParticipantChange(index, 'mobile', e.target.value)}
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                        placeholder="Enter participant mobile number"
                      />
                    </div>
                  </>
                )}

                {/* USN field for all participants */}
                <div className="form-group">
                  <label htmlFor={`participant-${index}-usn`}>USN/College ID *</label>
                  <input
                    type="text"
                    id={`participant-${index}-usn`}
                    value={participant.usn}
                    onChange={(e) => handleParticipantChange(index, 'usn', e.target.value)}
                    required
                    placeholder="Enter USN or college ID"
                  />
                </div>

                {/* College Name field for all participants */}
                <div className="form-group">
                  <label htmlFor={`participant-${index}-college`}>College Name *</label>
                  <input
                    type="text"
                    id={`participant-${index}-college`}
                    value={participant.collegeName}
                    onChange={(e) => handleParticipantChange(index, 'collegeName', e.target.value)}
                    required
                    placeholder="Enter college name"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="auth-button"
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Register for Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventRegistrationForm;
