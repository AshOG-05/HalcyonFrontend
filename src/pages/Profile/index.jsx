import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, APP_CONFIG, EVENT_CATEGORIES } from '../../config';
import { isLoggedIn, logout } from '../../services/authService';
import { corsProtectedFetch } from '../../utils/corsHelper';
import '../../components/comicLoading.css';
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
      'dance': '#FF1744',
      'music': '#00B0FF',
      'gaming': '#FFEB3B',
      'theatre': '#9C27B0',
      'finearts': '#00E676',
      'literary': '#00E5FF',
      'other': '#607d8b'
    };
    return colors[categoryId] || colors.other;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="comic-loading-wrap">
            <div className="comic-loading" role="status" aria-live="polite" aria-label="Loading profile">
              <div className="comic-loading__sun" />
            </div>
            <div className="comic-loading-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
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
            <div className="welcome-section">
              <h3>Welcome back, {userData?.name?.split(' ')[0] || 'User'}!</h3>
              <p>Manage your event registrations and account settings</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{registrations.length}</div>
                  <div className="stat-label">Total Registrations</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon upcoming">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-value">
                    {registrations.filter(reg =>
                      reg.event && new Date(reg.event.date) > new Date()
                    ).length}
                  </div>
                  <div className="stat-label">Upcoming Events</div>
                </div>
              </div>
            </div>

          </div>
        );

      case 'registrations':
        return (
          <div className="registrations-container">
            <div className="registrations-header">
              <h3>My Event Registrations</h3>
              <div className="registrations-count">
                {registrations.length} {registrations.length === 1 ? 'Event' : 'Events'}
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="no-registrations">
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <h4>Ready to Join the Adventure?</h4>
                  <p>
                    Discover amazing events at Halcyon 2026! From technical competitions to cultural performances,
                    there's something exciting waiting for everyone.
                  </p>

                  <button onClick={() => navigate('/events')} className="explore-btn">
                    <i className="fas fa-compass"></i>
                    Explore All Events
                  </button>
                  <div className="secondary-actions">
                    <p className="help-text">
                      Need help?{' '}
                      <button
                        type="button"
                        className="help-link help-link-btn"
                        onClick={() => {
                          window.location.href = '/#contact_anchor';
                        }}
                      >
                        Contact our support team
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="registrations-grid">
                {registrations.map(reg => (
                  <div key={reg._id} className="registration-card">
                    <div className="card-header">
                      <div className="event-info">
                        <h4 className="event-name">{reg.event?.name || 'Unknown Event'}</h4>
                        <div className="event-meta">
                          <span className="category-tag" style={{ backgroundColor: getCategoryColor(reg.event?.category) }}>
                            <i className={getCategoryIcon(reg.event?.category)}></i>
                            {getCategoryLabel(reg.event?.category)}
                          </span>
                        </div>
                      </div>
                      <div className="payment-status">
                        <span className={`status-badge ${reg.paymentStatus}`}>
                          {reg.paymentStatus === 'completed' ? 'Paid' :
                            reg.paymentStatus === 'not_required' ? 'Free' :
                              reg.paymentStatus === 'pending' ? 'Pending' :
                                reg.paymentStatus === 'failed' ? 'Failed' :
                                  reg.paymentStatus === 'pay_on_event_day' ? 'Pay on Day' :
                                    reg.paymentStatus === 'payment_required' ? 'Payment Required' : 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="event-details">
                        <div className="detail-row">
                          <i className="fas fa-calendar"></i>
                          <span>{reg.event ? formatDate(reg.event.date) : 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{reg.event?.venue || 'TBA'}</span>
                        </div>
                        <div className="detail-row">
                          <i className="fas fa-users"></i>
                          <span>{reg.teamSize || 1} {reg.teamSize > 1 ? 'members' : 'member'}</span>
                        </div>
                        <div className="detail-row">
                          <i className="fas fa-clock"></i>
                          <span>Registered {formatDate(reg.registeredAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <button
                        className="view-event-btn"
                        onClick={() => navigate(`/event/${reg.event?._id}`)}
                      >
                        <i className="fas fa-eye"></i>
                        View Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

  const upcomingCount = registrations.filter(reg =>
    reg.event && new Date(reg.event.date) > new Date()
  ).length;

  return (
    <div className="dashboard-container user-profile">
      <div className="profile-shell">
        <div className="profile-topbar">
          <div className="profile-identity">
            <div className="profile-avatar">
              <i className="fas fa-user-astronaut"></i>
            </div>
            <div className="profile-identity-text">
              <h2>{userData?.name || 'User Profile'}</h2>
              <p>{userData?.email || 'Welcome to your Halcyon dashboard'}</p>
            </div>
          </div>
          <div className="header-buttons">
            <button className="home-btn" onClick={() => navigate('/')}>
              <i className="fas fa-home"></i> Home
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <div className="profile-stats-strip">
          <div className="profile-stat-chip">
            <i className="fas fa-clipboard-list"></i>
            <div>
              <strong>{registrations.length}</strong>
              <span>Total Registrations</span>
            </div>
          </div>
          <div className="profile-stat-chip">
            <i className="fas fa-calendar-alt"></i>
            <div>
              <strong>{upcomingCount}</strong>
              <span>Upcoming Events</span>
            </div>
          </div>
          <div className="profile-stat-chip">
            <i className="fas fa-user-shield"></i>
            <div>
              <strong>{userData?.role || 'user'}</strong>
              <span>Account Type</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''} profile-tab-btn`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'registrations' ? 'active' : ''} profile-tab-btn`}
            onClick={() => setActiveTab('registrations')}
          >
            <i className="fas fa-clipboard-list"></i> <span>My Registrations</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'account' ? 'active' : ''} profile-tab-btn`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fas fa-user-cog"></i> <span>Account Settings</span>
          </button>
        </div>

        <div className="profile-content-wrap">
          <div className="dashboard-main profile-main">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;