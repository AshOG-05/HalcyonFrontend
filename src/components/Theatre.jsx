import React from 'react';
import './Theatre.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Theatre() {
  return (
    <div className="theatre-page">
      <Navbar />
      <Sidebar />

      <div className="theatre-container">
        <a href="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Home
        </a>
        <div className="theatre-card">
          <div className="theatre-header">
            <h1>THEATRE</h1>
          </div>

          <div className="theatre-content">
            <div className="theatre-illustration">
              <img src="/assets/gradient.webp" alt="Theatre illustration" />
            </div>

            <div className="theatre-details">
              <div className="theatre-event">
                <h2>SKIT</h2>
                <p>MINIMUM 6 AND MAXIMUM 15 PARTICIPANTS INCLUDING NARRATOR (IF ANY).</p>
                <p>PROPS AND COSTUMES ARE ALLOWED.</p>
                <p>THE PERFORMANCE SHOULD NOT BE A PART OF ANY MOVIE OR TV SHOW.</p>
                <p>TIME LIMIT: 10+2 MINUTES.</p>
              </div>

              <div className="theatre-event">
                <h2>STREET PLAY</h2>
                <p>MINIMUM 8 AND MAXIMUM 15 PARTICIPANTS PER TEAM.</p>
                <p>PROPS AND MUSICAL INSTRUMENTS ARE ALLOWED.</p>
                <p>THE PLAY SHOULD BE FOR A SOCIAL CAUSE.</p>
                <p>TIME LIMIT: 12+3 MINUTES.</p>
              </div>

              <div className="theatre-event">
                <h2>MIME</h2>
                <p>MAXIMUM 7 PARTICIPANTS PER TEAM.</p>
                <p>1 ACCOMPANIST IS ALLOWED.</p>
                <p>NO PROPS SHOULD BE USED.</p>
                <p>ONLY BACKGROUND MUSIC WITHOUT VOCALS IS ALLOWED.</p>
                <p>TIME LIMIT: 4+2 MINUTES.</p>
              </div>
            </div>
          </div>

          <div className="general-rules-section">
            <h2>GENERAL RULES</h2>
            <div className="general-rules-content">
              <ol className="general-rules-list">
                <li>VULGARITY AND OBSCENITY IN/OF ANY FORM IS NOT ALLOWED.</li>
                <li>PARTICIPANTS ARE REQUESTED TO REFRAIN FROM USING CONTROVERSIAL REMARKS.</li>
                <li>REPETITION OF THE SAME SCRIPTS IN DIFFERENT EVENTS WILL BE DISQUALIFIED.</li>
                <li>DECISIONS OF THE RESPECTIVE EVENT JUDGES ARE FINAL AND BINDING FOR ALL EVENTS.</li>
                <li>IF THE REGISTRATIONS ARE LESS THAN THREE, THEN THERE WILL BE NO CASH PRIZE.</li>
              </ol>
            </div>
          </div>

          <div className="theatre-footer">
            <div className="registration-info">
              <h3>REGISTRATION</h3>
              <p>Register online before May 25, 2025</p>
              <p>Registration Fee: ₹250 per team</p>
              <button className="register-btn">Register Now</button>
            </div>

            <div className="contact-info">
              <h3>CONTACT</h3>
              <p>Event Coordinator: Neha Patel</p>
              <p>Email: theatre@halcyon2025.com</p>
              <p>Phone: +91 9876543213</p>
            </div>
          </div>
        </div>
      </div>

      <div className="theatre-background-elements">
        <div className="mandala top-left">
          <img src="/assets/mandala.png" alt="Decorative mandala" />
        </div>
        <div className="mandala bottom-right">
          <img src="/assets/mandala.png" alt="Decorative mandala" />
        </div>
      </div>
    </div>
  );
}

export default Theatre;
