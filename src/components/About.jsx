import './About.css';

function About() {
  return (
    <div className="about comic-about-container" id="about_anchor">

      {/* Floating decorative elements */}
      <div className="about-decorations" style={{ height: '80vh' }}>
        {/* Stars — unchanged */}
        <div className="stars-container" style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%', overflow: 'hidden', zIndex: 0
        }}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className="star" style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: 'white',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
              animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
            }} />
          ))}
        </div>

        {/* Comic floating badges */}
        <div className="comic-badge comic-badge-amazing">AMAZING!</div>
        <div className="comic-badge comic-badge-pow">POW!</div>
      </div>

      <div className="about-box" style={{ marginTop: '10vh' }}>

        {/* Comic section header */}
        <div className="comic-section-header">
          <h1 className="comic-title-text">
            <span className="highlight">About</span> <span className="highlight">Halcyon</span>
          </h1>
          <div className="comic-title-underline"></div>
        </div>

        <div className="about-content">

          {/* Thought bubble wraps the description */}
          <div className="comic-thought-bubble">
            <p className="comic-body-text">
              <span className="highlight">Halcyon'26</span>. THE SUMMER FEST OF SIDDAGANGA INSTITUTE OF
              TECHNOLOGY, IS THE LARGEST CULTURAL CELEBRATION HOSTED BY THE INSTITUTION. SPANNING FOR
              TWO VIBRANT DAYS, THIS ANNUAL FEST HAS BEEN A CHERISHED TRADITION SINCE ITS INCEPTION IN
              1992. NOW IN ITS 33RD YEAR, HALCYON CONTINUES TO GROW IN SCALE AND ENTHUSIASM, DRAWING
              OVER 2,500 PARTICIPANTS EACH YEAR FROM VARIOUS COLLEGES ACROSS KARNATAKA.
            </p>
          </div>

          {/* Feature cards with comic badge accents */}
          <div className="about-features">
            <div className="feature comic-feature-card" data-aos="fade-up" data-aos-delay="100">
              <span className="comic-feature-badge badge-red">⚡ EVENT</span>
              <i className="fas fa-calendar-alt"></i>
              <h3>2 Days of Fun</h3>
              <p>Experience two ecstatic days filled with competitions, performances, and memories.</p>
            </div>
            <div className="feature comic-feature-card" data-aos="fade-up" data-aos-delay="200">
              <span className="comic-feature-badge badge-blue">🎵 MUSIC</span>
              <i className="fas fa-music"></i>
              <h3>Amazing Pronites</h3>
              <p>Enjoy electrifying performances by renowned artists and bands.</p>
            </div>
            <div className="feature comic-feature-card" data-aos="fade-up" data-aos-delay="300">
              <span className="comic-feature-badge badge-purple">🏆 WIN</span>
              <i className="fas fa-rupee-sign"></i>
              <h3>₹2 Lakh Prize Pool</h3>
              <p>Win big from our massive prize pool across all competitions.</p>
            </div>
            <div className="feature comic-feature-card" data-aos="fade-up" data-aos-delay="400">
              <span className="comic-feature-badge badge-yellow">🎭 CULTURE</span>
              <i className="fas fa-users"></i>
              <h3>5000+ Participants</h3>
              <p>Connect with vibrant talent from colleges across Karnataka and celebrate culture together.</p>
            </div>
          </div>

          <p className="about-cta comic-cta-text">
            🚀 Don't miss this opportunity to be part of something extraordinary! We hope to see you there!
          </p>

        </div>
      </div>
    </div>
  );
}

export default About;