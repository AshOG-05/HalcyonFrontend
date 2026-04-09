/* -----------------------------------------------
/* Particles.js - Simple version for React
/* ----------------------------------------------- */

// Main particlesJS function
window.particlesJS = function(selector, options) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById(selector);

  if (!container) return;

  // Clear any existing canvas
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Add canvas to container
  container.appendChild(canvas);

  // Set canvas size
  const resize = () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };

  resize();
  window.addEventListener('resize', resize);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = Math.random() * 0.2 - 0.1;
      this.vy = Math.random() * 0.2 - 0.1;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random();
      this.opacityChange = Math.random() * 0.01 - 0.005;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Change opacity
      this.opacity += this.opacityChange;
      if (this.opacity <= 0 || this.opacity >= 1) {
        this.opacityChange = -this.opacityChange;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particles = [];
  const particleCount = options?.particles?.number?.value || 80;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
};
