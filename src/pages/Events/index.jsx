import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, EVENT_CATEGORIES } from '../../config';
import './styles.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/event`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);

      // Group events by category
      const eventsByCategory = data.reduce((acc, event) => {
        const category = event.category || 'other';
        if (!acc[category]) {
          // Find the category info from EVENT_CATEGORIES
          const categoryInfo = EVENT_CATEGORIES.find(cat => cat.id === category) || {
            id: category,
            label: category.charAt(0).toUpperCase() + category.slice(1),
            icon: 'fas fa-star'
          };

          acc[category] = {
            id: category,
            title: categoryInfo.label,
            icon: categoryInfo.icon,
            events: [],
            description: `Explore all ${categoryInfo.label.toLowerCase()} events at Halcyon 2025`
          };
        }

        acc[category].events.push(event);
        return acc;
      }, {});

      // Convert to array and sort alphabetically by title
      const categoriesArray = Object.values(eventsByCategory).sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      setCategories(categoriesArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <h1 className="events-title">Event Categories</h1>
      <p className="events-subtitle">Explore events by category at Halcyon 2025</p>

      {categories.length === 0 ? (
        <div className="no-events">No categories found. Check back later!</div>
      ) : (
        <div className="events-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-icon">
                <i className={category.icon}></i>
              </div>
              <h3 className="category-name">{category.title}</h3>
              <p className="category-count">
                {category.events.length} event{category.events.length !== 1 ? 's' : ''}
              </p>
              <p className="category-description">
                {category.description}
              </p>
              <Link to={`/events/${category.id}`} className="category-details-btn">
                View Events
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
