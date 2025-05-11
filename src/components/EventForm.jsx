import { useState, useEffect } from 'react';
import { APP_CONFIG, EVENT_CATEGORIES } from '../config';
import { corsProtectedFetch } from '../utils/corsHelper';
import './EventForm.css';

function EventForm({ onEventAdded, onEventUpdated, onCancel, eventToEdit = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    rules: '',
    prizes: '',
    coordinators: '',
    day: 1, // Default to Day 1
    category: 'other', // Default to Other category
    teamSizeType: 'individual', // Default to individual (options: individual, duo, team)
    teamSize: 1, // Default to 1 participant (used for team type)
    minTeamSize: 1, // Default min team size
    maxTeamSize: 1, // Default max team size
    fees: 0 // Default to free event
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isEditing = !!eventToEdit;

  // Populate form when editing an existing event
  useEffect(() => {
    if (eventToEdit) {
      // Format date and time for form inputs
      const eventDate = new Date(eventToEdit.date);
      const formattedDate = eventDate.toISOString().split('T')[0];
      const formattedTime = eventDate.toTimeString().slice(0, 5);

      // Format rules, prizes, and coordinators for text areas
      const rulesText = eventToEdit.rules ? eventToEdit.rules.join('\n') : '';
      const prizesText = eventToEdit.prizes ? eventToEdit.prizes.join('\n') : '';

      // Format coordinators for text area
      const coordinatorsText = eventToEdit.coordinators
        ? eventToEdit.coordinators.map(c => `${c.name} - ${c.phone}`).join('\n')
        : '';

      // Determine team size type based on the event's team size
      let teamSizeType = 'individual';
      if (eventToEdit.teamSize === 2) {
        teamSizeType = 'duo';
      } else if (eventToEdit.teamSize >= 3) {
        teamSizeType = 'team';
      }

      // Determine if this is a team event
      const isTeamEvent = teamSizeType === 'team';

      // Log the event data being loaded for editing
      console.log('Loading event for editing:', {
        name: eventToEdit.name,
        teamSize: eventToEdit.teamSize,
        minTeamSize: eventToEdit.minTeamSize,
        maxTeamSize: eventToEdit.maxTeamSize,
        minTeamSizeType: typeof eventToEdit.minTeamSize,
        maxTeamSizeType: typeof eventToEdit.maxTeamSize
      });

      // For team events, ensure min and max team sizes are set correctly
      // Always use the explicit minTeamSize and maxTeamSize values if available
      let minSize = isTeamEvent ?
        (typeof eventToEdit.minTeamSize === 'number' ? eventToEdit.minTeamSize :
          (eventToEdit.teamSize || 3)) :
        (teamSizeType === 'duo' ? 2 : 1);

      let maxSize = isTeamEvent ?
        (typeof eventToEdit.maxTeamSize === 'number' ? eventToEdit.maxTeamSize :
          (eventToEdit.teamSize || 10)) : // Use 10 as default max for team events
        (teamSizeType === 'duo' ? 2 : 1);

      // Ensure minSize and maxSize are numbers, not strings
      minSize = parseInt(minSize);
      maxSize = parseInt(maxSize);

      // Ensure maxSize is at least equal to minSize
      if (maxSize < minSize) {
        maxSize = minSize + 7; // Set max to min + 7 to provide a reasonable range
      }

      // For team events, ensure max is different from min to avoid the issue
      if (isTeamEvent && maxSize === minSize) {
        maxSize = minSize + 7; // Add a reasonable range
      }

      console.log('Setting team size values:', { minSize, maxSize });

      // For team events, ensure teamSize matches minTeamSize
      const finalTeamSize = teamSizeType === 'team' ? minSize :
        (teamSizeType === 'duo' ? 2 : 1);

      console.log('Setting form data with team sizes:', {
        teamSizeType,
        finalTeamSize,
        minSize,
        maxSize
      });

      setFormData({
        name: eventToEdit.name || '',
        description: eventToEdit.description || '',
        date: formattedDate,
        time: formattedTime,
        venue: eventToEdit.venue || '',
        rules: rulesText,
        prizes: prizesText,
        coordinators: coordinatorsText,
        day: eventToEdit.day || 1,
        category: eventToEdit.category || 'other',
        teamSizeType: teamSizeType,
        teamSize: finalTeamSize, // Use minSize for team events
        minTeamSize: minSize,
        maxTeamSize: maxSize,
        fees: eventToEdit.fees || 0
      });
    }
  }, [eventToEdit]);

  // Update team size when team size type changes
  useEffect(() => {
    if (formData.teamSizeType === 'individual') {
      setFormData(prev => ({
        ...prev,
        teamSize: 1,
        minTeamSize: 1,
        maxTeamSize: 1
      }));
    } else if (formData.teamSizeType === 'duo') {
      setFormData(prev => ({
        ...prev,
        teamSize: 2,
        minTeamSize: 2,
        maxTeamSize: 2
      }));
    } else if (formData.teamSizeType === 'team') {
      // For team events, set default values with different min and max
      setFormData(prev => {
        // Check if we already have a minTeamSize value to preserve
        const minSize = prev.minTeamSize >= 3 ? prev.minTeamSize : 3;

        // Always ensure teamSize matches minTeamSize for team events
        return {
          ...prev,
          teamSize: minSize, // Set teamSize to match minTeamSize
          minTeamSize: minSize,
          maxTeamSize: Math.max(minSize + 7, prev.maxTeamSize || 10) // Ensure max is greater than min
        };
      });
    }
  }, [formData.teamSizeType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Create a copy of the current form data
    const updatedFormData = { ...formData };

    // Handle checkbox inputs differently
    if (type === 'checkbox') {
      updatedFormData[name] = checked;
    } else if (type === 'number') {
      // For team size fields, handle them specially
      if (name === 'minTeamSize' || name === 'maxTeamSize') {
        // For team size inputs, we need to handle them carefully

        // If the value is empty, don't update yet
        if (value === '') {
          return; // Exit early without updating state
        }

        // Parse the value as an integer
        const parsedValue = parseInt(value);

        // Only update if it's a valid number
        if (!isNaN(parsedValue)) {
          if (name === 'minTeamSize') {
            // For minTeamSize, ensure it's at least 3
            const minValue = Math.max(3, parsedValue);
            updatedFormData.minTeamSize = minValue;

            // For team events, ensure teamSize matches minTeamSize
            if (updatedFormData.teamSizeType === 'team') {
              updatedFormData.teamSize = minValue;
              console.log('Updated teamSize to match minTeamSize:', minValue);
            }

            // Only if min is now greater than max, adjust max
            if (minValue > updatedFormData.maxTeamSize) {
              updatedFormData.maxTeamSize = minValue;
            }
          } else if (name === 'maxTeamSize') {
            // For maxTeamSize, ensure it's at least equal to minTeamSize
            const minValue = updatedFormData.minTeamSize || 3;
            updatedFormData.maxTeamSize = Math.max(minValue, parsedValue);
          }
        } else {
          return; // Exit early for invalid numbers
        }
      } else {
        // For other number inputs, ensure we're storing numbers, not strings
        updatedFormData[name] = parseInt(value) || 0; // Use 0 as fallback if parsing fails
      }
    } else {
      // For all other inputs, just use the value directly
      updatedFormData[name] = value;
    }

    // Update the form data state
    setFormData(updatedFormData);
  };

  // Handle focus to select all text in the input field
  const handleFocus = (e) => {
    // Select all text in the input field when focused
    e.target.select();
  };

  // Handler for direct input on team size fields
  const handleTeamSizeInput = (e) => {
    const { name, value } = e.target;

    // Only process if this is a team size field
    if (name !== 'minTeamSize' && name !== 'maxTeamSize') return;

    // Allow only numeric input
    if (!/^\d*$/.test(value)) {
      e.preventDefault();
      return;
    }
  };

  // Handle blur events for number inputs to ensure valid values
  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Only handle minTeamSize and maxTeamSize fields
    if (name !== 'minTeamSize' && name !== 'maxTeamSize') return;

    const updatedFormData = { ...formData };

    // If the field is empty or invalid, set to appropriate default
    if (value === '' || isNaN(parseInt(value))) {
      if (name === 'minTeamSize') {
        updatedFormData[name] = 3; // Default min team size
      } else if (name === 'maxTeamSize') {
        // Default to either minTeamSize or 3, whichever is larger
        updatedFormData[name] = Math.max(updatedFormData.minTeamSize || 3, 3);
      }

      setFormData(updatedFormData);
      return;
    }

    // For minTeamSize, ensure it's at least 3
    if (name === 'minTeamSize') {
      const parsedValue = parseInt(value);
      if (parsedValue < 3) {
        updatedFormData[name] = 3;

        // For team events, ensure teamSize matches minTeamSize
        if (updatedFormData.teamSizeType === 'team') {
          updatedFormData.teamSize = 3; // Set to minimum allowed value
          console.log('Updated teamSize to match minTeamSize on blur:', 3);
        }

        setFormData(updatedFormData);
      } else if (updatedFormData.teamSizeType === 'team') {
        // Even if the value is valid, ensure teamSize matches minTeamSize for team events
        updatedFormData.teamSize = parsedValue;
        console.log('Updated teamSize to match valid minTeamSize on blur:', parsedValue);
        setFormData(updatedFormData);
      }
    }

    // For maxTeamSize, ensure it's at least equal to minTeamSize
    if (name === 'maxTeamSize') {
      const parsedValue = parseInt(value);
      const minValue = updatedFormData.minTeamSize || 3;

      if (parsedValue < minValue) {
        updatedFormData[name] = minValue;
        setFormData(updatedFormData);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      // Parse rules, prizes, and coordinators from text areas
      const rules = formData.rules.split('\n').filter(rule => rule.trim() !== '');
      const prizes = formData.prizes.split('\n').filter(prize => prize.trim() !== '');

      // Parse coordinators (format: "Name - Phone" on each line)
      const coordinators = formData.coordinators.split('\n')
        .filter(coord => coord.trim() !== '')
        .map(coord => {
          const parts = coord.split('-');
          return {
            name: parts[0]?.trim() || '',
            phone: parts[1]?.trim() || ''
          };
        });

      // Determine team size based on teamSizeType
      let finalTeamSize = 1;
      if (formData.teamSizeType === 'individual') {
        finalTeamSize = 1;
      } else if (formData.teamSizeType === 'duo') {
        finalTeamSize = 2;
      } else if (formData.teamSizeType === 'team') {
        finalTeamSize = parseInt(formData.teamSize);
      }

      // Create event data object
      const eventData = {
        name: formData.name,
        description: formData.description,
        date: dateTime.toISOString(),
        venue: formData.venue,
        rules: rules,
        prizes: prizes,
        coordinators: coordinators,
        day: parseInt(formData.day), // Make sure it's a number
        category: formData.category,
        teamSize: finalTeamSize, // Use the calculated team size
        fees: parseInt(formData.fees), // Make sure it's a number
        // Always use min and max team sizes
        minTeamSize: formData.teamSizeType === 'team' ?
          parseInt(formData.minTeamSize) : finalTeamSize,
        maxTeamSize: formData.teamSizeType === 'team' ?
          parseInt(formData.maxTeamSize) : finalTeamSize
      };

      // Log the event data for debugging
      console.log('Sending event data:', eventData);
      console.log('Team size type:', formData.teamSizeType);
      console.log('Min team size:', formData.minTeamSize);
      console.log('Max team size:', formData.maxTeamSize);

      // Get admin token
      const token = localStorage.getItem(APP_CONFIG.adminTokenName);

      let endpoint, method;
      if (isEditing) {
        // Update existing event
        endpoint = `admin/event/${eventToEdit._id}`;
        method = 'PUT';
      } else {
        // Create new event
        endpoint = 'event/';
        method = 'POST';
      }

      // Send request to create or update event
      const response = await corsProtectedFetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} event`);
      }

      // Success
      setSuccess(true);

      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          rules: '',
          prizes: '',
          coordinators: '',
          day: 1,
          category: 'other',
          teamSizeType: 'individual',
          teamSize: 1, // Default for individual
          minTeamSize: 1,
          maxTeamSize: 1,
          fees: 0
        });
      }

      // Notify parent component
      if (isEditing && onEventUpdated) {
        onEventUpdated(data);
      } else if (!isEditing && onEventAdded) {
        onEventAdded(data);
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        if (onCancel) {
          onCancel();
        }
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <h3>{isEditing ? 'Edit Event' : 'Add New Event'}</h3>

      {error && <div className="event-form-error">{error}</div>}
      {success && <div className="event-form-success">Event {isEditing ? 'updated' : 'created'} successfully!</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter event name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter event description"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="day">Event Day</label>
            <select
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              required
            >
              <option value="1">Day 1</option>
              <option value="2">Day 2</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Event Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {EVENT_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            placeholder="Enter event venue"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rules">Rules (one per line)</label>
          <textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            placeholder="Enter event rules (one per line)"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="prizes">Prizes (one per line)</label>
          <textarea
            id="prizes"
            name="prizes"
            value={formData.prizes}
            onChange={handleChange}
            placeholder="Enter prizes (one per line)"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="coordinators">Coordinators (Name - Phone, one per line)</label>
          <textarea
            id="coordinators"
            name="coordinators"
            value={formData.coordinators}
            onChange={handleChange}
            placeholder="Enter coordinators (format: Name - Phone, one per line)"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="teamSizeType">Participation Type</label>
          <select
            id="teamSizeType"
            name="teamSizeType"
            value={formData.teamSizeType}
            onChange={handleChange}
            required
          >
            <option value="individual">Individual (1 participant)</option>
            <option value="duo">Duo (2 participants)</option>
            <option value="team">Team (3+ participants)</option>
          </select>
        </div>

        {formData.teamSizeType === 'team' && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minTeamSize">Minimum Team Size</label>
              <input
                type="number"
                id="minTeamSize"
                name="minTeamSize"
                min="3"
                max="30"
                value={formData.minTeamSize}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onClick={handleFocus}
                onInput={handleTeamSizeInput}
                step="1"
                required
                className={formData.minTeamSize < 3 ? 'input-error' : ''}
              />
              <p className="field-note">Minimum number of participants allowed (at least 3)</p>
            </div>

            <div className="form-group">
              <label htmlFor="maxTeamSize">Maximum Team Size</label>
              <input
                type="number"
                id="maxTeamSize"
                name="maxTeamSize"
                min={formData.minTeamSize}
                max="30"
                value={formData.maxTeamSize}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onClick={handleFocus}
                onInput={handleTeamSizeInput}
                step="1"
                required
                className={formData.maxTeamSize < formData.minTeamSize ? 'input-error' : ''}
              />
              <p className="field-note">Maximum number of participants allowed (at least equal to minimum)</p>
            </div>
          </div>
        )}

        {/* Display current team size configuration for debugging */}
        {formData.teamSizeType === 'team' && (
          <div className="form-group">
            <div className="team-size-info">
              <p>Current team size configuration:</p>
              <ul>
                <li>Minimum team size: {formData.minTeamSize}</li>
                <li>Maximum team size: {formData.maxTeamSize}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="fees">Registration Fee (₹)</label>
          <input
            type="number"
            id="fees"
            name="fees"
            min="0"
            value={formData.fees}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update Event' : 'Create Event')
            }
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
