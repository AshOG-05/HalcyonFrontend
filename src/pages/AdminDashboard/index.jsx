import { useState, useEffect } from 'react';
import { isAdminLoggedIn, adminLogout } from '../../services/authService';
import { API_URL, EVENT_CATEGORIES } from '../../config';
import EventForm from '../../components/EventForm';
import './styles.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [registrationCategoryFilter, setRegistrationCategoryFilter] = useState('all');
  const [registrationEventFilter, setRegistrationEventFilter] = useState('all');

  // Helper functions for category display
  const getCategoryLabel = (categoryId) => {
    const category = EVENT_CATEGORIES.find(cat => cat.id === (categoryId || 'other'));
    return category ? category.label : 'Other';
  };

  const getCategoryIcon = (categoryId) => {
    const category = EVENT_CATEGORIES.find(cat => cat.id === (categoryId || 'other'));
    return category ? category.icon : 'fas fa-star';
  };

  const getCategoryColor = (categoryId) => {
    // Define colors for each category
    const colors = {
      'dance': 'rgba(255, 99, 132, 0.7)',
      'music': 'rgba(54, 162, 235, 0.7)',
      'gaming': 'rgba(255, 206, 86, 0.7)',
      'theatre': 'rgba(75, 192, 192, 0.7)',
      'finearts': 'rgba(153, 102, 255, 0.7)',
      'literary': 'rgba(255, 159, 64, 0.7)',
      'other': 'rgba(201, 203, 207, 0.7)'
    };

    return colors[categoryId || 'other'] || colors.other;
  };

  useEffect(() => {
    // Check if admin is logged in
    if (!isAdminLoggedIn()) {
      window.location.href = '/RegisterLogin';
      return;
    }

    // Fetch initial data
    fetchUsers();
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminCookie');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/event/`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddEvent = () => {
    setShowEventForm(true);
  };

  const handleEventAdded = (newEvent) => {
    // Add the new event to the events list
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    applyFilters(updatedEvents, categoryFilter, dayFilter);
  };

  const handleCategoryFilterChange = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    applyFilters(events, category, dayFilter);
  };

  const handleDayFilterChange = (e) => {
    const day = e.target.value;
    setDayFilter(day);
    applyFilters(events, categoryFilter, day);
  };

  const applyFilters = (eventsList, category, day) => {
    let filtered = [...eventsList];

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(event => (event.category || 'other') === category);
    }

    // Apply day filter
    if (day !== 'all') {
      filtered = filtered.filter(event => (event.day || 1) === parseInt(day));
    }

    setFilteredEvents(filtered);
  };

  const handleCancelAddEvent = () => {
    setShowEventForm(false);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminCookie');
      const response = await fetch(`${API_URL}/admin/event/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove the event from the state
      const updatedEvents = events.filter(event => event._id !== eventId);
      setEvents(updatedEvents);
      applyFilters(updatedEvents, categoryFilter, dayFilter);

      // Show success message
      alert('Event deleted successfully');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(`Error deleting event: ${err.message}`);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('adminCookie');
      const response = await fetch(`${API_URL}/admin/registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
      setRegistrations(data);
      setFilteredRegistrations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegistrationCategoryFilterChange = (e) => {
    const category = e.target.value;
    setRegistrationCategoryFilter(category);
    applyRegistrationFilters(registrations, category, registrationEventFilter);
  };

  const handleRegistrationEventFilterChange = (e) => {
    const eventId = e.target.value;
    setRegistrationEventFilter(eventId);
    applyRegistrationFilters(registrations, registrationCategoryFilter, eventId);
  };

  const applyRegistrationFilters = (registrationsList, category, eventId) => {
    let filtered = [...registrationsList];

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(reg => {
        // Check if the event exists and has a category
        if (!reg.event) return false;
        return (reg.event.category || 'other') === category;
      });
    }

    // Apply event filter
    if (eventId !== 'all') {
      filtered = filtered.filter(reg => {
        // Check if the event exists
        if (!reg.event) return false;
        return reg.event._id === eventId;
      });
    }

    setFilteredRegistrations(filtered);
  };

  const handleLogout = () => {
    adminLogout();
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error && activeTab !== 'registrations') {
      return <div className="error">{error}</div>;
    }

    switch (activeTab) {
      case 'users':
        return (
          <div className="dashboard-table-container">
            <h3>User Management</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="action-btn edit-btn">Edit</button>
                      <button className="action-btn delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'events':
        return (
          <div className="dashboard-table-container">
            <h3>Event Management</h3>
            {showEventForm ? (
              <EventForm
                onEventAdded={handleEventAdded}
                onCancel={handleCancelAddEvent}
              />
            ) : (
              <div className="event-controls">
                <button className="add-btn" onClick={handleAddEvent}>Add New Event</button>

                <div className="filter-controls">
                  <div className="filter-group">
                    <label htmlFor="categoryFilter">Category:</label>
                    <select
                      id="categoryFilter"
                      value={categoryFilter}
                      onChange={handleCategoryFilterChange}
                    >
                      <option value="all">All Categories</option>
                      {EVENT_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="dayFilter">Day:</label>
                    <select
                      id="dayFilter"
                      value={dayFilter}
                      onChange={handleDayFilterChange}
                    >
                      <option value="all">All Days</option>
                      <option value="1">Day 1</option>
                      <option value="2">Day 2</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="event-count">
              Showing {filteredEvents.length} of {events.length} events
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Category</th>
                  <th>Day</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => (
                  <tr key={event._id}>
                    <td>{event.name}</td>
                    <td>{event.description.substring(0, 50)}...</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.venue}</td>
                    <td>
                      {getCategoryLabel(event.category)}
                      <span className="category-badge" style={{ backgroundColor: getCategoryColor(event.category) }}>
                        <i className={getCategoryIcon(event.category)}></i>
                      </span>
                    </td>
                    <td>Day {event.day || 1}</td>
                    <td>
                      <button className="action-btn edit-btn">Edit</button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
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
            <h3>Registration Management</h3>

            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="registrationCategoryFilter">Category:</label>
                <select
                  id="registrationCategoryFilter"
                  value={registrationCategoryFilter}
                  onChange={handleRegistrationCategoryFilterChange}
                >
                  <option value="all">All Categories</option>
                  {EVENT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="registrationEventFilter">Event:</label>
                <select
                  id="registrationEventFilter"
                  value={registrationEventFilter}
                  onChange={handleRegistrationEventFilterChange}
                >
                  <option value="all">All Events</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>{event.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="event-count">
              Showing {filteredRegistrations.length} of {registrations.length} registrations
            </div>

            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map(reg => (
                    <tr key={reg._id}>
                      <td>{reg.participant?.name || 'Unknown'}</td>
                      <td>{reg.event?.name || 'Unknown'}</td>
                      <td>
                        {reg.event ? (
                          <>
                            {getCategoryLabel(reg.event.category)}
                            <span className="category-badge" style={{ backgroundColor: getCategoryColor(reg.event.category) }}>
                              <i className={getCategoryIcon(reg.event.category)}></i>
                            </span>
                          </>
                        ) : 'Unknown'}
                      </td>
                      <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      <td>
                        <button className="action-btn view-btn">View</button>
                        <button className="action-btn delete-btn">Cancel</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No registrations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Users
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-calendar-alt"></i> Events
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <i className="fas fa-clipboard-list"></i> Registrations
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

export default AdminDashboard;
