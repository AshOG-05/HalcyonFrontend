function TimelineCardMobile({ events }) {
  return (
    <section className="timeline-card-mobile">
      <div className="timeline-mobile-events">
        <h3>Events Schedule</h3>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <a href={event.link} title={event.title}>
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
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TimelineCardMobile;