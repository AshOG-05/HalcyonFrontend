import './About.css';
import Marquee from './Marquee';

function About() {

  return (
    <div className="about panel" id="about_anchor">

      <div className="about-decorations" style={{ height: '80vh' }}>
        <img
          id="astronaut"
          alt="astronaut"
          src="/assets/Dancer.png"
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
          src="/assets/circular.png"
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
        <h1>About <span className="highlight">Halcyon</span></h1>
        <div className="about-content">
          <p className="about-text">
            Welcome to <span className="highlight">Halcyon</span> - the biggest, most exciting college fest of Siddaganga Institutue of Technology, Tumkur!
            Join us for an unforgettable celebration of youth, talent, and culture.
          </p>

          {/* Added Marquee component here */}
          <Marquee />

          <div className="about-features">
            <div className="feature" data-aos="fade-up" data-aos-delay="100">
              <i className="fas fa-calendar-alt"></i>
              <h3>2 Days of Fun</h3>
              <p>Experience two ecstatic days filled with competitions, performances, and memories.</p>
            </div>
            <div className="feature" data-aos="fade-up" data-aos-delay="200">
              <i className="fas fa-music"></i>
              <h3>Amazing Pronites</h3>
              <p>Enjoy electrifying performances by renowned artists and bands.</p>
            </div>
            <div className="feature" data-aos="fade-up" data-aos-delay="300">
              <i className="fas fa-rupee-sign"></i>
              <h3>₹2.26 Lakh Prize Pool</h3>
              <p>Win big from our massive prize pool across all competitions.</p>
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