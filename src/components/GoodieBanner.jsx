import { useState, useEffect } from 'react';

function GoodieBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Goodies data with actual images
  const goodies = [
    { id: 1, name: 'Festival T-Shirt', price: '₹499', image: '/assets/tshirt.webp', icon: 'fas fa-tshirt' },
    { id: 2, name: 'Coffee Mug', price: '₹299', image: '/assets/mug.webp', icon: 'fas fa-mug-hot' },
    { id: 3, name: 'Cap', price: '₹349', image: '/assets/cap.webp', icon: 'fas fa-hat-cowboy' },
    { id: 4, name: 'Wristband', price: '₹199', image: '/assets/wristband.webp', icon: 'fas fa-hand-paper' },
  ];

  useEffect(() => {
    // Add intersection observer to trigger animation when section is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.3 });

    const goodieBanner = document.querySelector('.goodie-banner');
    if (goodieBanner) {
      observer.observe(goodieBanner);
    }

    return () => {
      if (goodieBanner) {
        observer.unobserve(goodieBanner);
      }
    };
  }, []);

  return (
    <div className={`goodie-banner ${isVisible ? 'visible' : ''}`}>
      <div className="goodie-banner-content">
        <div className="goodie-header">
          <h1 className="goodie-title">
            <span className="goodie-title-text">FESTIVAL</span>
            <span className="goodie-title-highlight">GOODIES</span>
          </h1>
          <p className="goodie-subtitle">Take home memories of Essence Festival with our exclusive merchandise</p>
        </div>

        <div className="goodie-preview">
          <div className="goodie-items">
            {goodies.map((goodie) => (
              <div key={goodie.id} className="goodie-item">
                <div className="goodie-item-icon">
                  <i className={goodie.icon}></i>
                </div>
                <div className="goodie-item-info">
                  <h3>{goodie.name}</h3>
                  <p>{goodie.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`goodie-cta ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <a href="./goodies/" className="goodie-button">
              <span className="goodie-button-text">EXPLORE ALL GOODIES</span>
              <span className="goodie-button-icon">
                <i className="fas fa-arrow-right"></i>
              </span>
            </a>

            <div className="goodie-particles">
              {[...Array(20)].map((_, i) => (
                <span
                  key={i}
                  className="particle"
                  style={{
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`,
                    '--size': `${Math.random() * 2 + 1}px`,
                    '--delay': `${Math.random() * 2}s`,
                    '--duration': `${Math.random() * 2 + 2}s`,
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="goodie-background">
        <div className="goodie-shape shape-1"></div>
        <div className="goodie-shape shape-2"></div>
        <div className="goodie-shape shape-3"></div>
      </div>
    </div>
  );
}

export default GoodieBanner;