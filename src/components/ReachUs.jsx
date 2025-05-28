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
              src="https://maps.google.com/maps?q=Administrative%20Block,%20Chandana%20Complex,%20Tumakuru,%20Karnataka%20572103&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Administrative Block, Chandana Complex, Tumakuru, Karnataka"
            ></iframe>
          </div>
          <div className="map-actions">
            <a
              href="https://www.google.com/maps/search/Administrative+Block,+Chandana+Complex,+Tumakuru,+Karnataka+572103"
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
