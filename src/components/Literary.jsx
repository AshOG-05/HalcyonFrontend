import React from 'react';
import './Literary.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Literary() {
  return (
    <div className="literary-page">
      <Navbar />
      <Sidebar />
      
      <div className="literary-container">
        <div className="literary-card">
          <div className="literary-header">
            <h1>LITERARY</h1>
          </div>
          
          <div className="literary-content">
            <div className="literary-illustration">
              <img src="/assets/astro-jelly.webp" alt="Literary illustration" />
            </div>
            
            <div className="literary-details">
              <div className="literary-event">
                <h2>JAM</h2>
                <p>HE/SHE WOULD BE OBJECTED FOR THE FOLLOWING REASONS:</p>
                <p>USAGE OF SLANG, DIRECT SPEECH, AND ABBREVIATIONS.</p>
                <p>PLAGIARISM OR REDUNDANCY, DEVIATION FROM THE TOPIC/TIME-WASTING TACTICS.</p>
                <p>UNNECESSARY STRESS OR OBSESSION WITH WORDS, INCOHERENCE OR DRAMATIZATION.</p>
                <p>STANDARD FORMATS ARE NOT TO BE USED.</p>
                <p>1ST ROUND: WRITTEN ELIMINATION ROUND.</p>
              </div>
              
              <div className="literary-event">
                <h2>20Q</h2>
                <p>ONLY 2 MEMBERS PER TEAM.</p>
                <p>PRELIMS: THE TEAM MEMBERS WILL BE SEPARATED INTO TWO DIFFERENT ZOOMS.</p>
                <p>A LIST OF 20 ITEMS AND A BLANK SHEET WILL BE GIVEN.</p>
                <p>PARTICIPANTS WILL HAVE TO WRITE 3 ONE WORD CLUES FOR EACH ITEM ON THE LIST.</p>
                <p>SHEETS WILL THEN BE EXCHANGED WITH THEIR RESPECTIVE TEAMMATES.</p>
                <p>PROPER NOUNS ARE NOT ALLOWED.</p>
                <p>THE TIME ALLOTTED IS 20 MINUTES. 10 MINUTES ARE THEN ALLOTTED TO GUESS 3 ANSWERS BASED ON THE GIVEN CLUES.</p>
                <p>FINALS: STANDARD 20Q RULES.</p>
              </div>
              
              <div className="literary-event">
                <h2>BLINDFOLD TEXTING</h2>
                <p>A TEXT OF 160 CHARACTERS WILL BE READ OUT TO THE BLINDFOLDED PARTICIPANTS WHO HAVE TO TYPE IT ON THEIR PHONES.</p>
                <p>THE PARTICIPANT WITH THE MOST ACCURATE TEXT WINS.</p>
                <p>T9/PREDICTIVE TEXT AND AUTOCORRECT ARE NOT ALLOWED.</p>
                <p>NO RESTRICTIONS ON THE PHONE USED.</p>
              </div>
              
              <div className="literary-event">
                <h2>CREATIVE WRITING</h2>
                <p>WORD LIMIT: 1000 WORDS.</p>
                <p>THE TOPIC WILL BE GIVEN ON SPOT.</p>
                <p>TIME LIMIT: 75 MINUTES.</p>
              </div>
              
              <div className="literary-event">
                <h2>QUIZ</h2>
                <p>2 MEMBERS PER TEAM.</p>
                <p>THE NUMBER OF ROUNDS WILL BE DECIDED BY THE QUIZMASTER.</p>
                <p>ONE WRITTEN PRELIMINARY TEST, FROM WHICH TOP TEAMS WILL BE SELECTED FOR THE FINALS.</p>
              </div>
              
              <div className="literary-event">
                <h2>SPELL BEE</h2>
                <p>THIS IS A VERBAL EVENT.</p>
                <p>THE MEANINGS, USAGE AND ORIGIN WORDS WILL BE GIVEN ON DEMAND.</p>
                <p>DECISION OF THE JUDGES IS FINAL AND BINDING.</p>
              </div>
            </div>
          </div>
          
          <div className="general-rules-section">
            <h2>GENERAL RULES</h2>
            <div className="general-rules-content">
              <ol className="general-rules-list">
                <li>DECISIONS OF THE RESPECTIVE EVENT MASTERS ARE FINAL AND BINDING FOR ALL EVENTS.</li>
                <li>IF THE REGISTRATIONS ARE LESS THAN THREE, THEN THERE WILL BE NO CASH PRIZE.</li>
              </ol>
            </div>
          </div>
          
          <div className="literary-footer">
            <div className="registration-info">
              <h3>REGISTRATION</h3>
              <p>Register online before May 25, 2025</p>
              <p>Registration Fee: ₹150 per participant</p>
              <button className="register-btn">Register Now</button>
            </div>
            
            <div className="contact-info">
              <h3>CONTACT</h3>
              <p>Event Coordinator: Ananya Singh</p>
              <p>Email: literary@halcyon2025.com</p>
              <p>Phone: +91 9876543215</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="literary-background-elements">
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

export default Literary;
