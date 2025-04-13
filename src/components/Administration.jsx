import React from 'react';
import './Administration.css';

function Administration() {
  return (
    <div className="administration panel" id="admin_anchor">
      <div className="admin-stars-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="admin-star"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
              animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
            }}
          />
        ))}
      </div>
      <div className="admin-container">
        <h1 className="admin-title">Administration Panel</h1>

        <div className="admin-grid">
          <div className="admin-card">
            <i className="fas fa-users"></i>
            <h3>Participant Manager</h3>
            <p>Manage event participants and registrations</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-user-tie"></i>
            <h3>Event Head Manager</h3>
            <p>Manage event heads and their permissions</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-user-cog"></i>
            <h3>Coordinator Manager</h3>
            <p>Manage event coordinators</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-calendar-check"></i>
            <h3>Event Manager</h3>
            <p>Manage events, schedules, and details</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-credit-card"></i>
            <h3>Payments List</h3>
            <p>View and manage payment transactions</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-university"></i>
            <h3>College Manager</h3>
            <p>Manage college information and participation</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-graduation-cap"></i>
            <h3>Stream Manager</h3>
            <p>Manage academic streams and categories</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-newspaper"></i>
            <h3>News Manager</h3>
            <p>Manage news and announcements</p>
            <a href="#" className="admin-btn">Access</a>
          </div>

          <div className="admin-card">
            <i className="fas fa-id-card"></i>
            <h3>Profile Administrator</h3>
            <p>Manage administrator profiles and access</p>
            <a href="#" className="admin-btn">Access</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Administration;
