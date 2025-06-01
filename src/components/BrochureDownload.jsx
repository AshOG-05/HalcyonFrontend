import React from 'react';
import './BrochureDownload.css';

function BrochureDownload() {
  return (
    <div className="brochure-download-section">
      <div className="brochure-container">
        <div className="brochure-content">
          <h2>Halcyon 2025 Brochure</h2>
          <p>Download our official event brochure to learn more about all the exciting events and activities.</p>
          <a href="/assets/Halcyon_2025.pdf" download className="download-button">
            <i className="fas fa-download"></i> Download Brochure
          </a>
        </div>
      </div>
    </div>
  );
}

export default BrochureDownload;
