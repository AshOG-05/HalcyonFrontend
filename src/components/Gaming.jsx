import React from 'react';
import './Gaming.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Gaming() {
  return (
    <div className="gaming-page">
      <Navbar />
      <Sidebar />

      <div className="gaming-container">
        <a href="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Home
        </a>
        <div className="gaming-card">
          <div className="gaming-header">
            <h1>GAMING</h1>
          </div>

          <div className="gaming-content">
            <div className="gaming-illustration">
              <img src="/assets/goodies-space.webp" alt="Gaming illustration" />
            </div>

            <div className="gaming-details">
              <div className="gaming-event">
                <h2>VALORANT</h2>
                <p>TEAMS MUST HAVE 5 PLAYERS FROM THE SAME ENGINEERING COLLEGE WITH VALID ID CARDS.</p>
                <p>SILVER RANK MINIMUM: OWN LAPTOP, KEYBOARD, AND MOUSE REQUIRED (ETHERNET PROVIDED).</p>
                <p>CONFIRM ENTRIES 30 MINS BEFORE EVENT, FORMAT DECIDED ON SPOT.</p>
                <p>OBSCENE LANGUAGE, CHEATING, OR HACKING WILL BE DIRECT DISQUALIFICATION.</p>
                <p>RULES MAY CHANGE: COORDINATORS' DECISIONS ARE FINAL.</p>
              </div>

              <div className="gaming-event">
                <h2>BATTLEGROUNDS MOBILE INDIA (BGMI)</h2>
                <p>TEAMS MUST HAVE 4 PLAYERS FROM THE SAME ENGINEERING COLLEGE WITH VALID ID CARDS: CROSS-COLLEGE TEAMS NOT ALLOWED.</p>
                <p>PLAYERS MUST USE MOBILE PHONES ONLY, NO EXTERNAL DEVICES PERMITTED.</p>
                <p>ALL PLAYERS MUST BE LEVEL 15 AND ABOVE PLATINUM V TIER AT REGISTRATION.</p>
                <p>MAP: ERANGEL: ENTRIES MUST BE CONFIRMED 30 MINS BEFORE THE EVENT.</p>
                <p>OBSCENE LANGUAGE, RULE VIOLATIONS, OR TEAM DISCREPANCIES LEAD TO DISQUALIFICATION: COORDINATORS DECISIONS ARE FINAL.</p>
              </div>

              <div className="gaming-event">
                <h2>LUDO KING</h2>
                <p>ONLY PARTICIPANT PER TEAM, ALL MUST CARRY VALID ENGINEERING COLLEGE ID CARDS (NO CROSS-COLLEGE TEAMS).</p>
                <p>CONFIRM ENTRIES WITH COORDINATORS 30 MINUTES BEFORE THE EVENT.</p>
                <p>GAME PLAYED ON MOBILE PHONES PROVIDED BY ORGANIZERS, REST OF RULES FOLLOW IN GAME MECHANICS.</p>
                <p>FIRST 2 PLAYERS TO MOVE 2 TOKENS TO FINISH POINT ADVANCE TO NEXT ROUND.</p>
                <p>OBSCENE LANGUAGE, TEAM DISCREPANCIES, OR ANY RULE VIOLATION LEADS TO DISQUALIFICATION. COORDINATORS DECISION IS FINAL AND RULES MAY CHANGE.</p>
              </div>

              <div className="gaming-event">
                <h2>FREE FIRE</h2>
                <p>ONLY CURRENT COLLEGE STUDENTS CAN REGISTER INDIVIDUALLY OR IN TEAMS BEFORE THE DEADLINE: CONFIRMATION WILL BE SENT.</p>
                <p>MATCHES FOLLOW OFFICIAL FREE FIRE RULES, CHEATING, GLITCHES, OR MISCONDUCT LEADS TO DISQUALIFICATION.</p>
                <p>TOURNAMENT FORMAT, MATCH MODE, AND SCHEDULE WILL BE SHARED: PLAYERS MUST JOIN LOBBIES ON TIME.</p>
                <p>SCORING BASED ON PLACEMENTS AND KILLS, TOP TEAMS WIN PRIZES, AND ALL MATCHES MAY BE STREAMED.</p>
                <p>ORGANIZERS MAY CHANGE RULES ANYTIME: DECISIONS BY JUDGES ARE FINAL, AND FAIR PLAY IS MANDATORY.</p>
              </div>
            </div>
          </div>

          <div className="gaming-footer">
            <div className="registration-info">
              <h3>REGISTRATION</h3>
              <p>Register online before May 25, 2025</p>
              <p>Registration Fee: ₹300 per team</p>
              <button className="register-btn">Register Now</button>
            </div>

            <div className="contact-info">
              <h3>CONTACT</h3>
              <p>Event Coordinator: Akash Kumar</p>
              <p>Email: gaming@halcyon2025.com</p>
              <p>Phone: +91 9876543212</p>
            </div>
          </div>
        </div>
      </div>

      <div className="gaming-background-elements">
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

export default Gaming;
