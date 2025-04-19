function TimelineCardMobile({ events, onEventClick, loading }) {
  return (
    <section className="timeline-card-mobile">
      <div className="timeline-mobile-events">
        <h3>Events Schedule</h3>
        {loading ? (
          <div className="timeline-loading">Loading events...</div>
        ) : events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <button
                  className="event-link"
                  onClick={() => onEventClick(event.id)}
                  title={event.title}
                >
                  <div className="event-icon">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <div className="event-details">
                    <span className="event-title">{event.title}</span>
                    <span className="event-time">{event.time}</span>
                  </div>
                  <div className="event-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-events">No events scheduled for this day</div>
        )}
      </div>
    </section>
  );
}

export default TimelineCardMobile;