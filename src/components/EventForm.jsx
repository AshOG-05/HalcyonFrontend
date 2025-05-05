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
    isVariableTeamSize: false, // Default to fixed team size
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
        teamSize: eventToEdit.teamSize >= 3 ? eventToEdit.teamSize : 3, // Default to 3 for team type
        isVariableTeamSize: eventToEdit.isVariableTeamSize || false,
        fees: eventToEdit.fees || 0
      });
    }
  }, [eventToEdit]);

  // Update team size when team size type changes
  useEffect(() => {
    if (formData.teamSizeType === 'individual') {
      setFormData(prev => ({ ...prev, teamSize: 1 }));
    } else if (formData.teamSizeType === 'duo') {
      setFormData(prev => ({ ...prev, teamSize: 2 }));
    } else if (formData.teamSizeType === 'team' && formData.teamSize < 3) {
      setFormData(prev => ({ ...prev, teamSize: 3 }));
    }
  }, [formData.teamSizeType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs differently
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
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
        isVariableTeamSize: formData.teamSizeType === 'team' ? formData.isVariableTeamSize : false,
        fees: parseInt(formData.fees) // Make sure it's a number
      };

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
          teamSize: 3, // Default for team type
          isVariableTeamSize: false,
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
              <label htmlFor="teamSize">Team Size</label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                min="3"
                max="30"
                value={formData.teamSize}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isVariableTeamSize"
                  checked={formData.isVariableTeamSize}
                  onChange={(e) => setFormData({
                    ...formData,
                    isVariableTeamSize: e.target.checked
                  })}
                />
                Allow variable team size (up to the maximum)
              </label>
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
