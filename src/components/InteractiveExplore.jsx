import React, { useState } from "react";

function InteractiveExplore() {
  const [activeId, setActiveId] = useState(1);

  const itemList = [
    {
      id: 1,
      title: "Dance",
      image: "/assets/astro-guitar.webp",
    },
    {
      id: 2,
      title: "Music",
      image: "/assets/blue-space.webp",
    },
    {
      id: 3,
      title: "Gaming",
      image: "/assets/goodies-space.webp",
    },
    {
      id: 4,
      title: "Theatre",
      image: "/assets/gradient.webp",
    },
    {
      id: 5,
      title: "Fine Arts",
      image: "/assets/bg_astronaut.webp",
    },
    {
      id: 6,
      title: "Literary",
      image: "/assets/circular.png",
    },
  ];

  return (
    <div className="interactive-explore">
      <h1 className="explore-title">Events</h1>

      <section className="flex-cards-section">
        {itemList.map((item) => (
          <article
            key={item.id}
            className={`flex-card-container ${activeId === item.id ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${item.image})`,
            }}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
          >
            <div className="card-overlay">
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
