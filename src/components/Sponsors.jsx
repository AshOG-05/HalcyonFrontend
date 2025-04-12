import { useState, useEffect } from 'react';

function Sponsors() {
  const [isVisible, setIsVisible] = useState(false);

  // Sample sponsors data organized by tier
  const sponsorTiers = [
    {
      tier: 'Platinum',
      sponsors: [
        { id: 1, name: 'Discord', logo: 'https://parentzone.org.uk/sites/default/files/discord_logo_wordmark_2400.0.jpg', website: 'https://discord.com' },
        { id: 2, name: 'Amazon', logo: 'https://manalokam.com/wp-content/uploads/2020/07/amazon-1.jpg', website: 'https://amazon.com' },
      ]
    },
    {
      tier: 'Gold',
      sponsors: [
        { id: 3, name: 'SpaceX', logo: 'https://i.pinimg.com/originals/ac/b8/9e/acb89e4a6af2c379a62ed023016a827b.png', website: 'https://spacex.com' },
        { id: 4, name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png', website: 'https://google.com' },
        { id: 5, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png', website: 'https://microsoft.com' },
      ]
    },
    {
      tier: 'Silver',
      sponsors: [
        { id: 6, name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/1200px-Adobe_Corporate_Logo.png', website: 'https://adobe.com' },
        { id: 7, name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1200px-IBM_logo.svg.png', website: 'https://ibm.com' },
        { id: 8, name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1200px-Intel_logo_%282006-2020%29.svg.png', website: 'https://intel.com' },
        { id: 9, name: 'Nvidia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1200px-Nvidia_logo.svg.png', website: 'https://nvidia.com' },
      ]
    }
  ];

  useEffect(() => {
    // Add intersection observer to trigger animation when section is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.2 });

    const sponsorsSection = document.querySelector('#sponsors_anchor');
    if (sponsorsSection) {
      observer.observe(sponsorsSection);
    }

    return () => {
      if (sponsorsSection) {
        observer.unobserve(sponsorsSection);
      }
    };
  }, []);

  return (
    <div className={`sponsors-section ${isVisible ? 'visible' : ''}`} id="sponsors_anchor">
      <div className="sponsors-container">
        <div className="sponsors-header">
          <h1 className="sponsors-title">
            <span data-aos="fade-right">OUR</span>
            <span data-aos="fade-left">SPONSORS</span>
          </h1>
          <p className="sponsors-subtitle">Proudly supported by industry leaders</p>
        </div>

        <div className="sponsors-content">
          {sponsorTiers.map((tier, tierIndex) => (
            <div
              key={tier.tier}
              className={`sponsor-tier tier-${tier.tier.toLowerCase()}`}
              style={{ '--delay': `${tierIndex * 0.2}s` }}
            >
              <div className="tier-header">
                <h2>{tier.tier}</h2>
                <div className="tier-line"></div>
              </div>

              <div className="tier-sponsors">
                {tier.sponsors.map((sponsor, sponsorIndex) => (
                  <div
                    key={sponsor.id}
                    className="sponsor-card"
                    style={{ '--delay': `${(tierIndex * 0.2) + (sponsorIndex * 0.1)}s` }}
                  >
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sponsor-link"
                    >
                      <div className="sponsor-logo-container">
                        <img
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          className="sponsor-logo"
                        />
                      </div>
                      <div className="sponsor-overlay">
                        <span className="sponsor-name">{sponsor.name}</span>
                        <span className="sponsor-visit">Visit Website</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sponsors-cta">
          <h3>Interested in sponsoring our event?</h3>
          <a href="#contact_anchor" className="sponsor-cta-button">
            <span>Become a Sponsor</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <div className="sponsors-background">
        <div className="sponsors-shape shape-1"></div>
        <div className="sponsors-shape shape-2"></div>
        <div className="sponsors-dots"></div>
      </div>
    </div>
  );
}

export default Sponsors;