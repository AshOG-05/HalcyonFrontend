import React, { useState, useEffect } from "react";

function InteractiveExplore() {
  const [activeId, setActiveId] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile and handle scroll events
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Handle scroll for mobile view
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        const cardsSection = document.querySelector('.flex-cards-section');
        if (!cardsSection) return;

        const cards = Array.from(cardsSection.querySelectorAll('.flex-card-container'));
        if (!cards.length) return;

        // Get the position of each card relative to the viewport
        const cardPositions = cards.map(card => {
          const rect = card.getBoundingClientRect();
          return {
            id: parseInt(card.getAttribute('data-id')),
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height
          };
        });

        // Find the card that is most visible in the viewport
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;

        let closestCard = null;
        let closestDistance = Infinity;

        cardPositions.forEach(card => {
          const cardCenter = (card.top + card.bottom) / 2;
          const distance = Math.abs(cardCenter - viewportCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = card;
          }
        });

        if (closestCard && closestCard.id !== activeId) {
          setActiveId(closestCard.id);
        }
      }
    };

    // Add scroll event listener for mobile
    if (window.innerWidth <= 768) {
      window.addEventListener('scroll', handleScroll);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeId]);

  const itemList = [
    {
      id: 1,
      title: "Dance",
      image: "/assets/DomainImages/dance1-removebg-preview.png",
    },
    {
      id: 2,
      title: "Music",
      image: "/assets/DomainImages/music-removebg-preview.png",
    },
    {
      id: 3,
      title: "Gaming",
      image: "/assets/DomainImages/gam-removebg-preview.png",
    },
    {
      id: 4,
      title: "Theatre",
      image: "/assets/DomainImages/theatre3-removebg-preview.png",
    },
    {
      id: 5,
      title: "Fine Arts",
      image: "/assets/DomainImages/finearts-removebg-preview.png",
    },
    {
      id: 6,
      title: "Literary",
      image: "/assets/DomainImages/literary-removebg-preview.png",
    },
  ];

  return (
    <div className="interactive-explore">
      <h1 className="explore-title">Events</h1>

      <section className="flex-cards-section">
        {itemList.map((item) => (
          <article
            key={item.id}
            data-id={item.id}
            className={`flex-card-container ${activeId === item.id ? 'active' : ''}`}
            style={{
              backgroundImage: isMobile ? 'none' : `url(${item.image})`,
              backgroundColor: isMobile ? '#111111' : 'transparent',
              ...(isMobile && activeId === item.id ? { height: '15rem' } : {})
            }}
            onMouseEnter={() => !isMobile && setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
          >
            <div className="card-overlay">
              {isMobile && <i className={`card-icon ${
                item.title === 'Dance' ? 'fas fa-music' :
                item.title === 'Music' ? 'fas fa-guitar' :
                item.title === 'Gaming' ? 'fas fa-gamepad' :
                item.title === 'Theatre' ? 'fas fa-theater-masks' :
                item.title === 'Fine Arts' ? 'fas fa-paint-brush' :
                'fas fa-book'
              }`}></i>}
              <h1 className="card-title">{item.title}</h1>
            </div>
            {item.title === 'Dance' ? (
              <a href="/events/dance" className="card-link">
                <div className="card-link-overlay"></div>
              </a>
            ) : item.title === 'Music' ? (
              <a href="/events/music" className="card-link">
                <div className="card-link-overlay"></div>
              </a>
            ) : item.title === 'Gaming' ? (
              <a href="/events/gaming" className="card-link">
                <div className="card-link-overlay"></div>
              </a>
            ) : item.title === 'Theatre' ? (
              <a href="/events/theatre" className="card-link">
                <div className="card-link-overlay"></div>
              </a>
            ) : item.title === 'Fine Arts' ? (
              <a href="/events/finearts" className="card-link">
                <div className="card-link-overlay"></div>
              </a>
            ) : item.title === 'Literary' ? (
              <a href="/events/literary" className="card-link">
                <div className="card-link-overlay"></div>
              </a>
            ) : (
              <a href="#" className="card-link">
                <div className="card-link-overlay"></div>
              </a>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

export default InteractiveExplore;
