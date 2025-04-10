import { useState } from 'react';

function About() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="about panel" id="about_anchor">
      {/* sidebar */}
      <div className="nav-checkbox">
        <input 
          type="checkbox" 
          id="check" 
          checked={sidebarOpen}
          onChange={toggleSidebar}
        />
        <label htmlFor="check">
          <i className="fas fa-bars" id="btn"></i>
          <i className="fas fa-times" id="cancel"></i>
        </label>
        <div className="sidebar">
          <header>Explore</header>
          <a title="Homepage" href="#top" className="active">
            <i className="fas fa-rocket"></i>
            <span>Homepage</span>
          </a>
          <a title="Sign-in" href="./RegisterLogin/" className="in">
            <i className="fas fa-user"></i>
            <span>Sign-in</span>
          </a>
          <a title="Goodies" href="./goodies/">
            <i className="fas fa-tag"></i>
            <span>Goodies</span>
          </a>
          <a title="FAQ" href="./faqpage">
            <i className="fas fa-question"></i>
            <span>FAQ's</span>
          </a>
        </div>
      </div>

      <img id="astronaut" alt="astronaut" src="/assets/astronaut.webp" />
      <img id="planet" alt="planet" src="/assets/moon.webp" />

      <div className="about-box">
        <h1>About</h1>
        <p className="about-text">
          We welcome you to Essence- the biggest, most fun college fest of Central India. 
          Join us in the celebration of youth and culture. A wide range of events spread 
          over three ecstatic days will make this an event to reminisce. Do not miss this 
          opportunity! We hope to see you there!
        </p>
      </div>
    </div>
  );
}

export default About;