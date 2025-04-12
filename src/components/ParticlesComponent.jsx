import { useEffect, useRef } from 'react';

function ParticlesComponent() {
  const particlesRef = useRef(null);

  useEffect(() => {
    // Create stars manually instead of using particles.js
    const createStars = () => {
      const container = particlesRef.current;
      if (!container) return;

      // Clear existing content
      container.innerHTML = '';

      // Set container style
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.overflow = 'hidden';
      container.style.zIndex = '-1';

      // Create stars
      const starCount = 150;

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random().toString();
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite alternate`;
        container.appendChild(star);
      }

      // Add keyframes for twinkling
      const style = document.createElement('style');
      style.textContent = `
        @keyframes twinkle {
          0% { opacity: ${Math.random() * 0.5 + 0.1}; }
          100% { opacity: ${Math.random() * 0.5 + 0.5}; }
        }
      `;
      document.head.appendChild(style);
    };

    createStars();

    // Recreate stars on window resize
    window.addEventListener('resize', createStars);

    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, []);

  return <div id="particles-js" ref={particlesRef} />;
}

export default ParticlesComponent;