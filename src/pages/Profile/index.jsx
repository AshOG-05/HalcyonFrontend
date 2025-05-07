import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, APP_CONFIG, EVENT_CATEGORIES } from '../../config';
import { isLoggedIn, logout } from '../../services/authService';
import { corsProtectedFetch } from '../../utils/corsHelper';
import './styles.css';

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registrations');
  const [userData, setUserData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate('/RegisterLogin');
      return;
    }

    // Fetch user data and registrations
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUserData();
        await fetchRegistrations();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.tokenName);
      const response = await corsProtectedFetch('auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.tokenName);
      const response = await corsProtectedFetch('registration/me', {
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
      console.error('Error fetching registrations:', err);
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get category label from category ID
  const getCategoryLabel = (categoryId) => {
    const category = EVENT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  // Get category icon from category ID
  const getCategoryIcon = (categoryId) => {
    const category = EVENT_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : 'fas fa-question';
  };

  // Get category color based on category ID
  const getCategoryColor = (categoryId) => {
    const colors = {
      'dance': '#ff9800',
      'music': '#e91e63',
      'gaming': '#2196f3',
      'theatre': '#9c27b0',
      'finearts': '#4caf50',
      'literary': '#3f51b5',
      'other': '#607d8b'
    };
    return colors[categoryId] || colors.other;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-overview">
            <div className="dashboard-stats">
              <div className="stat-card registrations">
                <h4><i className="fas fa-clipboard-list"></i> My Registrations</h4>
                <div className="stat-value">{registrations.length}</div>
                <div className="stat-description">Events you've registered for</div>
              </div>
              
              <div className="stat-card upcoming">
                <h4><i className="fas fa-calendar-alt"></i> Upcoming Events</h4>
                <div className="stat-value">
                  {registrations.filter(reg => 
                    reg.event && new Date(reg.event.date) > new Date()
                  ).length}
                </div>
                <div className="stat-description">Events happening soon</div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => navigate('/events')} className="action-btn">
                  <i className="fas fa-compass"></i> Explore Events
                </button>
                <button onClick={() => setActiveTab('registrations')} className="action-btn">
                  <i className="fas fa-clipboard-list"></i> View My Registrations
                </button>
                <button onClick={() => setActiveTab('account')} className="action-btn">
                  <i className="fas fa-user-cog"></i> Account Settings
                </button>
              </div>
            </div>
          </div>
        );

      case 'registrations':
        return (
          <div className="dashboard-table-container">
            <h3>My Event Registrations</h3>
            {registrations.length === 0 ? (
              <div className="no-registrations">
                <i className="fas fa-calendar-times"></i>
                <p>You haven't registered for any events yet.</p>
                <button onClick={() => navigate('/events')} className="explore-btn">
                  Explore Events
                </button>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Team Size</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(reg => (
                    <tr key={reg._id}>
                      <td>{reg.event?.name || 'Unknown Event'}</td>
                      <td>
                        {reg.event ? (
                          <div className="category-cell">
                            <span className="category-badge" style={{ backgroundColor: getCategoryColor(reg.event.category) }}>
                              <i className={getCategoryIcon(reg.event.category)}></i>
                            </span>
                            {getCategoryLabel(reg.event.category)}
                          </div>
                        ) : 'Unknown'}
                      </td>
                      <td>{reg.event ? formatDate(reg.event.date) : 'N/A'}</td>
                      <td>{reg.event?.venue || 'TBA'}</td>
                      <td>{reg.teamSize || 1} {reg.teamSize > 1 ? 'members' : 'member'}</td>
                      <td>{formatDate(reg.registeredAt)}</td>
                      <td>
                        <span className={`status-badge ${reg.paymentStatus}`}>
                          {reg.paymentStatus === 'completed' ? 'Paid' :
                            reg.paymentStatus === 'not_required' ? 'Free Event' :
                              reg.paymentStatus === 'pending' ? 'Payment Pending' :
                                reg.paymentStatus === 'failed' ? 'Payment Failed' : 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn view-btn"
                          onClick={() => navigate(`/event/${reg.event?._id}`)}
                        >
                          <i className="fas fa-eye"></i> View Event
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case 'account':
        return (
          <div className="account-settings-container">
            <h3>Account Information</h3>
            <div className="user-info-card">
              <div className="user-avatar">
                <i className="fas fa-user-astronaut"></i>
              </div>
              <div className="user-details">
                <div className="user-detail">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{userData?.name || 'N/A'}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{userData?.email || 'N/A'}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">Mobile:</span>
                  <span className="detail-value">{userData?.mobile || 'N/A'}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">Account Type:</span>
                  <span className="detail-value account-type">{userData?.role || 'user'}</span>
                </div>
              </div>
            </div>
            
            <div className="account-actions">
              <button className="action-btn danger-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="dashboard-container user-profile">
      <div className="dashboard-header">
        <h2>User Profile</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <i className="fas fa-clipboard-list"></i> <span>My Registrations</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fas fa-user-cog"></i> <span>Account Settings</span>
          </button>
        </div>

        <div className="dashboard-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Profile;
