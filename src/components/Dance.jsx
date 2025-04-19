import React from 'react';
import './Dance.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Dance() {
  return (
    <div className="dance-page">
      <Navbar />
      <Sidebar />

      <div className="dance-container">
        <a href="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Home
        </a>
        <div className="dance-card">
          <div className="dance-header">
            <h1>DANCE</h1>
          </div>

          <div className="dance-content">
            <div className="dance-illustration">
              <img src="/assets/Dancer.png" alt="Classical dancers" />
            </div>

            <div className="dance-details">
              <div className="dance-event">
                <h2>DUET DANCE</h2>
                <p>DUO CAN CONSIST A PAIR OF BOYS/GIRLS OR BOTH, COMBINATION IS ALLOWED.</p>
                <p>LIVE BAND IS NOT ALLOWED.</p>
                <p>TIME LIMIT: 4(MINIMUM)+1 MINUTES</p>
              </div>

              <div className="dance-event">
                <h2>CLASSICAL AND FOLK DANCE</h2>
                <p>LIVE BAND OR GROUP SONG ACCOMPANIED BY DANCING IS NOT ALLOWED.</p>
                <p>RESPECTIVE DANCE FORM PROPS ARE ALLOWED.</p>
                <p>NUMBER OF PARTICIPANTS ALLOWED IS 1.</p>
                <p>TIME LIMIT: 3(MINIMUM)+2 MINUTES</p>
              </div>

              <div className="dance-event">
                <h2>GROUP DANCE</h2>
                <p>MINIMUM 4 AND MAXIMUM 15 PARTICIPANTS ARE ALLOWED.</p>
                <p>ANY DANCE FORM IS ALLOWED.</p>
                <p>PROPS ARE ALLOWED BUT NEED TO BE ARRANGED BY PARTICIPANTS.</p>
                <p>TIME LIMIT: 6(MINIMUM)+2 MINUTES</p>
              </div>

              <div className="dance-event">
                <h2>WESTERN DANCE</h2>
                <p>SOLO PERFORMANCE ONLY.</p>
                <p>ANY WESTERN DANCE FORM IS ALLOWED.</p>
                <p>PROPS ARE ALLOWED.</p>
                <p>TIME LIMIT: 3(MINIMUM)+1 MINUTES</p>
              </div>
            </div>
          </div>

          <div className="general-rules-section">
            <h2>GENERAL RULES</h2>
            <div className="general-rules-content">
              <ol className="general-rules-list">
                <li>ALL EVENTS ALLOW A MAXIMUM OF 3 PARTICIPANTS OR TEAMS PER COLLEGE.</li>
                <li>PEN DRIVE FOR DANCE SHOULD BE MADE AVAILABLE TO THE CONCERNED CO-COORDINATOR 3 HOURS PRIOR TO THE EVENT IN A READY TO PLAY CONDITION. (USB IN MP3 FORMAT).</li>
                <li>POOR AUDIO QUALITY IS NOT THE RESPONSIBILITY OF THE ORGANIZERS.</li>
                <li>ANY COSTUMES, GESTURES AND ACTIONS SHOULD NOT BE OBSCENE.</li>
                <li>THE DECISION OF THE JUDGES IS FINAL AND BINDING ON ALL THE PARTICIPANTS.</li>
                <li>RESPECTIVE DANCE FORM PROPS ARE ALLOWED HOWEVER, IF PROPS LIKE WATER, COLOR POWDER OR SIMILAR ITEMS ARE USED, THE STAGE MUST BE LEFT CLEAN AFTER THE PERFORMANCE.</li>
              </ol>
            </div>
          </div>

          <div className="dance-footer">
            <div className="registration-info">
              <h3>REGISTRATION</h3>
              <p>Register online before May 25, 2025</p>
              <p>Registration Fee: ₹200 per participant</p>
              <button className="register-btn">Register Now</button>
            </div>

            <div className="contact-info">
              <h3>CONTACT</h3>
              <p>Event Coordinator: Priya Sharma</p>
              <p>Email: dance@halcyon2025.com</p>
              <p>Phone: +91 9876543210</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dance-background-elements">
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

export default Dance;
