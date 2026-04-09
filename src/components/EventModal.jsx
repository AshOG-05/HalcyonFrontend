import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG, EVENT_CATEGORIES } from '../config';
import { corsProtectedFetch, ORIGINAL_API_URL } from '../utils/corsHelper';
import { isLoggedIn } from '../services/authService';
import EventRegistrationForm from './EventRegistrationForm';
import './EventModal.css';

// ── mock data helper (unchanged) ──────────────────────────────
const createMockEventData = (eventId) => {
  const fallbackEvents = {
    'fallback1': {
      _id: 'fallback1',
      name: 'Fashion Show',
      description: 'Showcase your style and creativity in our annual fashion show. Walk the ramp with confidence and flair.',
      date: new Date('2025-03-15T13:00:00'),
      venue: 'Main Auditorium',
      day: 1,
      category: 'theatre',
      rules: [
        'Participants must register in teams of 3-5 members',
        'Each team will get 10 minutes for their performance',
        'Props are allowed but must be approved beforehand',
        'Theme will be announced one week before the event'
      ],
      prizes: ['1st Prize: ₹10,000', '2nd Prize: ₹5,000', '3rd Prize: ₹3,000'],
      coordinators: [
        { name: 'Priya Sharma',  phone: '9876543210' },
        { name: 'Rahul Verma',   phone: '8765432109' }
      ]
    },
    'fallback2': {
      _id: 'fallback2',
      name: 'Mr and Ms Fest',
      description: 'Compete for the prestigious title of Mr. and Ms. Halcyon 2025.',
      date: new Date('2025-03-15T15:00:00'),
      venue: 'Main Stage',
      day: 1,
      category: 'other',
      rules: [
        'Individual participation only',
        'Three rounds: Introduction, Talent, and Q&A',
        'Each participant gets 5 minutes for the talent round',
        'Judges decision will be final'
      ],
      prizes: ['Mr. Halcyon: Trophy + ₹7,000', 'Ms. Halcyon: Trophy + ₹7,000', 'Runners-up: ₹3,000 each'],
      coordinators: [
        { name: 'Ananya Patel',  phone: '7654321098' },
        { name: 'Vikram Singh',  phone: '6543210987' }
      ]
    },
    'fallback3': {
      _id: 'fallback3',
      name: 'Treasure Hunt',
      description: 'Put your problem-solving skills to the test in this exciting treasure hunt across the campus.',
      date: new Date('2025-03-15T19:00:00'),
      venue: 'Entire Campus',
      day: 1,
      category: 'gaming',
      rules: [
        'Teams of 3-4 members',
        'All clues must be solved in sequence',
        'No external help or internet allowed',
        'Time limit: 3 hours'
      ],
      prizes: ['1st Prize: ₹8,000', '2nd Prize: ₹4,000', '3rd Prize: ₹2,000'],
      coordinators: [
        { name: 'Arjun Mehta', phone: '5432109876' },
        { name: 'Neha Gupta',  phone: '4321098765' }
      ]
    },
  };
  return fallbackEvents[eventId] || {
    _id: eventId, name: 'Unknown Event',
    description: 'Details for this event are not available.',
    date: new Date(), venue: 'TBD', day: 1, category: 'other',
    rules: [], prizes: [], coordinators: []
  };
};

// ── section configs ────────────────────────────────────────────
const SECTION_COLORS = [
  { bg: '#FF1744', text: '#fff',     icon: '📋' },
  { bg: '#FFEB3B', text: '#000',     icon: '⚡' },
  { bg: '#00B0FF', text: '#fff',     icon: '🏆' },
  { bg: '#9C27B0', text: '#fff',     icon: '📞' },
];

function EventModal({ eventId, onClose }) {
  const navigate = useNavigate();
  const [event,               setEvent]               = useState(null);
  const [loading,             setLoading]             = useState(true);
  const [error,               setError]               = useState('');
  const [registering,         setRegistering]         = useState(false);
  const [registrationStatus,  setRegistrationStatus]  = useState({ success: false, message: '' });
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    fetchEventDetails();

    const handleClickOutside = (e) => {
      if (e.target.classList.contains('event-modal-overlay')) onClose();
    };
    document.addEventListener('click', handleClickOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      if (eventId?.toString().startsWith('mock')) {
        setEvent(createMockEventData(eventId)); return;
      }
      const response = await corsProtectedFetch(`event/${eventId}`);
      if (response.type === 'opaque') {
        setEvent(createMockEventData(eventId)); return;
      }
      if (!response.ok) throw new Error(`Failed to fetch event details: ${response.status}`);
      setEvent(await response.json());
    } catch (err) {
      setError(err.message);
      setEvent(createMockEventData(eventId));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (!isLoggedIn()) {
      onClose();
      navigate(`/RegisterLogin?redirect=/event/${eventId}`);
      return;
    }
    setShowRegistrationForm(true);
  };

  const handleRegistrationSuccess = () => {
    setRegistrationStatus({ success: true, message: 'You have successfully registered for this event!' });
    setShowRegistrationForm(false);
  };

  // ── fee display helper ────────────────────────────────────────
  const getFeeLabel = (ev) => {
    if (ev.registrationFee === 0) return 'Free';
    if (ev.registrationFee)       return `₹${ev.registrationFee}`;
    if (ev.fees && parseInt(ev.fees) > 0) return `₹${ev.fees}`;
    return 'Free';
  };

  const getTeamLabel = (ev) => {
    if (ev.teamSize === 1) return 'Individual Event';
    if (ev.teamSize === 2) return 'Duo Event (2 participants)';
    return `Team Event (${
      ev.minTeamSize === ev.maxTeamSize
        ? `${ev.minTeamSize} participants`
        : `${ev.minTeamSize}-${ev.maxTeamSize} participants`
    })`;
  };

  // ── render ────────────────────────────────────────────────────
  return (
    <div className="event-modal-overlay comic-modal-overlay">

      {showRegistrationForm && event ? (
        <EventRegistrationForm
          eventId={eventId}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={handleRegistrationSuccess}
        />
      ) : (

        <div className="event-modal comic-event-modal">

          {/* ── close button ── */}
          <button className="comic-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          {/* ── sound-effect corner decor ── */}
          <span className="comic-modal-sfx comic-modal-sfx-tl">POW!</span>
          <span className="comic-modal-sfx comic-modal-sfx-br">BAM!</span>

          {/* ── loading ── */}
          {loading && (
            <div className="comic-modal-loading">
              <div className="comic-spinner">
                <span>⚡</span>
              </div>
              <p className="comic-loading-text">LOADING EVENT...</p>
            </div>
          )}

          {/* ── error ── */}
          {!loading && error && !event && (
            <div className="comic-modal-error">
              <span className="comic-error-icon">💥</span>
              <p className="comic-error-text">{error}</p>
            </div>
          )}

          {/* ── not found ── */}
          {!loading && !event && !error && (
            <div className="comic-modal-error">
              <span className="comic-error-icon">🔍</span>
              <p className="comic-error-text">EVENT NOT FOUND</p>
            </div>
          )}

          {/* ── event content ── */}
          {!loading && event && (
            <>
              {/* Header strip */}
              <div className="comic-modal-header">
                <div className="comic-modal-header-bg" />
                <h2 className="comic-modal-event-title">{event.name.toUpperCase()}</h2>

                {/* Meta pills */}
                <div className="comic-modal-meta">
                  <span className="comic-meta-pill comic-meta-red">
                    <i className="fas fa-calendar-alt" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                  <span className="comic-meta-pill comic-meta-blue">
                    <i className="fas fa-map-marker-alt" />
                    {event.venue}
                  </span>
                  <span className="comic-meta-pill comic-meta-yellow">
                    <i className={EVENT_CATEGORIES.find(c => c.id === (event.category || 'other'))?.icon || 'fas fa-star'} />
                    {EVENT_CATEGORIES.find(c => c.id === (event.category || 'other'))?.label || 'Other'}
                  </span>
                  <span className="comic-meta-pill comic-meta-purple">
                    <i className="fas fa-calendar-day" />
                    DAY {event.day || 1}
                  </span>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="comic-modal-body">

                {/* About */}
                <div className="comic-modal-section" style={{ '--sec-color': SECTION_COLORS[0].bg, '--sec-text': SECTION_COLORS[0].text }}>
                  <div className="comic-section-heading">
                    <span className="comic-section-icon">{SECTION_COLORS[0].icon}</span>
                    ABOUT THIS EVENT
                  </div>
                  <p className="comic-section-body">{event.description}</p>
                </div>

                {/* Rules */}
                {event.rules?.length > 0 && (
                  <div className="comic-modal-section" style={{ '--sec-color': SECTION_COLORS[1].bg, '--sec-text': SECTION_COLORS[1].text }}>
                    <div className="comic-section-heading">
                      <span className="comic-section-icon">{SECTION_COLORS[1].icon}</span>
                      RULES
                    </div>
                    <ul className="comic-section-list">
                      {event.rules.map((rule, i) => (
                        <li key={i} className="comic-list-item">
                          <span className="comic-list-bullet">{i + 1}</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prizes */}
                {event.prizes?.length > 0 && (
                  <div className="comic-modal-section" style={{ '--sec-color': SECTION_COLORS[2].bg, '--sec-text': SECTION_COLORS[2].text }}>
                    <div className="comic-section-heading">
                      <span className="comic-section-icon">{SECTION_COLORS[2].icon}</span>
                      PRIZES
                    </div>
                    <ul className="comic-section-list">
                      {event.prizes.map((prize, i) => (
                        <li key={i} className="comic-list-item comic-prize-item">
                          <span className="comic-prize-medal">{['🥇','🥈','🥉'][i] || '🏅'}</span>
                          {prize}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Coordinators */}
                {event.coordinators?.length > 0 && (
                  <div className="comic-modal-section" style={{ '--sec-color': SECTION_COLORS[3].bg, '--sec-text': SECTION_COLORS[3].text }}>
                    <div className="comic-section-heading">
                      <span className="comic-section-icon">{SECTION_COLORS[3].icon}</span>
                      EVENT COORDINATORS
                    </div>
                    <ul className="comic-section-list">
                      {event.coordinators.map((c, i) => (
                        <li key={i} className="comic-list-item comic-coordinator-item">
                          <span className="comic-coord-avatar">👤</span>
                          <span className="comic-coord-name">{c.name}</span>
                          <a href={`tel:${c.phone}`} className="comic-coord-phone">
                            📞 {c.phone}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>{/* end body */}

              {/* ── Footer / actions ── */}
              <div className="comic-modal-footer">

                {/* Registration status message */}
                {registrationStatus.message && (
                  <div className={`comic-reg-message ${registrationStatus.success ? 'comic-reg-success' : 'comic-reg-error'}`}>
                    {registrationStatus.success ? '🎉' : '⚠️'} {registrationStatus.message}
                  </div>
                )}

                {/* Fee + team info */}
                <div className="comic-reg-info-row">
                  <div className="comic-reg-info-pill comic-fee-pill">
                    <i className="fas fa-ticket-alt" />
                    FEE: <strong>{getFeeLabel(event)}</strong>
                  </div>
                  <div className="comic-reg-info-pill comic-team-pill">
                    <i className="fas fa-users" />
                    <strong>{getTeamLabel(event)}</strong>
                  </div>
                </div>

                {/* Register button */}
                <button
                  className="comic-register-btn"
                  onClick={handleRegister}
                  disabled={registering || registrationStatus.success}
                >
                  {registering
                    ? <><span className="comic-btn-spinner">⚡</span> REGISTERING...</>
                    : registrationStatus.success
                      ? '✅ REGISTERED!'
                      : <>REGISTER NOW <span className="comic-btn-arrow">→</span></>
                  }
                </button>

              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EventModal;