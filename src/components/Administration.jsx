import React from 'react';
import './Administration.css';

const COMIC_EFFECTS = ['POW!', 'BAM!', 'BOOM!', 'WHAM!', 'ZAP!', 'KAPOW!', 'WOOF!', 'BLAM!', 'CRACK!'];

const CARD_COLORS = [
  { bg: '#FF1744', accent: '#FFEB3B', text: '#000000' },
  { bg: '#00B0FF', accent: '#FF1744', text: '#000000' },
  { bg: '#FFEB3B', accent: '#FF1744', text: '#000000' },
  { bg: '#9C27B0', accent: '#00E5FF', text: '#ffffff' },
  { bg: '#00E676', accent: '#FF1744', text: '#000000' },
  { bg: '#FF6D00', accent: '#FFEB3B', text: '#000000' },
  { bg: '#00B0FF', accent: '#FFEB3B', text: '#000000' },
  { bg: '#FF1744', accent: '#00E5FF', text: '#ffffff' },
  { bg: '#FFEB3B', accent: '#9C27B0', text: '#000000' },
];

function Administration() {
  return (
    <div className="administration comic-admin-wrapper" id="admin_anchor">

      {/* Halftone dot background */}
      <div className="comic-halftone-bg" />

      {/* Stars kept from original */}
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

      <div className="admin-container comic-admin-container">

        {/* Comic-style section header */}
        <div className="comic-admin-header-block">
          <div className="comic-admin-sound-left">BOOM!</div>
          <div className="comic-admin-title-wrap">
            <h1 className="comic-admin-title">ADMINISTRATION PANEL</h1>
            <div className="comic-admin-title-underline" />
          </div>
          <div className="comic-admin-sound-right">POW!</div>
        </div>

        <div className="admin-grid comic-admin-grid">
          {[
            { icon: 'fas fa-users',         title: 'Participant Manager',  desc: 'Manage event participants and registrations' },
            { icon: 'fas fa-user-tie',       title: 'Event Head Manager',   desc: 'Manage event heads and their permissions' },
            { icon: 'fas fa-user-cog',       title: 'Coordinator Manager',  desc: 'Manage event coordinators' },
            { icon: 'fas fa-calendar-check', title: 'Event Manager',        desc: 'Manage events, schedules, and details' },
            { icon: 'fas fa-credit-card',    title: 'Payments List',        desc: 'View and manage payment transactions' },
            { icon: 'fas fa-university',     title: 'College Manager',      desc: 'Manage college information and participation' },
            { icon: 'fas fa-graduation-cap', title: 'Stream Manager',       desc: 'Manage academic streams and categories' },
            { icon: 'fas fa-newspaper',      title: 'News Manager',         desc: 'Manage news and announcements' },
            { icon: 'fas fa-id-card',        title: 'Profile Administrator',desc: 'Manage administrator profiles and access' },
          ].map((card, i) => {
            const color = CARD_COLORS[i % CARD_COLORS.length];
            const effect = COMIC_EFFECTS[i % COMIC_EFFECTS.length];
            return (
              <div
                key={i}
                className="comic-admin-card"
                style={{ '--card-bg': color.bg, '--card-accent': color.accent, '--card-text': color.text }}
              >
                {/* Sound effect badge */}
                <span className="comic-card-sfx">{effect}</span>

                {/* Coloured header strip */}
                <div className="comic-card-header-strip">
                  <i className={`${card.icon} comic-card-icon`} />
                </div>

                {/* Card body */}
                <div className="comic-card-body">
                  <h3 className="comic-card-title">{card.title.toUpperCase()}</h3>
                  <p className="comic-card-desc">{card.desc}</p>
                  <a href="#" className="comic-card-btn">
                    ACCESS <span className="comic-card-btn-arrow">→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Administration;