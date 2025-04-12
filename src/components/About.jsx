import './About.css';

function About() {

  return (
    <div className="about panel" id="about_anchor">

      <div className="about-decorations" style={{ height: '80vh' }}>
        <img
          id="astronaut"
          alt="astronaut"
          src="/assets/astronaut.webp"
          style={{
            position: 'absolute',
            right: '10%',
            top: '15%',
            maxWidth: '200px',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 2
          }}
        />
        <img
          id="planet"
          alt="planet"
          src="/assets/moon.webp"
          style={{
            position: 'absolute',
            left: '10%',
            bottom: '25%',
            maxWidth: '250px',
            borderRadius: '50%',
            animation: 'rotate 20s linear infinite',
            zIndex: 0,
            opacity: 0.8,
            pointerEvents: 'none'
          }}
        />
        <div className="stars-container" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                position: 'absolute',
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                backgroundColor: 'white',
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random(),
                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
              }}
            />
          ))}
        </div>
      </div>

      <div className="about-box" style={{ marginTop: '10vh' }}>
        <h1>About <span className="highlight">Essence</span></h1>
        <div className="about-content">
          <p className="about-text">
            Welcome to <span className="highlight">Essence</span> - the biggest, most exciting college fest of Central India!
            Join us for an unforgettable celebration of youth, talent, and culture.
          </p>
          <div className="about-features">
            <div className="feature">
              <i className="fas fa-calendar-alt"></i>
              <h3>4 Days of Fun</h3>
              <p>Experience four ecstatic days filled with competitions, performances, and memories.</p>
            </div>
            <div className="feature">
              <i className="fas fa-music"></i>
              <h3>Amazing Pronites</h3>
              <p>Enjoy electrifying performances by renowned artists and bands.</p>
            </div>
            <div className="feature">
              <i className="fas fa-trophy"></i>
              <h3>Exciting Events</h3>
              <p>Participate in a wide range of events and showcase your talents.</p>
            </div>
          </div>
          <p className="about-cta">
            Don't miss this opportunity to be part of something extraordinary! We hope to see you there!
          </p>
        </div>
      </div>
      <div className="section-divider" style={{
        position: 'relative',
        height: '100px',
        marginTop: '2rem',
        overflow: 'hidden',
        zIndex: 5
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.5), transparent)',
          boxShadow: '0 0 20px rgba(255, 152, 0, 0.3)'
        }}></div>
      </div>
    </div>
  );
}

export default About;