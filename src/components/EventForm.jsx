import { useState } from 'react';
import { API_URL, APP_CONFIG } from '../config';
import './EventForm.css';

function EventForm({ onEventAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    rules: '',
    prizes: '',
    coordinators: '',
    day: 1 // Default to Day 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

      // Create event data object
      const eventData = {
        name: formData.name,
        description: formData.description,
        date: dateTime.toISOString(),
        venue: formData.venue,
        rules: rules,
        prizes: prizes,
        coordinators: coordinators,
        day: parseInt(formData.day) // Make sure it's a number
      };

      // Get admin token
      const token = localStorage.getItem(APP_CONFIG.adminTokenName);

      // Send request to create event
      const response = await fetch(`${API_URL}/event/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      // Success
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        rules: '',
        prizes: '',
        coordinators: '',
        day: 1
      });

      // Notify parent component
      if (onEventAdded) {
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
      <h3>Add New Event</h3>

      {error && <div className="event-form-error">{error}</div>}
      {success && <div className="event-form-success">Event created successfully!</div>}

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
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
