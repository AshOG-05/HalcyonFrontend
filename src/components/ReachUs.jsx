import React from 'react';
import './ReachUs.css';

function ReachUs() {
  return (
    <section className="reach-us-section" id="reach_us">
      <div className="container">
        <h2 className="section-heading">
          <span className="section-heading-text">How to Reach Us</span>
        </h2>

        <div className="transportation-grid">
          <div className="transport-card">
            <h3>BUS</h3>
            <p>
              Frequent buses are available to Tumakuru from the Kempegowda Bus Station, Bengaluru.
              Alight at the SIT stop one and a half hour later. If you happen to sleep through, fret not.
              Alight at the Tumakuru bus stand. Autos and the local buses (no. 201) are easily available to SIT.
            </p>
          </div>

          <div className="transport-card">
            <h3>TRAINS</h3>
            <p>
              Trains are available intermittently from Bengaluru station. Kindly refer to the train schedules for timings.
              From Tumakuru station, autos are available to SIT.
            </p>
          </div>

          <div className="transport-card">
            <h3>TAXIS</h3>
            <p>
              Taxis are available from Bangalore to SIT. However, considering the frequency of buses,
              taxis are not really recommended.
            </p>
          </div>

          <div className="transport-card">
            <h3>AIR</h3>
            <p>
              The nearest airport is the Kempegowda International Airport, Bengaluru.
            </p>
          </div>
        </div>

        <div className="map-container">
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.779624118529!2d77.12424767502333!3d13.329679487019574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb02c40144083e5%3A0xbf1cc64248f2acb8!2sSIT%20Campus%20Main%20Road%2C%20Tumakuru%2C%20Karnataka%20572103!5e1!3m2!1sen!2sin!4v1748784598628!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Siddaganga Institute of Technology, Tumakuru (Main Gate)"
            ></iframe>
          </div>
          <div className="map-actions">
            <a
              href="https://maps.app.goo.gl/tHboWExHfCk9mG4s9"
              target="_blank"
              rel="noopener noreferrer"
              className="view-on-maps-btn"
            >
              <i className="fas fa-map-marker-alt"></i> Open in Google Maps
            </a>

            <p className="map-note">
              <i className="fas fa-info-circle"></i> Click the button above to view the exact location
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReachUs;
