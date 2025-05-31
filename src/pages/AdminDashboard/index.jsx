import React, { useState, useEffect } from 'react';
import { isAdminLoggedIn, adminLogout } from '../../services/authService';
import { EVENT_CATEGORIES } from '../../config';
import { corsProtectedFetch } from '../../utils/corsHelper';
import EventForm from '../../components/EventForm';
import './styles.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminDashboard Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: '#0f172a',
          color: '#f8fafc',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ marginBottom: '1rem' }}>The admin dashboard encountered an error.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#38bdf8',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          {this.state.error && (
            <details style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
              <summary>Error Details</summary>
              <pre style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

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
  const [debugMode, setDebugMode] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Enhanced search and filter states for registrations
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterEvent, setFilterEvent] = useState("");

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
    console.log('AdminDashboard component mounted');

    // Check for debug mode (for testing purposes)
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.get('debug') === 'true';
    setDebugMode(isDebug);

    // For debug mode, create a temporary admin token
    if (isDebug) {
      console.log('Debug mode enabled - creating temporary admin token');
      localStorage.setItem('adminCookie', 'debug-token-123');
    }

    // Check if admin is logged in
    if (!isAdminLoggedIn()) {
      console.log('Admin not logged in, redirecting to login page');
      if (!isDebug) {
        window.location.href = '/RegisterLogin';
        return;
      }
    }

    console.log('Admin is logged in, fetching dashboard data');

    // Fetch data with error handling
    const fetchData = async () => {
      setLoading(true);
      setError(''); // Clear any previous errors
      try {
        console.log('Starting to fetch dashboard data...');

        // In debug mode, use mock data if API fails
        if (isDebug) {
          try {
            await fetchUsers();
            await fetchEvents();
            await fetchRegistrations();
          } catch (err) {
            console.log('API failed in debug mode, using mock data');
            setUsers([{ _id: '1', name: 'Test User', email: 'test@example.com', role: 'user' }]);
            setEvents([{ _id: '1', name: 'Test Event', date: new Date(), category: 'dance', day: 1 }]);
            setRegistrations([]);
            setFilteredEvents([{ _id: '1', name: 'Test Event', date: new Date(), category: 'dance', day: 1 }]);
            setFilteredRegistrations([]);
            setPdfEvents([{ _id: '1', name: 'Test Event', date: new Date(), category: 'dance', day: 1 }]);
          }
        } else {
          await fetchUsers();
          await fetchEvents();
          await fetchRegistrations();
        }

        console.log('Successfully fetched all dashboard data');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load dashboard data: ${err.message}. Please check if the backend server is running.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Enhanced filter logic for registrations
  useEffect(() => {
    let filtered = [...registrations];

    // Apply search filter (team leader name)
    if (searchTerm.trim()) {
      filtered = filtered.filter((reg) => {
        const teamLeaderName = reg.teamLeader?.name || reg.participant?.name || "";
        return teamLeaderName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply category filter
    if (filterCategory && filterCategory !== 'all') {
      filtered = filtered.filter((reg) => {
        if (!reg.event) return false;
        return (reg.event.category || 'other') === filterCategory;
      });
    }

    // Apply event filter
    if (filterEvent && filterEvent !== 'all') {
      filtered = filtered.filter((reg) => {
        if (!reg.event) return false;
        return reg.event._id === filterEvent;
      });
    }

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, filterCategory, filterEvent]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const token = localStorage.getItem('adminCookie');

      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await corsProtectedFetch('admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Users fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched users:', data);

      // Handle the response structure: { users: [...], pagination: {...} }
      if (data && data.users && Array.isArray(data.users)) {
        setUsers(data.users);
        console.log(`Loaded ${data.users.length} users`);
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        setUsers(data);
      } else {
        console.warn('Unexpected users response format:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]); // Set empty array on error

      // Provide specific error messages for common issues
      if (err.message.includes('401') || err.message.includes('Invalid token')) {
        console.error('Authentication failed - admin token may be invalid or expired');
        // Clear invalid token
        localStorage.removeItem('adminCookie');
      } else if (err.message.includes('403')) {
        console.error('Access denied - user may not have admin privileges');
      }

      throw err; // Re-throw to be caught by parent
    }
  };

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const response = await corsProtectedFetch('event/');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Events fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched events:', data);
      const eventsArray = Array.isArray(data) ? data : [];
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
      setPdfEvents(eventsArray);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
      setFilteredEvents([]);
      setPdfEvents([]);
      throw err; // Re-throw to be caught by parent
    }
  };

  const handleAddEvent = () => {
    setEventToEdit(null); // Make sure we're not in edit mode
    setShowEventForm(true);
  };

  const handleEventAdded = (newEvent) => {
    // Add the new event to the events list
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    applyFilters(updatedEvents, categoryFilter, dayFilter);
  };

  const handleEventUpdated = async (updatedEvent) => {
    // Refresh the events data from the backend to ensure we have the latest data
    console.log('Event updated, refreshing events data');
    await fetchEvents();

    // Also update the local state for immediate UI update
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

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setShowEventForm(true);
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

  // Handle toggle registration status
  const handleToggleRegistration = async (eventId, eventName, currentStatus) => {
    try {
      const token = localStorage.getItem('adminCookie');
      const response = await corsProtectedFetch(`admin/event/${eventId}/toggle-registration`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle registration status');
      }

      const data = await response.json();

      // Update the event in the state
      const updatedEvents = events.map(event =>
        event._id === eventId
          ? { ...event, registrationOpen: data.registrationOpen }
          : event
      );
      setEvents(updatedEvents);
      applyFilters(updatedEvents, categoryFilter, dayFilter);

      alert(data.message);
    } catch (err) {
      console.error('Error toggling registration status:', err);
      alert('Error toggling registration status: ' + err.message);
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

    // Handle 404 as empty registrations (not an error)
    if (response.status === 404) {
      console.log('No registrations found (404) - setting empty array');
      setRegistrations([]);
      setFilteredRegistrations([]);
      return; // Exit early, don't throw error
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch registrations: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched registrations:', data);

    // Handle case where backend returns empty array or null
    if (!data || data.length === 0) {
      console.log('No registrations data received - setting empty array');
      setRegistrations([]);
      setFilteredRegistrations([]);
      return;
    }

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

    // Only set error for actual network/server errors, not 404
    if (!err.message.includes('404')) {
      setError(err.message);
    }

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

  // Handle viewing registration details
  const handleViewRegistration = (registration) => {
    setSelectedRegistration(registration);
    setShowRegistrationModal(true);
  };

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
    setSelectedRegistration(null);
  };

  // Enhanced search and filter handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilterChangeEnhanced = (e) => {
    setFilterCategory(e.target.value);
    // Reset event filter when category changes
    setFilterEvent("");
  };

  const handleEventFilterChangeEnhanced = (e) => {
    setFilterEvent(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterEvent("");
  };

  // Get unique events for the selected category
  const getEventsForCategory = () => {
    if (!filterCategory || filterCategory === 'all') return events;
    return events.filter(event => (event.category || 'other') === filterCategory);
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

    // Generate PDF for the selected event with download option
    await handleGenerateEventPdf(selectedEvent._id, selectedEvent.name, true);
  };

  // Preview PDF based on selected event
  const handlePreviewPdf = async () => {
    if (pdfEventFilter === 'all') {
      alert('Please select a specific event to preview a PDF report.');
      return;
    }

    // Find the selected event
    const selectedEvent = events.find(event => event._id === pdfEventFilter);

    if (!selectedEvent) {
      alert('Invalid event selection. Please try again.');
      return;
    }

    // Generate PDF for the selected event without download option
    await handleGenerateEventPdf(selectedEvent._id, selectedEvent.name, false);
  };

  // Generate PDF for a specific event
  const handleGenerateEventPdf = async (eventId, eventName, shouldDownload = true) => {
    try {
      const token = localStorage.getItem('adminCookie');

      // Show loading message
      alert(`${shouldDownload ? 'Generating' : 'Previewing'} PDF report for ${eventName}. This may take a few seconds...`);

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

      // If download is requested, create a download link
      if (shouldDownload) {
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
      }

      // Release the URL object after a short delay to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert(`Error ${shouldDownload ? 'generating' : 'previewing'} PDF: ${err.message}`);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    // Don't allow deleting admin users
    if (!userId) {
      console.error('User ID is required');
      return;
    }

    try {
      const token = localStorage.getItem('adminCookie');
      const response = await corsProtectedFetch(`auth/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove the user from the state
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);

      // Log success to console instead of showing alert
      console.log(`User "${userName}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting user:', err);
      // Show error message only for actual errors
      alert(`Error deleting user: ${err.message}`);
    }
  };

  // Handle registration deletion
  const handleDeleteRegistration = async (registrationId) => {
    // Find the registration to validate it exists
    const registration = registrations.find(reg => reg._id === registrationId);

    if (!registration) {
      console.error('Registration not found');
      return;
    }

    try {
      const token = localStorage.getItem('adminCookie');
      const response = await corsProtectedFetch(`admin/registration/${registrationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete registration');
      }

      // Remove the registration from the state
      const updatedRegistrations = registrations.filter(reg => reg._id !== registrationId);
      setRegistrations(updatedRegistrations);
      applyRegistrationFilters(updatedRegistrations, registrationCategoryFilter, registrationEventFilter);

      // Log success to console instead of showing alert
      console.log(`Registration deleted successfully: ${registrationId}`);
    } catch (err) {
      console.error('Error deleting registration:', err);
      // Only show alert for actual errors
      alert(`Error deleting registration: ${err.message}`);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const token = localStorage.getItem('adminCookie');

      // Show loading message
      alert('Exporting all registrations to Excel. This may take a few seconds...');

      // Use corsProtectedFetch to get the Excel file as a blob
      const response = await corsProtectedFetch('admin/excel', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to export to Excel');
        } catch (jsonError) {
          throw new Error('Failed to export to Excel. The server may be experiencing issues.');
        }
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element for download
      const a = document.createElement('a');
      a.href = blobUrl;

      // Set filename
      const filename = 'Halcyon_All_Registrations.xlsx';
      a.download = filename;

      // Append to body, click and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Release the URL object after a short delay to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

      alert('Excel export completed successfully!');
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      alert(`Error exporting to Excel: ${err.message}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <div>Loading dashboard data...</div>
          <div style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.7 }}>
            Please wait while we fetch your data
          </div>
        </div>
      );
    }

    if (error && activeTab !== 'registrations') {
      return (
        <div className="error">
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--highlight)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Retry
          </button>
        </div>
      );
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
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        disabled={user.role === 'admin'} // Prevent deleting admin users
                        title={user.role === 'admin' ? 'Admin users cannot be deleted' : 'Delete this user'}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards Layout for Users */}
            <div className="mobile-cards-container">
              {users.map(user => (
                <div key={user._id} className="mobile-card">
                  <div className="mobile-card-header">
                    <div>
                      <h4 className="mobile-card-title">{user.name}</h4>
                      <p className="mobile-card-subtitle">{user.email}</p>
                    </div>
                    <div className="mobile-card-actions">
                      <button
                        className="action-btn-mini delete-btn"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        disabled={user.role === 'admin'}
                        title={user.role === 'admin' ? 'Admin users cannot be deleted' : 'Delete this user'}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mobile-card-body">
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Role:</span>
                      <span className="mobile-card-value">
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </span>
                    </div>
                    {user.createdAt && (
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Joined:</span>
                        <span className="mobile-card-value">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                <button className="add-btn" onClick={handleAddEvent}>
                  <i className="fas fa-plus"></i> Add New Event
                </button>

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
              <i className="fas fa-info-circle"></i> Showing {filteredEvents.length} of {events.length} events
            </div>
            <table className="dashboard-table events-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Day</th>
                  <th>Registration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => (
                  <tr key={event._id}>
                    <td>
                      <div className="event-name-cell">
                        <span className="event-title">{event.name}</span>
                        <span className="event-venue">{event.venue || 'TBA'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                    </td>
                    <td>
                      <div className="category-cell">
                        <span className="category-badge" style={{ backgroundColor: getCategoryColor(event.category) }}>
                          <i className={getCategoryIcon(event.category)}></i>
                          {getCategoryLabel(event.category)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="day-badge">Day {event.day || 1}</span>
                    </td>
                    <td>
                      <span className={`registration-status ${event.registrationOpen ? 'open' : 'closed'}`}>
                        <i className={`fas ${event.registrationOpen ? 'fa-unlock' : 'fa-lock'}`}></i>
                        {event.registrationOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-row">
                        <button
                          className="action-btn-mini edit-btn"
                          onClick={() => handleEditEvent(event)}
                          title="Edit Event"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="action-btn-mini delete-btn"
                          onClick={() => handleDeleteEvent(event._id)}
                          title="Delete Event"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button
                          className={`action-btn-mini ${event.registrationOpen ? 'close-btn' : 'open-btn'}`}
                          onClick={() => handleToggleRegistration(event._id, event.name, event.registrationOpen)}
                          title={event.registrationOpen ? 'Close Registration' : 'Open Registration'}
                        >
                          <i className={`fas ${event.registrationOpen ? 'fa-lock' : 'fa-lock-open'}`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards Layout */}
            <div className="mobile-cards-container">
              {filteredEvents.map(event => (
                <div key={event._id} className="mobile-card">
                  <div className="mobile-card-header">
                    <div>
                      <h4 className="mobile-card-title">{event.name}</h4>
                      <p className="mobile-card-subtitle">{event.venue || 'TBA'}</p>
                    </div>
                    <div className="mobile-card-actions">
                      <button
                        className="action-btn-mini edit-btn"
                        onClick={() => handleEditEvent(event)}
                        title="Edit Event"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="action-btn-mini delete-btn"
                        onClick={() => handleDeleteEvent(event._id)}
                        title="Delete Event"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <button
                        className={`action-btn-mini ${event.registrationOpen ? 'close-btn' : 'open-btn'}`}
                        onClick={() => handleToggleRegistration(event._id, event.name, event.registrationOpen)}
                        title={event.registrationOpen ? 'Close Registration' : 'Open Registration'}
                      >
                        <i className={`fas ${event.registrationOpen ? 'fa-lock' : 'fa-lock-open'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="mobile-card-body">
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Date:</span>
                      <span className="mobile-card-value">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Category:</span>
                      <span className="mobile-card-value">
                        <span className="category-badge" style={{ backgroundColor: getCategoryColor(event.category) }}>
                          <i className={getCategoryIcon(event.category)}></i>
                          {getCategoryLabel(event.category)}
                        </span>
                      </span>
                    </div>
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Day:</span>
                      <span className="mobile-card-value">
                        <span className="day-badge">Day {event.day || 1}</span>
                      </span>
                    </div>
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Registration:</span>
                      <span className="mobile-card-value">
                        <span className={`registration-status ${event.registrationOpen ? 'open' : 'closed'}`}>
                          <i className={`fas ${event.registrationOpen ? 'fa-unlock' : 'fa-lock'}`}></i>
                          {event.registrationOpen ? 'Open' : 'Closed'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'registrations':
        return (
          <div className="dashboard-table-container registrations-tab">
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

                <div className="pdf-buttons">
                  <button className="preview-pdf-btn" onClick={handlePreviewPdf} title="Preview PDF in browser">
                    <i className="fas fa-eye"></i> Preview PDF
                  </button>
                  <button className="generate-pdf-btn" onClick={handleGeneratePdf} title="Download PDF to your device">
                    <i className="fas fa-file-pdf"></i> Download PDF
                  </button>
                  <button className="export-excel-btn" onClick={handleExportToExcel} title="Export all registrations to Excel">
                    <i className="fas fa-file-excel"></i> Export to Excel
                  </button>
                </div>
              </div>

            </div>

            {/* Enhanced Search and Filter Controls */}
            <div className="search-filter-container">
              <div className="search-bar">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search by team leader name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      className="clear-search-btn"
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <label htmlFor="categoryFilter">Category:</label>
                  <select
                    id="categoryFilter"
                    value={filterCategory}
                    onChange={handleCategoryFilterChangeEnhanced}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="eventFilter">Event:</label>
                  <select
                    id="eventFilter"
                    value={filterEvent}
                    onChange={handleEventFilterChangeEnhanced}
                    className="filter-select"
                    disabled={!filterCategory}
                  >
                    <option value="">All Events</option>
                    {getEventsForCategory().map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>

                {(searchTerm || filterCategory || filterEvent) && (
                  <button
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    title="Clear all filters"
                  >
                    <i className="fas fa-times-circle"></i>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="registrations-summary">
              <p>
                Showing <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong> registrations
                {(searchTerm || filterCategory || filterEvent) && (
                  <span className="filter-indicator"> (filtered)</span>
                )}
              </p>
            </div>

            {error ? (
              <div className="error-message registrations-tab-error">
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
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Team Leader</th>
                      <th>Team Name</th>
                      <th>Event</th>
                      <th>Category</th>
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
                          <td>
                            <div className="action-buttons-row">
                              <button
                                className="action-btn view-btn"
                                onClick={() => handleViewRegistration(reg)}
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i> View
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDeleteRegistration(reg._id)}
                                title="Delete Registration"
                              >
                                <i className="fas fa-trash"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          <i className="fas fa-exclamation-circle"></i>
                          {registrations.length === 0
                            ? "No registrations found"
                            : (searchTerm || filterCategory || filterEvent)
                              ? "No registrations match your search criteria"
                              : "No registrations found"
                          }
                          {(searchTerm || filterCategory || filterEvent) && (
                            <div className="no-data-suggestion">
                              <button onClick={clearFilters} className="clear-filters-link">
                                Clear filters to see all registrations
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Mobile Cards Layout for Registrations */}
                <div className="mobile-cards-container">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map(reg => (
                      <div key={reg._id} className="mobile-card">
                        <div className="mobile-card-header">
                          <div>
                            <h4 className="mobile-card-title">{reg.teamLeader?.name || (reg.participant?.name) || 'Unknown'}</h4>
                            <p className="mobile-card-subtitle">{reg.teamName || 'N/A'}</p>
                          </div>
                          <div className="mobile-card-actions">
                            <button
                              className="action-btn-mini view-btn"
                              onClick={() => handleViewRegistration(reg)}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="action-btn-mini delete-btn"
                              onClick={() => handleDeleteRegistration(reg._id)}
                              title="Delete Registration"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="mobile-card-body">
                          <div className="mobile-card-row">
                            <span className="mobile-card-label">Event:</span>
                            <span className="mobile-card-value">{reg.event?.name || 'Unknown'}</span>
                          </div>
                          <div className="mobile-card-row">
                            <span className="mobile-card-label">Category:</span>
                            <span className="mobile-card-value">
                              {reg.event ? (
                                <span className="category-badge" style={{ backgroundColor: getCategoryColor(reg.event.category) }}>
                                  <i className={getCategoryIcon(reg.event.category)}></i>
                                  {getCategoryLabel(reg.event.category)}
                                </span>
                              ) : 'Unknown'}
                            </span>
                          </div>
                          {reg.event?.date && (
                            <div className="mobile-card-row">
                              <span className="mobile-card-label">Date:</span>
                              <span className="mobile-card-value">{new Date(reg.event.date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {reg.registeredAt && (
                            <div className="mobile-card-row">
                              <span className="mobile-card-label">Registered:</span>
                              <span className="mobile-card-value">{new Date(reg.registeredAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mobile-card no-data-card">
                      <div className="mobile-card-body">
                        <div className="no-data">
                          <i className="fas fa-exclamation-circle"></i>
                          {registrations.length === 0
                            ? "No registrations found"
                            : (searchTerm || filterCategory || filterEvent)
                              ? "No registrations match your search criteria"
                              : "No registrations found"
                          }
                          {(searchTerm || filterCategory || filterEvent) && (
                            <div className="no-data-suggestion">
                              <button onClick={clearFilters} className="clear-filters-link">
                                Clear filters to see all registrations
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  // Registration Detail Modal Component
  const RegistrationDetailModal = () => {
    if (!showRegistrationModal || !selectedRegistration) return null;

    const reg = selectedRegistration;
    const isPaidEvent = reg.event?.fees > 0;

    return (
      <div className="modal-overlay" onClick={handleCloseRegistrationModal}>
        <div className="modal-content registration-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Registration Details</h3>
            <button className="modal-close-btn" onClick={handleCloseRegistrationModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            <div className="registration-info-grid">
              {/* Event Information */}
              <div className="info-section">
                <h4><i className="fas fa-calendar-alt"></i> Event Information</h4>
                <div className="info-row">
                  <span className="label">Event Name:</span>
                  <span className="value">{reg.event?.name || 'Unknown'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Category:</span>
                  <span className="value">{getCategoryLabel(reg.event?.category)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Event Day:</span>
                  <span className="value">Day {reg.event?.day || 1}</span>
                </div>
                <div className="info-row">
                  <span className="label">Venue:</span>
                  <span className="value">{reg.event?.venue || 'TBA'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Event Date:</span>
                  <span className="value">
                    {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'TBA'}
                  </span>
                </div>
                {isPaidEvent && (
                  <div className="info-row">
                    <span className="label">Event Fees:</span>
                    <span className="value">₹{reg.event.fees}</span>
                  </div>
                )}
              </div>

              {/* Team Information */}
              <div className="info-section">
                <h4><i className="fas fa-users"></i> Team Information</h4>
                <div className="info-row">
                  <span className="label">Team Name:</span>
                  <span className="value">{reg.teamName || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Team Size:</span>
                  <span className="value">{reg.teamSize || 1} participant{(reg.teamSize || 1) > 1 ? 's' : ''}</span>
                </div>
                <div className="info-row">
                  <span className="label">Registration Date:</span>
                  <span className="value">{new Date(reg.registeredAt || reg.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Team Leader Information */}
              <div className="info-section">
                <h4><i className="fas fa-user-tie"></i> Team Leader</h4>
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{reg.teamLeader?.name || (reg.participant?.name) || 'Unknown'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{reg.teamLeader?.email || (reg.participant?.email) || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Mobile:</span>
                  <span className="value">{reg.teamLeader?.mobile || (reg.participant?.mobile) || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">USN:</span>
                  <span className="value">{reg.teamLeaderDetails?.usn || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">College:</span>
                  <span className="value">{reg.teamLeaderDetails?.collegeName || 'N/A'}</span>
                </div>
              </div>

              {/* Team Members Information */}
              {reg.teamMembers && reg.teamMembers.length > 0 && (
                <div className="info-section team-members-section">
                  <h4><i className="fas fa-users"></i> Team Members</h4>
                  {reg.teamMembers.map((member, index) => (
                    <div key={index} className="team-member-card">
                      <h5>Member {index + 1}</h5>
                      <div className="info-row">
                        <span className="label">Name:</span>
                        <span className="value">{member.name || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">USN:</span>
                        <span className="value">{member.usn || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Email:</span>
                        <span className="value">{member.email || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Mobile:</span>
                        <span className="value">{member.mobile || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">College:</span>
                        <span className="value">{member.collegeName || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Information */}
              {isPaidEvent && (
                <div className="info-section payment-section">
                  <h4><i className="fas fa-credit-card"></i> Payment Information</h4>
                  <div className="info-row">
                    <span className="label">Payment Status:</span>
                    <span className={`value payment-status ${reg.paymentStatus || 'pending'}`}>
                      {(reg.paymentStatus || 'pending').replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {reg.transactionId && (
                    <div className="info-row">
                      <span className="label">Transaction ID:</span>
                      <span className="value transaction-id">{reg.transactionId}</span>
                    </div>
                  )}
                  {reg.paymentId && (
                    <div className="info-row">
                      <span className="label">Payment ID:</span>
                      <span className="value">{reg.paymentId}</span>
                    </div>
                  )}
                  {reg.orderId && (
                    <div className="info-row">
                      <span className="label">Order ID:</span>
                      <span className="value">{reg.orderId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              {reg.notes && (
                <div className="info-section">
                  <h4><i className="fas fa-sticky-note"></i> Notes</h4>
                  <div className="info-row">
                    <span className="value notes">{reg.notes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>
          Admin Dashboard
          {debugMode && (
            <span style={{
              fontSize: '0.7rem',
              color: '#ff6b6b',
              marginLeft: '1rem',
              background: 'rgba(255, 107, 107, 0.1)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid #ff6b6b'
            }}>
              DEBUG MODE
            </span>
          )}
        </h2>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> <span>Users</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-calendar-alt"></i> <span>Events</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <i className="fas fa-clipboard-list"></i> <span>Registrations</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i> <span>Settings</span>
          </button>
        </div>

        <div className="dashboard-main">
          {!loading && !error && (
            <div className="dashboard-stats">
              <div className="stat-card users">
                <h4><i className="fas fa-users"></i> Total Users</h4>
                <div className="stat-value">{users.length}</div>
                <div className="stat-description">Registered users in the system</div>
              </div>

              <div className="stat-card events">
                <h4><i className="fas fa-calendar-alt"></i> Total Events</h4>
                <div className="stat-value">{events.length}</div>
                <div className="stat-description">Events created for Halcyon 2025</div>
              </div>

              <div className="stat-card registrations">
                <h4><i className="fas fa-clipboard-check"></i> Total Registrations</h4>
                <div className="stat-value">{registrations.length}</div>
                <div className="stat-description">Event registrations received</div>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </div>

      {/* Registration Detail Modal */}
      <RegistrationDetailModal />
    </div>
  );
}

// Wrap AdminDashboard with ErrorBoundary
const AdminDashboardWithErrorBoundary = () => (
  <ErrorBoundary>
    <AdminDashboard />
  </ErrorBoundary>
);

export default AdminDashboardWithErrorBoundary;
