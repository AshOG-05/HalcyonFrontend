function TimelineCard({ day, description, events, cardClass, animation }) {
    return (
      <section className="card" data-aos={animation}>
        <div className="book">
          <div className="first">
            <div className={`front ${cardClass}`}>
              <h1>{day}</h1>
            </div>
            <div className="back">
              <h1>{day}</h1>
              <p>{description}</p>
            </div>
          </div>
          <div className="second">
            <div>
              <ul>
                {events.map((event, index) => (
                  <li key={index}>
                    <a href={event.link} title={event.title}>
                      <div>{event.title}</div>
                      <div>{event.time}</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default TimelineCard;