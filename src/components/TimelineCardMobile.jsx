function TimelineCardMobile({ events }) {
    return (
      <section className="card-mob">
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
      </section>
    );
  }
  
  export default TimelineCardMobile;