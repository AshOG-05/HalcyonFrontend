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
    if (!isLoggedIn()) {
      navigate("/RegisterLogin")
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        await fetchUserData()
        await fetchRegistrations()
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.tokenName)
      const response = await corsProtectedFetch("auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUserData(data)
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError("Failed to fetch user data")
    }
  }

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem(APP_CONFIG.tokenName)
      const response = await corsProtectedFetch("registration/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch registrations")
      }

      const data = await response.json()
      setRegistrations(data)
    } catch (err) {
      console.error("Error fetching registrations:", err)
      setError("Failed to fetch registrations")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryLabel = (categoryId) => {
    const category = EVENT_CATEGORIES.find((cat) => cat.id === categoryId)
    return category ? category.label : categoryId
  }

  const handleViewEvent = (eventId) => {
    navigate("/events", { state: { scrollToEvent: eventId } })
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">Profile</h1>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="tabs-container">
          {/* Tabs */}
          <div className="tabs-list">
            <button
              className="tabs-trigger"
              data-state={activeTab === "registrations" ? "active" : "inactive"}
              onClick={() => setActiveTab("registrations")}
            >
              My Events ({registrations.length})
            </button>
            <button
              className="tabs-trigger"
              data-state={activeTab === "account" ? "active" : "inactive"}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "registrations" && (
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">
                  <Calendar size={20} />
                  My Registered Events
                </h2>
              </div>
              <div className="card-content">
                {registrations.length === 0 ? (
                  <div className="empty-state">
                    <Calendar size={64} />
                    <p>No events registered yet</p>
                    <button className="explore-events-btn" onClick={() => navigate("/events")}>
                      Explore Events
                    </button>
                  </div>
                ) : (
                  <div>
                    {registrations.map((reg) => (
                      <div key={reg._id} className="event-card">
                        <div className="event-header">
                          <div>
                            <h3 className="event-title">{reg.event?.name || "Unknown Event"}</h3>
                            {reg.event?.category && (
                              <span className={`category-badge ${reg.event.category}`}>
                                {getCategoryLabel(reg.event.category)}
                              </span>
                            )}
                          </div>
                          <button
                            className="view-event-btn"
                            onClick={() => handleViewEvent(reg.event?._id || "")}
                            disabled={!reg.event?._id}
                          >
                            <Eye size={16} />
                            View Event
                          </button>
                        </div>

                        <div className="event-details">
                          <div className="event-detail">
                            <Calendar size={16} />
                            <span>{reg.event ? formatDate(reg.event.date) : "TBA"}</span>
                          </div>
                          <div className="event-detail">
                            <MapPin size={16} />
                            <span>{reg.event?.venue || "TBA"}</span>
                          </div>
                          <div className="event-detail">
                            <Users size={16} />
                            <span>
                              {reg.teamSize} {reg.teamSize > 1 ? "members" : "member"}
                            </span>
                          </div>
                        </div>

                        <p className="registration-date">Registered on {formatDate(reg.registeredAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">
                  <User size={20} />
                  Account Information
                </h2>
              </div>
              <div className="card-content">
                <div className="account-info">
                  <div className="user-avatar">{userData?.name?.charAt(0)?.toUpperCase() || "U"}</div>
                  <div className="user-details">
                    <div className="user-field">
                      <span className="field-label">Name</span>
                      <span className="field-value">{userData?.name || "N/A"}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Email</span>
                      <span className="field-value">{userData?.email || "N/A"}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Mobile</span>
                      <span className="field-value">{userData?.mobile || "N/A"}</span>
                    </div>
                    <div className="user-field">
                      <span className="field-label">Account Type</span>
                      <span className="account-type-badge">{userData?.role || "user"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
