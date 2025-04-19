import React from 'react';
import './FineArts.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function FineArts() {
  return (
    <div className="finearts-page">
      <Navbar />
      <Sidebar />

      <div className="finearts-container">
        <a href="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Home
        </a>
        <div className="finearts-card">
          <div className="finearts-header">
            <h1>FINE ARTS</h1>
          </div>

          <div className="finearts-content">
            <div className="finearts-illustration">
              <img src="/assets/bg_astronaut.webp" alt="Fine Arts illustration" />
            </div>

            <div className="finearts-details">
              <div className="finearts-event">
                <h2>FACE PAINTING</h2>
                <p>TOPIC WILL BE GIVEN ON SPOT.</p>
                <p>PAINTS AND BRUSHES WILL BE PROVIDED (MAXIMUM 6 COLORS).</p>
                <p>PROVISIONS-WASTE CLOTH/PAPER, WATER, PLASTIC CUPS.</p>
                <p>TIME LIMIT: 1 HOUR.</p>
              </div>

              <div className="finearts-event">
                <h2>CREATIVE PHOTOGRAPHY</h2>
                <p>INDIVIDUAL EVENT.</p>
                <p>SUBMISSIONS ARE TAKEN THROUGHOUT INDIA.</p>
                <p>ONLY CAMERA PICTURES SHOULD BE PRODUCED IN USB PORTAL MEDIA STORAGE DEVICE (JPG, JPEG, TIF).</p>
                <p>DOWNLOADING IMAGES FROM THE INTERNET IS NOT ALLOWED, PLAGIARISM AND METADATA WILL BE CHECKED BEFORE CONSIDERING.</p>
                <p>PARTICIPANTS CAN PRODUCE ONLY ONE PHOTOGRAPH (METADATA SHOULD BE VALID AT THE TIME OF SUBMISSION).</p>
                <p>THE TOPIC WILL BE ANNOUNCED ON THE WEBSITE 48 HOURS PRIOR TO THE EVENT.</p>
                <p>STUDENTS FROM OTHER COLLEGES WILL BE MAILED A VIDEO CONFERENCE LINK IN WHICH THEY WILL HAVE TO BRIEFLY EXPLAIN.</p>
              </div>

              <div className="finearts-event">
                <h2>SKETCHING</h2>
                <p>INDIVIDUAL EVENT.</p>
                <p>MONO COLOUR THROUGHOUT THE SKETCHING.</p>
                <p>THE TOPIC WILL BE GIVEN ON SPOT.</p>
                <p>ONLY CHART PAPER AND STATIONARIES WILL BE PROVIDED. NO OTHER ITEM WILL BE PROVIDED.</p>
                <p>PARTICIPANTS WILL NOT BE ALLOWED TO LEAVE THE HALL DURING THE EVENT.</p>
                <p>TIME LIMIT: 45 MINUTES.</p>
              </div>

              <div className="finearts-event">
                <h2>REELS MAKING</h2>
                <p>ALL REELS MUST BE SHOT WITHIN COLLEGE PREMISES. ANY REEL SHOT OUTSIDE THE CAMPUS WILL BE DISQUALIFIED.</p>
                <p>THE THEME FOR THE REEL WILL BE REVEALED ONE DAY BEFORE THE EVENT.</p>
                <p>REELS SHOULD BE BETWEEN 30-60 SECS IN LENGTH.</p>
                <p>MAXIMUM OF 2-3 MEMBERS PER TEAM. SOLO ENTRIES ARE ALSO ALLOWED.</p>
                <p>CONTENT MUST BE ORIGINAL. PLAGIARISM OR COPYING FROM EXISTING CONTENT WILL LEAD TO DISQUALIFICATION.</p>
              </div>
            </div>
          </div>

          <div className="general-rules-section">
            <h2>GENERAL RULES</h2>
            <div className="general-rules-content">
              <ol className="general-rules-list">
                <li>ALL PARTICIPANTS MUST CARRY VALID COLLEGE ID CARDS.</li>
                <li>PARTICIPANTS MUST REPORT 15 MINUTES BEFORE THE EVENT STARTS.</li>
                <li>JUDGES' DECISION WILL BE FINAL AND BINDING.</li>
                <li>ANY FORM OF PLAGIARISM OR CHEATING WILL LEAD TO IMMEDIATE DISQUALIFICATION.</li>
                <li>PARTICIPANTS MUST MAINTAIN DECORUM DURING THE EVENTS.</li>
              </ol>
            </div>
          </div>

          <div className="finearts-footer">
            <div className="registration-info">
              <h3>REGISTRATION</h3>
              <p>Register online before May 25, 2025</p>
              <p>Registration Fee: ₹200 per participant</p>
              <button className="register-btn">Register Now</button>
            </div>

            <div className="contact-info">
              <h3>CONTACT</h3>
              <p>Event Coordinator: Ravi Kumar</p>
              <p>Email: finearts@halcyon2025.com</p>
              <p>Phone: +91 9876543214</p>
            </div>
          </div>
        </div>
      </div>

      <div className="finearts-background-elements">
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

export default FineArts;
