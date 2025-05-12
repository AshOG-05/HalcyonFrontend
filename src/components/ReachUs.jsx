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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.317382965022!2d77.12718760618048!3d13.326620228979811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb02e826fb691ef%3A0xe78608813c36f380!2sSiddaganga%20Institute%20Of%20Technology!5e1!3m2!1sen!2sin!4v1746500465906!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SIT Location Map"
            ></iframe>
          </div>
          <div className="map-actions">
            <a
              href="https://www.google.com/maps/place/Siddaganga+Institute+Of+Technology/@13.3266202,77.1271876,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb02e826fb691ef:0xe78608813c36f380!8m2!3d13.3266202!4d77.1271876!16s%2Fg%2F11c1z0_4ky"
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
