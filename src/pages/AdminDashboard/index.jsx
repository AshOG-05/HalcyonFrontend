import { useState, useEffect } from 'react';
import { isAdminLoggedIn, adminLogout } from '../../services/authService';
import { EVENT_CATEGORIES } from '../../config';
import { corsProtectedFetch } from '../../utils/corsHelper';
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
  const [eventToEdit, setEventToEdit] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [registrationCategoryFilter, setRegistrationCategoryFilter] = useState('all');
  const [registrationEventFilter, setRegistrationEventFilter] = useState('all');
  const [pdfCategoryFilter, setPdfCategoryFilter] = useState('all');
  const [pdfEventFilter, setPdfEventFilter] = useState('all');
  const [pdfEvents, setPdfEvents] = useState([]);

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

    // Fetch data with error handling
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUsers();
        await fetchEvents();
        await fetchRegistrations();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminCookie');
      const response = await corsProtectedFetch('admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await corsProtectedFetch('event/');

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
      setPdfEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    }
  };

  const handleAddEvent = () => {
    setEventToEdit(null); // Make sure we're not in edit mode
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setShowEventForm(true);
  };

  const handleEventAdded = (newEvent) => {
    // Add the new event to the events list
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    applyFilters(updatedEvents, categoryFilter, dayFilter);
  };

  const handleEventUpdated = (updatedEvent) => {
    // Update the event in the events list
    const updatedEvents = events.map(event =>
      event._id === updatedEvent._id ? updatedEvent : event
    );
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
    setEventToEdit(null);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminCookie');
      const response = await corsProtectedFetch(`admin/event/${eventId}`, {
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

      // Log the token for debugging (remove in production)
      console.log('Admin token:', token ? 'Token exists' : 'No token found');

      const response = await corsProtectedFetch('admin/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch registrations: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched registrations:', data);

      // Process the data to ensure it matches the expected structure
      const processedData = data.map(reg => {
        // Create a new object with default values
        const processedReg = { ...reg };

        // Handle the case where teamLeader might be null but participant exists
        if (!processedReg.teamLeader && processedReg.participant) {
          processedReg.teamLeader = processedReg.participant;
        }

        // Handle the case where neither exists (provide defaults)
        if (!processedReg.teamLeader) {
          processedReg.teamLeader = { name: 'Unknown', email: 'N/A', mobile: 'N/A' };
        }

        return processedReg;
      });

      setRegistrations(processedData);
      setFilteredRegistrations(processedData);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message);

      // Set empty arrays to prevent undefined errors
      setRegistrations([]);
      setFilteredRegistrations([]);
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

  const handlePdfCategoryFilterChange = (e) => {
    const category = e.target.value;
    setPdfCategoryFilter(category);

    // Filter events by category
    if (category === 'all') {
      setPdfEvents(events);
    } else {
      const filteredEvents = events.filter(event => (event.category || 'other') === category);
      setPdfEvents(filteredEvents);
    }
    // Reset event selection when category changes
    setPdfEventFilter('all');
  };

  const handlePdfEventFilterChange = (e) => {
    const eventId = e.target.value;
    setPdfEventFilter(eventId);
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

    console.log('Filtered registrations:', filtered);
    setFilteredRegistrations(filtered);
  };

  const handleLogout = () => {
    adminLogout();
  };

  // Generate PDF based on selected event
  const handleGeneratePdf = async () => {
    if (pdfEventFilter === 'all') {
      alert('Please select a specific event to generate a PDF report.');
      return;
    }

    // Find the selected event
    const selectedEvent = events.find(event => event._id === pdfEventFilter);

    if (!selectedEvent) {
      alert('Invalid event selection. Please try again.');
      return;
    }

    // Generate PDF for the selected event
    await handleGenerateEventPdf(selectedEvent._id, selectedEvent.name);
  };

  // Generate PDF for a specific event
  const handleGenerateEventPdf = async (eventId, eventName) => {
    try {
      const token = localStorage.getItem('adminCookie');

      // Show loading message
      alert(`Generating PDF report for ${eventName}. This may take a few seconds...`);

      // Use corsProtectedFetch to get the PDF as a blob
      const response = await corsProtectedFetch(`admin/pdf/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate PDF');
        } catch (jsonError) {
          throw new Error('Failed to generate PDF. The server may be experiencing issues.');
        }
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab for preview
      const newWindow = window.open(url, '_blank');

      // If popup is blocked, inform the user
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert('PDF generated successfully! Please allow popups to view it in a new tab.');
      }

      // Create a temporary link element for download
      const a = document.createElement('a');
      a.href = url;

      // Set filename
      const filename = `${eventName.replace(/\s+/g, '_')}_registrations.pdf`;
      a.download = filename;

      // Append to body, click and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Release the URL object after a short delay to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert(`Error generating PDF: ${err.message}`);
    }
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
                onEventUpdated={handleEventUpdated}
                onCancel={handleCancelAddEvent}
                eventToEdit={eventToEdit}
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
                  <th>Team Size</th>
                  <th>Fee (₹)</th>
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
                    <td>{event.teamSize || 1} {event.isVariableTeamSize ? '(Variable)' : ''}</td>
                    <td>{event.fees || 0}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="action-btn pdf-btn"
                        onClick={() => handleGenerateEventPdf(event._id, event.name)}
                        title="Generate PDF of registrations"
                      >
                        <i className="fas fa-file-pdf"></i> PDF
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

            <div className="pdf-generator-section">
              <h4>Generate Registration PDF</h4>
              <div className="pdf-filter-controls">
                <div className="filter-group">
                  <label htmlFor="pdfCategoryFilter">Category:</label>
                  <select
                    id="pdfCategoryFilter"
                    value={pdfCategoryFilter}
                    onChange={handlePdfCategoryFilterChange}
                  >
                    <option value="all">All Categories</option>
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="pdfEventFilter">Event:</label>
                  <select
                    id="pdfEventFilter"
                    value={pdfEventFilter}
                    onChange={handlePdfEventFilterChange}
                  >
                    <option value="all">Select an Event</option>
                    {pdfEvents.map(event => (
                      <option key={event._id} value={event._id}>{event.name}</option>
                    ))}
                  </select>
                </div>

                <button className="generate-pdf-btn" onClick={handleGeneratePdf}>
                  <i className="fas fa-file-pdf"></i> Generate PDF
                </button>
              </div>
              <div className="pdf-help-text">
                <i className="fas fa-info-circle"></i> Select a category and event, then click "Generate PDF" to download a registration report.
              </div>
            </div>

            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error.includes("Cannot populate path `participant`") ? (
                  <>
                    <h3>Backend Model Mismatch</h3>
                    <p>There is a mismatch between the frontend and backend models. The backend is trying to use a field that no longer exists in the schema.</p>
                    <p>Please contact the administrator to update the backend controllers to use 'teamLeader' instead of 'participant'.</p>
                    <div className="code-block">
                      <pre>
                        {`// In adminController.js, update:
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('teamLeader', 'name email mobile')  // Use teamLeader instead of participant
      .populate('event', 'name date venue category day');
    return res.json(registrations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}`}
                      </pre>
                    </div>
                  </>
                ) : (
                  <>
                    {error}
                    <p>Please check your connection and try again. If the problem persists, contact the administrator.</p>
                    <button className="retry-btn" onClick={fetchRegistrations}>
                      <i className="fas fa-sync"></i> Retry
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
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
                      <th>Team Leader</th>
                      <th>Team Name</th>
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
                          <td>{reg.teamLeader?.name || (reg.participant?.name) || 'Unknown'}</td>
                          <td>{reg.teamName || 'N/A'}</td>
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
                          <td>{new Date(reg.registeredAt || reg.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="action-btn view-btn"
                              onClick={() => alert(`Team: ${reg.teamName || 'N/A'}\nLeader: ${reg.teamLeader?.name || (reg.participant?.name) || 'Unknown'}\nContact: ${reg.teamLeader?.mobile || (reg.participant?.mobile) || 'N/A'}\nEmail: ${reg.teamLeader?.email || (reg.participant?.email) || 'N/A'}`)}
                            >
                              View
                            </button>
                            <button className="action-btn delete-btn">Cancel</button>
                            {reg.event && (
                              <button
                                className="action-btn pdf-btn"
                                onClick={() => handleGenerateEventPdf(reg.event._id, reg.event.name)}
                                title="Generate PDF for this event"
                              >
                                <i className="fas fa-file-pdf"></i> PDF
                              </button>
                            )}
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
              </>
            )}
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
