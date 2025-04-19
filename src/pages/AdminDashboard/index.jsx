import { useState, useEffect } from 'react';
import { isAdminLoggedIn, adminLogout } from '../../services/authService';
import { API_URL } from '../../config';
import EventForm from '../../components/EventForm';
import './styles.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);

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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddEvent = () => {
    setShowEventForm(true);
  };

  const handleEventAdded = (newEvent) => {
    // Add the new event to the events list
    setEvents([...events, newEvent]);
  };

  const handleCancelAddEvent = () => {
    setShowEventForm(false);
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
    } catch (err) {
      setError(err.message);
    }
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
              <button className="add-btn" onClick={handleAddEvent}>Add New Event</button>
            )}
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
                      <button className="action-btn edit-btn">Edit</button>
                      <button className="action-btn delete-btn">Delete</button>
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
                        <button className="action-btn delete-btn">Cancel</button>
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
