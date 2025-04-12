function TimelineCard({ day, description, events, cardClass, animation }) {
  return (
    <section className="timeline-card" data-aos={animation}>
      <div className="timeline-card-container">
        <div className="timeline-card-header">
          <div className={`timeline-card-banner ${cardClass}`}>
            <h1>{day}</h1>
          </div>
          <div className="timeline-card-description">
            <p>{description}</p>
          </div>
        </div>

        <div className="timeline-card-events">
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
      </div>
    </section>
  );
}

export default TimelineCard;