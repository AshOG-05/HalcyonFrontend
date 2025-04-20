function TimelineCardMobile({ categories, onCategoryClick, loading }) {
  return (
    <section className="timeline-card-mobile">
      <div className="timeline-mobile-events">
        <h3>Event Categories</h3>
        {loading ? (
          <div className="timeline-loading">Loading categories...</div>
        ) : categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className="event-link category-link"
                  onClick={() => onCategoryClick(category.id)}
                  title={`View all ${category.title} events`}
                >
                  <div className="event-icon">
                    <i className={category.icon}></i>
                  </div>
                  <div className="event-details">
                    <span className="event-title">{category.title}</span>
                    <span className="event-time">{category.time}</span>
                  </div>
                  <div className="event-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-events">No categories available for this day</div>
        )}
      </div>
    </section>
  );
}

export default TimelineCardMobile;