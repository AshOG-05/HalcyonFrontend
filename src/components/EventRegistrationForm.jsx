import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config';
import { corsProtectedFetch } from '../utils/corsHelper';
import PaymentInstructions from './PaymentInstructions';
import './EventRegistrationForm.css';

function EventRegistrationForm({ eventId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventFee, setEventFee] = useState(0);
  const [eventCategory, setEventCategory] = useState('');
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionIdValid, setTransactionIdValid] = useState(null);

  // User data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  // Form data
  const [teamSize, setTeamSize] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [commonCollegeName, setCommonCollegeName] = useState('');
  const [participants, setParticipants] = useState([
    { name: '', usn: '', mobile: '', email: '', collegeName: '' }
  ]);
  const [teamSizeOptions, setTeamSizeOptions] = useState([1]);
  const [sameEmailForAll, setSameEmailForAll] = useState(false);

  // Check if USN belongs to Siddaganga Institute of Technology
  const isSITStudent = (usn) => {
    if (!usn || typeof usn !== 'string') return false;
    return usn.toLowerCase().startsWith('1si');
  };

  // Check if any team member is from SIT (for payment exemption)
  const hasAnySITStudent = () => {
    return participants.some(participant => isSITStudent(participant.usn));
  };

  // Check if team is from the same college (SIT)
  const isFromSameCollege = () => {
    return hasAnySITStudent();
  };

  // Check if event is a gaming event
  const isGamingEvent = () => {
    return eventCategory === 'gaming';
  };

  // Determine payment requirement based on college affiliation and event type
  const getPaymentRequirement = () => {
    const fromSameCollege = isFromSameCollege();
    const isGaming = isGamingEvent();

    if (!fromSameCollege) {
      // Other college students: require online payment via ERP
      return {
        type: 'online_payment_required',
        message: 'One payment per team is required via ERP portal before registration. Only the team leader needs to complete the payment. Other teammates do not need to pay.',
        showTransactionField: true,
        exemptFromFee: false
      };
    } else if (fromSameCollege && isGaming) {
      // Same college + gaming events: require online payment via ERP
      return {
        type: 'online_payment_required',
        message: 'One payment per team is required for gaming events via ERP portal. Only the team leader needs to complete the payment. Other teammates do not need to pay.',
        showTransactionField: true,
        exemptFromFee: false
      };
    } else {
      // Same college + non-gaming events: current SIT exemption logic
      return {
        type: 'sit_exemption',
        message: 'As students of Siddaganga Institute of Technology, your team is exempt from the registration fee for non-gaming events.',
        showTransactionField: false,
        exemptFromFee: true
      };
    }
  };

  // Check if user is already registered for this event
  const checkExistingRegistration = async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.tokenName);
      if (!token) {
        return false;
      }

      console.log('Checking existing registration for event:', eventId);
      const response = await corsProtectedFetch(`registration/check/${eventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration check response:', data);

        if (data.isRegistered) {
          setAlreadyRegistered(true);
          setRegistrationDetails(data.registrationDetails || null);
          return true;
        }
      } else if (response.status === 404) {
        // User is not registered for this event
        console.log('User is not registered for this event');
        return false;
      } else {
        console.error('Failed to check registration status:', response.status);
      }

      return false;
    } catch (err) {
      console.error('Error checking existing registration:', err);
      return false;
    }
  };

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

        // Finally check if user is already registered
        await checkExistingRegistration();

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
      console.log('Team size details:', {
        teamSize: data.teamSize,
        minTeamSize: data.minTeamSize,
        maxTeamSize: data.maxTeamSize
      });
      setEventName(data.name || 'Unknown Event');
      setEventFee(data.fees || 0);
      setEventCategory(data.category || 'other');

      // Check if registration is open for this event
      if (data.registrationOpen === false) {
        console.log('Registration is closed for this event');
        setRegistrationClosed(true);
        return;
      }

      // Set team size options based on event configuration
      console.log('Setting team size options with data:', {
        teamSize: data.teamSize,
        minTeamSize: data.minTeamSize,
        maxTeamSize: data.maxTeamSize
      });

      // For team events (3+ participants), always use min and max team sizes
      if (data.teamSize >= 3) {
        // Get min and max team sizes, ensuring they're properly parsed as integers
        // Use explicit checks to handle zero values correctly
        const minSize = data.minTeamSize !== undefined && data.minTeamSize !== null ?
          parseInt(data.minTeamSize) : (parseInt(data.teamSize) || 3);

        const maxSize = data.maxTeamSize !== undefined && data.maxTeamSize !== null ?
          parseInt(data.maxTeamSize) : (parseInt(data.teamSize) || 3);

        console.log('Team event detected with min size:', minSize, 'and max size:', maxSize);
        console.log('Raw values from backend:', {
          minTeamSize: data.minTeamSize,
          maxTeamSize: data.maxTeamSize,
          teamSize: data.teamSize
        });

        // Generate options from min to max (not from 1)
        // Make sure maxSize is greater than or equal to minSize
        if (maxSize < minSize) {
          console.error('Error: maxSize is less than minSize', { minSize, maxSize });
          // Default to just the minSize if there's an issue
          setTeamSizeOptions([minSize]);
        } else {
          // Create an array of options from minSize to maxSize
          const options = [];
          for (let i = minSize; i <= maxSize; i++) {
            options.push(i);
          }
          console.log('Team size options for team event:', options);
          setTeamSizeOptions(options);
        }
        setTeamSize(minSize); // Default to minimum team size
      } else {
        // If fixed team size (individual or duo), only provide the specified team size
        setTeamSizeOptions([data.teamSize || 1]);
        setTeamSize(data.teamSize || 1);

        // Log team size options for debugging
        console.log('Team size options for individual/duo event:', [data.teamSize || 1]);
      }

      // Initialize participants array based on team size and current user data
      // For team events, use the minimum team size; otherwise use the exact team size
      const size = data.teamSize >= 3 ?
        (data.minTeamSize !== undefined && data.minTeamSize !== null ?
          parseInt(data.minTeamSize) : parseInt(data.teamSize) || 3) :
        (data.teamSize || 1);

      // Log the selected size for debugging
      console.log('Initial team size selected:', size);
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
    console.log('Team size changed to:', size);

    // Validate the size is within the available options
    if (!teamSizeOptions.includes(size)) {
      console.error('Selected team size is not in available options:', size, teamSizeOptions);
      // Use the first available option as fallback
      const fallbackSize = teamSizeOptions.length > 0 ? teamSizeOptions[0] : 1;
      console.log('Using fallback size:', fallbackSize);
      setTeamSize(fallbackSize);
      return;
    }

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

    console.log('Updated participants array for team size', size, ':', newParticipants);
    setParticipants(newParticipants);

    // Reset the "same email for all" checkbox when team size changes
    if (size <= 1) {
      setSameEmailForAll(false);
    }

    // If team size is > 1, make sure we have a team name field
    if (size > 1 && !teamName) {
      setTeamName('Team ' + (userData.name?.split(' ')[0] || 'Default'));
    }
  };

  // Handle participant field changes
  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };

    // If "same email for all" is enabled and we're updating the team leader's email,
    // update all other participants' emails as well
    if (sameEmailForAll && index === 0 && field === 'email') {
      for (let i = 1; i < updatedParticipants.length; i++) {
        updatedParticipants[i] = {
          ...updatedParticipants[i],
          email: value
        };
      }
    }

    setParticipants(updatedParticipants);
  };

  // Handle "same email for all" checkbox change
  const handleSameEmailChange = (checked) => {
    setSameEmailForAll(checked);

    if (checked && participants.length > 1) {
      // Copy team leader's email to all other participants
      const teamLeaderEmail = userData.email || participants[0]?.email || '';
      const updatedParticipants = [...participants];

      for (let i = 1; i < updatedParticipants.length; i++) {
        updatedParticipants[i] = {
          ...updatedParticipants[i],
          email: teamLeaderEmail
        };
      }

      setParticipants(updatedParticipants);
    }
  };

  // Handle transaction ID change with validation
  const handleTransactionIdChange = (value) => {
    const upperValue = value.toUpperCase();
    setTransactionId(upperValue);

    if (upperValue.length === 0) {
      setTransactionIdValid(null);
    } else if (upperValue.length === 14) {
      const transactionIdRegex = /^[A-Za-z0-9]{14}$/;
      setTransactionIdValid(transactionIdRegex.test(upperValue));
    } else {
      setTransactionIdValid(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!userData.name || !userData.email || !userData.mobile) {
      setError('User data is missing. Please try logging in again.');
      return;
    }

    // Validate common college name
    if (!commonCollegeName) {
      setError('Please enter the college name');
      return;
    }

    // Validate all participants have required fields
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];

      if (i === 0) {
        // Team leader validation - only check USN as other fields come from userData
        if (!participant.usn) {
          setError(`Please fill in USN for team leader`);
          return;
        }
      } else {
        // Other team members validation - check all fields except collegeName
        if (!participant.name || !participant.email || !participant.mobile || !participant.usn) {
          setError(`All fields for participant ${i + 1} are required`);
          return;
        }
      }
    }

    // Validate team name if team size > 1
    if (teamSize > 1 && !teamName.trim()) {
      setError('Team name is required for team events');
      return;
    }

    // Validate transaction ID if payment is required
    const paymentReq = getPaymentRequirement();
    if (eventFee > 0 && paymentReq.showTransactionField) {
      if (!transactionId.trim()) {
        setError('Transaction Refernce Number is required for paid events. Please complete team payment first.');
        return;
      }

      // Validate transaction ID format: 14 alphanumeric characters
      const transactionIdRegex = /^[A-Za-z0-9]{14}$/;
      if (!transactionIdRegex.test(transactionId.trim())) {
        setError('Invalid Transaction Refernce Number format. It should be exactly 14 alphanumeric characters (e.g., JCIT1234567890, ABC123DEF45678)');
        return;
      }
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
          collegeName: commonCollegeName,
          usn: teamLeader.usn
        },
        teamName: teamSize > 1 ? teamName.trim() : null,
        teamSize: parseInt(teamSize, 10), // Ensure teamSize is a number
        teamMembers: teamMembers.map(member => ({
          name: member.name,
          email: member.email,
          mobile: member.mobile,
          usn: member.usn,
          collegeName: commonCollegeName
        })),
        transactionId: paymentReq.showTransactionField ? transactionId.trim() : null
      };

      // Reset payment error state
      setPaymentError(false);

      console.log('Team leader details:', {
        id: userData.id || 'Not available',
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        collegeName: commonCollegeName,
        usn: teamLeader.usn
      });

      console.log('Sending registration data:', registrationData);
      console.log('Team size type:', typeof registrationData.teamSize, 'Value:', registrationData.teamSize);
      console.log('Team name:', registrationData.teamName, 'Type:', typeof registrationData.teamName);

      // Send registration request directly (payment processing bypassed)
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
        console.error('Registration failed with error:', errorData);

        // Handle specific error cases
        if (response.status === 409 && errorData.alreadyRegistered) {
          // Handle duplicate registration
          console.log('Duplicate registration detected:', errorData);
          setAlreadyRegistered(true);
          setRegistrationDetails({
            registrationDate: errorData.registrationDate,
            registrationId: errorData.registrationId,
            teamName: 'Previously registered',
            teamSize: 1
          });
          setError('You have already registered for this event. Duplicate registrations are not allowed.');
          return;
        } else if (errorData.error && errorData.error.includes('payment')) {
          // Don't throw payment errors since payment is bypassed
          console.log('Payment-related error bypassed:', errorData.error);
        } else {
          // Handle validation errors with more specific messages
          if (errorData.details && Array.isArray(errorData.details)) {
            throw new Error(`Registration validation failed: ${errorData.details.join(', ')}`);
          } else {
            throw new Error(errorData.error || errorData.message || 'Failed to register for event');
          }
        }
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setSuccess(true);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      // Handle errors appropriately
      if (err.message && err.message.includes('Payment service is not available')) {
        // Handle payment service unavailability specifically
        setPaymentError(true);
        setError(err.message);
      } else if (err.message && err.message.toLowerCase().includes('payment')) {
        // Skip payment-related errors since payment is bypassed
        console.log('Payment error bypassed:', err.message);
        // Try to proceed with registration anyway
        setSuccess(true);
        if (onSuccess) {
          onSuccess({ message: 'Registration completed (payment bypassed)' });
        }
      } else {
        // Handle other errors
        setError(err.message || 'An error occurred during registration');
      }
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle payment instructions modal
  const handleClosePaymentInstructions = () => {
    setShowPaymentInstructions(false);
  };

  const handleProceedToERP = () => {
    // Open ERP portal in a new tab
    window.open('https://erp.sit.ac.in', '_blank');
    setShowPaymentInstructions(false);
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

  // Render registration closed state
  if (registrationClosed) {
    return (
      <div className="event-registration-overlay">
        <div className="event-registration-modal">
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <div className="registration-closed">
            <i className="fas fa-lock registration-closed-icon"></i>
            <h3>Registration Closed</h3>
            <p>Registration for {eventName} is currently closed.</p>
            <p>Please check back later or contact the event organizers for more information.</p>
            <button className="auth-button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Render already registered state
  if (alreadyRegistered) {
    return (
      <div className="event-registration-overlay">
        <div className="event-registration-modal">
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <div className="already-registered">
            <i className="fas fa-check-circle already-registered-icon"></i>
            <h3>Already Registered</h3>
            <p>You have already registered for <strong>{eventName}</strong>.</p>

            {registrationDetails && (
              <div className="registration-summary">
                <h4>Registration Details:</h4>
                <div className="detail-item">
                  <strong>Team Name:</strong> {registrationDetails.teamName || 'Individual Registration'}
                </div>
                <div className="detail-item">
                  <strong>Team Size:</strong> {registrationDetails.teamSize || 1} participant(s)
                </div>
                <div className="detail-item">
                  <strong>Registration Date:</strong> {registrationDetails.registrationDate ?
                    new Date(registrationDetails.registrationDate).toLocaleDateString() : 'N/A'}
                </div>
                {registrationDetails.transactionId && (
                  <div className="detail-item">
                    <strong>Transaction Refernce Number:</strong> {registrationDetails.transactionId}
                  </div>
                )}
              </div>
            )}

            <p className="info-text">
              If you need to make changes to your registration, please contact the event organizers.
            </p>
            <button className="auth-button" onClick={onClose}>Close</button>
          </div>
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
            <div className="form-actions">
              <button className="auth-button" onClick={onClose}>Close</button>
            </div>
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

        {paymentError && (
          <div className="payment-error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Payment Required</h3>
            <p>This event requires payment. Please complete payment on the ERP portal and then try registering again.</p>
            <p className="support-contact">ERP Portal: erp.sit.ac.in</p>
          </div>
        )}

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
                className="team-size-select"
              >
                {teamSizeOptions.length > 0 ? (
                  teamSizeOptions.map(size => (
                    <option key={size} value={size}>{size} {size === 1 ? 'Participant' : 'Participants'}</option>
                  ))
                ) : (
                  <option value="1">1 Participant</option> // Fallback option if no options are available
                )}
              </select>
              {teamSizeOptions.length > 1 && (
                <p className="field-note">Select the number of participants in your team (from {Math.min(...teamSizeOptions)} to {Math.max(...teamSizeOptions)})</p>
              )}
              {teamSizeOptions.length === 1 && (
                <p className="field-note">This event requires exactly {teamSizeOptions[0]} participant(s)</p>
              )}
            </div>

            {/* Team Name (required for teams > 1) */}
            {teamSize > 1 && (
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
                <p className="field-note">Choose a unique name for your team</p>
              </div>
            )}

            {/* Same Email for All Members Checkbox (only for teams > 1) */}
            {teamSize > 1 && (
              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={sameEmailForAll}
                      onChange={(e) => handleSameEmailChange(e.target.checked)}
                    />
                    <span className="checkbox-text">
                      <i className="fas fa-envelope"></i>
                      Use the same email address for all team members
                    </span>
                  </label>
                  <p className="field-note">
                    When enabled, all team members will use the team leader's email address ({userData.email})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Participant Details */}
          <div className="form-section">
            <h3>Participant Details</h3>

            {/* Common College Name for all participants */}
            <div className="form-group highlight-field">
              <label htmlFor="common-college-name">College Name (for all participants) *</label>
              <input
                type="text"
                id="common-college-name"
                value={commonCollegeName}
                onChange={(e) => setCommonCollegeName(e.target.value)}
                required
                placeholder="Enter college name"
              />
              <p className="field-note">All participants will be registered with this college name</p>
            </div>

            {participants.map((participant, index) => (
              <div key={index} className="team-member">
                <h5>Participant {index + 1} {index === 0 ? '(Team Leader)' : ''}</h5>

                {/* Show user info for team leader (first participant) */}
                {index === 0 && (
                  <div className="user-info">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Mobile:</strong> {userData.mobile}</p>
                    <p className="required-fields-note">Please fill in the USN field below</p>
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
                      <label htmlFor={`participant-${index}-email`}>
                        Email *
                        {sameEmailForAll && (
                          <span className="field-status">
                            <i className="fas fa-link"></i> Using team leader's email
                          </span>
                        )}
                      </label>
                      <input
                        type="email"
                        id={`participant-${index}-email`}
                        value={participant.email}
                        onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                        disabled={sameEmailForAll}
                        required
                        placeholder={sameEmailForAll ? "Using team leader's email" : "Enter participant email"}
                        className={sameEmailForAll ? 'disabled-field' : ''}
                      />
                      {sameEmailForAll && (
                        <p className="field-note">
                          <i className="fas fa-info-circle"></i>
                          This field is automatically filled with the team leader's email
                        </p>
                      )}
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
                <div className={`form-group ${index === 0 ? 'highlight-field' : ''}`}>
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


              </div>
            ))}

            {/* Payment section - moved to the end after all team member details */}
            {eventFee > 0 && (
              <div className="form-section">
                <h3>Payment Information</h3>
                <div className="payment-section">
                  {(() => {
                    const paymentReq = getPaymentRequirement();

                    if (paymentReq.type === 'sit_exemption') {
                      return (
                        <div className="sit-student-notice">
                          <div className="sit-exemption-info">
                            <h4><i className="fas fa-graduation-cap"></i> Payment Exemption</h4>
                            <p className="exemption-message">
                              <i className="fas fa-check-circle"></i>
                              <strong>No payment required!</strong>
                            </p>
                            <p>{paymentReq.message}</p>
                            <p className="fee-info">Team Registration Fee: <span style={{textDecoration: 'line-through'}}>₹{eventFee}</span> <strong style={{color: 'green'}}>FREE</strong></p>
                          </div>
                        </div>
                      );
                    } else if (paymentReq.type === 'online_payment_required') {
                      return (
                        <div className="payment-required">
                          <h4><i className="fas fa-credit-card"></i> Team Payment Required</h4>
                          <p>Team Registration Fee: <strong>₹{eventFee}</strong> <span className="payment-note">(One payment covers the entire team)</span></p>
                          <p>{paymentReq.message}</p>

                          <div className="payment-steps">
                            <div className="step">
                              <span className="step-number">1</span>
                              <span>Complete team payment on ERP portal</span>
                              <button
                                type="button"
                                className="payment-instructions-button"
                                onClick={() => setShowPaymentInstructions(true)}
                              >
                                <i className="fas fa-info-circle"></i>
                                View Payment Instructions
                              </button>
                            </div>
                            <div className="step">
                              <span className="step-number">2</span>
                              <span>Enter your Transaction Refernce Number below</span>
                            </div>
                          </div>

                          <div className="transaction-form">
                            <div className="form-group">
                              <label htmlFor="transaction-id">Transaction Refernce Number *</label>
                              <input
                                type="text"
                                id="transaction-id"
                                value={transactionId}
                                onChange={(e) => handleTransactionIdChange(e.target.value)}
                                placeholder="Ex: JCIT1234567890"
                                maxLength="14"
                                className={transactionIdValid === true ? 'valid-input' : transactionIdValid === false ? 'invalid-input' : ''}
                                required
                              />
                              {transactionIdValid === true && (
                                <p className="validation-message success">
                                  <i className="fas fa-check-circle"></i> Valid Transaction Refernce Number format
                                </p>
                              )}
                              {transactionIdValid === false && (
                                <p className="validation-message error">
                                  <i className="fas fa-exclamation-circle"></i> Invalid format. Must be exactly 14 alphanumeric characters
                                </p>
                              )}
                              <p className="field-note">
                                Enter the Transaction Refernce Number you received after completing payment on ERP portal
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // Default case for any other paid events
                      return (
                        <div className="payment-info">
                          <h4><i className="fas fa-credit-card"></i> Team Payment Required</h4>
                          <p>Team Registration Fee: <strong>₹{eventFee}</strong> <span className="payment-note">(One payment covers the entire team)</span></p>
                          <p>Payment is required for this event. Only the team leader needs to complete the payment.</p>
                          <button
                            type="button"
                            className="payment-instructions-button"
                            onClick={() => setShowPaymentInstructions(true)}
                          >
                            <i className="fas fa-info-circle"></i>
                            View Payment Instructions
                          </button>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="register-button"
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Register for Event'}
            </button>
          </div>
        </form>
      </div>

      {/* Payment Instructions Modal */}
      {showPaymentInstructions && (
        <PaymentInstructions
          eventName={eventName}
          eventFee={eventFee}
          onClose={handleClosePaymentInstructions}
          onProceedToERP={handleProceedToERP}
        />
      )}
    </div>
  );
}

export default EventRegistrationForm;
