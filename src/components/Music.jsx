import React from 'react';
import './Music.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Music() {
  return (
    <div className="music-page">
      <Navbar />
      <Sidebar />

      <div className="music-container">
        <div className="music-card">
          <div className="music-header">
            <h1>MUSIC</h1>
          </div>

          <div className="music-content">
            <div className="music-illustration">
              <img src="/assets/anuvjain.webp" alt="Music performance" />
            </div>

            <div className="music-details">
              <div className="music-event">
                <h2>INDO-WESTERN VOCAL SOLO</h2>
                <p>3 PARTICIPANTS PER COLLEGE.</p>
                <p>KARAOKE OR 2 ACCOMPANISTS ARE ALLOWED.</p>
                <p>TIME LIMIT: 4+1 MINUTES.</p>
                <p>VIOLATION OF ANY RULE WILL LEAD TO DISQUALIFICATION.</p>
                <p>JUDGES DECISION IS FINAL AND BINDING ON ALL PARTICIPANTS.</p>
                <p>RECORDED MUSIC OR KARAOKE IS ALLOWED.</p>
              </div>

              <div className="music-event">
                <h2>CLASSICAL VOCAL SOLO</h2>
                <p>MAXIMUM OF 5 PARTICIPANTS PER COLLEGE, ONE CLASSICAL PIECE TO BE CHOSEN.</p>
                <p>PARTICIPANT HAS TO MENTION RAGA AND TAALA, NO RECORDED MUSIC ALLOWED.</p>
                <p>NO ACCOMPANISTS ARE ALLOWED.</p>
                <p>SHRUTHI BOXES ARE ALLOWED.</p>
                <p>TIME LIMIT: 10+1 MINUTES.</p>
              </div>

              <div className="music-event">
                <h2>BATTLE OF BANDS</h2>
                <p>MAXIMUM OF 2 BANDS PER COLLEGE.</p>
                <p>MINIMUM OF 3 PARTICIPANTS, MAXIMUM OF 10 PARTICIPANTS PER BAND.</p>
                <p>TIME GIVEN IS 13+7 MINUTES.</p>
                <p>INCLUDES SETUP.</p>
                <p>DRUM SET WITH DOUBLE BASS PEDAL AND ADEQUATE MICROPHONES.</p>
                <p>SPECIAL EFFECTS, KARAOKE AND PROGRAMMED MUSIC ARE NOT ALLOWED.</p>
              </div>

              <div className="music-event">
                <h2>DUET SINGING</h2>
                <p>2 MEMBERS PER TEAM, A MAXIMUM OF 5 TEAMS PER COLLEGE ARE ALLOWED.</p>
                <p>NO GENDER RESTRICTIONS ON THE TEAM CONSTITUTION.</p>
                <p>KARAOKE AND A MAXIMUM OF 2 ACCOMPANISTS ARE ALLOWED.</p>
                <p>TIME LIMIT: 4+1 MINUTES.</p>
                <p>JUDGMENT WILL BE BASED SOLELY ON VOCALS.</p>
              </div>
            </div>
          </div>

          <div className="general-rules-section">
            <h2>GENERAL RULES</h2>
            <div className="general-rules-content">
              <ol className="general-rules-list">
                <li>MAXIMUM OF 5 PARTICIPANTS OR TEAMS PER COLLEGE PER EVENT (UNLESS STATED OTHERWISE).</li>
                <li>VIOLATION OF ANY RULE WILL LEAD TO IMMEDIATE DISQUALIFICATION.</li>
                <li>JUDGES' DECISIONS ARE FINAL AND BINDING ON ALL PARTICIPANTS.</li>
                <li>PARTICIPANTS MUST BRING THEIR OWN INSTRUMENTS AND EQUIPMENT UNLESS SPECIFIED.</li>
                <li>KARAOKE AND ACCOMPANISTS ARE ALLOWED ONLY WHERE MENTIONED.</li>
                <li>TIME LIMITS MUST BE STRICTLY FOLLOWED FOR EACH EVENT.</li>
                <li>SPECIAL EFFECTS, PROGRAMMED MUSIC, AND RECORDED TRACKS ARE RESTRICTED BASED ON EVENT RULES.</li>
                <li>EVENT-SPECIFIC REQUIREMENTS (LIKE RAGA, TAALA, OR MIC SETUPS) MUST BE INFORMED IN ADVANCE.</li>
              </ol>
            </div>
          </div>

          <div className="music-footer">
            <div className="registration-info">
              <h3>REGISTRATION</h3>
              <p>Register online before May 25, 2025</p>
              <p>Registration Fee: ₹200 per participant</p>
              <button className="register-btn">Register Now</button>
            </div>

            <div className="contact-info">
              <h3>CONTACT</h3>
              <p>Event Coordinator: Rahul Sharma</p>
              <p>Email: music@halcyon2025.com</p>
              <p>Phone: +91 9876543211</p>
            </div>
          </div>
        </div>
      </div>

      <div className="music-background-elements">
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

export default Music;
