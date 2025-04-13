import React, { useState } from "react";

function InteractiveExplore() {
  const [activeId, setActiveId] = useState(1);

  const itemList = [
    {
      id: 1,
      title: "Music",
      image: "/assets/blue-space.webp",
    },
    {
      id: 2,
      title: "Dance",
      image: "/assets/astro-guitar.webp",
    },
    {
      id: 3,
      title: "Tech",
      image: "/assets/goodies-space.webp",
    },
    {
      id: 4,
      title: "Arts",
      image: "/assets/gradient.webp",
    },
    {
      id: 5,
      title: "Sports",
      image: "/assets/bg_astronaut.webp",
    },
  ];

  return (
    <div className="interactive-explore">
      <h1 className="explore-title">Explore Your Interests</h1>

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
            <a href="#" className="card-link">
              <div className="card-link-overlay"></div>
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}

export default InteractiveExplore;
