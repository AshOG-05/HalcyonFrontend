import { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Pronites.css';

function Pronites() { // Component name kept as Pronites for file consistency
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [backgroundTransitioning, setBackgroundTransitioning] = useState(false);
  const [currentBackground, setCurrentBackground] = useState('');
  const [nextBackground, setNextBackground] = useState('');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const slideRef = useRef(null);
  const backgroundRef = useRef(null);
  const nextBackgroundRef = useRef(null);
  const contentRef = useRef(null);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  // Special guests data with the new images and Instagram information
  const specialGuestsData = [
    {
      id: 1,
      name: "DJ RUHI",
      date: "2nd May 2025",
      image: "/assets/dj1.jpg",
      alt: "DJ Ruhi",
      gradient: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url('/assets/dj1.jpg')",
      description: "DJ Ruhi, an international DJ & producer, brings high-energy, creative electronic and dance sets to Halcyon 2025.",
      instagram: "https://www.instagram.com/djruhi"
    },
    {
      id: 2,
      name: "Yamuna Srinidhi",
      date: "1st May 2025",
      image: "/assets/YamunaSrinidhi.webp",
      alt: "Yamuna Srinidhi",
      gradient: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url('/assets/YamunaSrinidhi.webp')",
      description: "Renowned Kannada Bharatanatyam dancer, choreographer, and actor.",
      icon: "fas fa-music",
      instagram: "https://www.instagram.com/yamuna_srinidhi_"
    },
    {
      id: 3,
      name: "DHARMENDRA",
      date: "2nd May 2025",
      image: "/assets/blogger.jpg",
      alt: "Dharmendra",
      gradient: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url('/assets/blogger.jpg')",
      description: "Dharmendra Kumar Arenahalli, a Mysuru-born civil engineer turned historian, shares Karnataka’s heritage through his Kannada platform ‘Mysoorina Kathegalu’, reviving interest in local history.",
      icon: "fas fa-laptop",
      instagram: "https://www.instagram.com/dharmendra5294"
    }
  ];

  // Handle touch start event
  const handleTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    // Calculate distance of swipe
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // If it's a left swipe, go to next slide
    if (isLeftSwipe && !isAnimating) {
      handleNext();
    }
    // If it's a right swipe, go to previous slide
    else if (isRightSwipe && !isAnimating) {
      handlePrevious();
    }
  };

  useEffect(() => {
    // Initialize backgrounds
    setCurrentBackground(specialGuestsData[0].gradient);
    setNextBackground(specialGuestsData[0].gradient);

    // Initialize AOS (Animate on Scroll) if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out',
        delay: 100
      });
    }

    // Add keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Add touch event listeners to slide
  useEffect(() => {
    const slide = slideRef.current;
    if (slide) {
      slide.addEventListener('touchstart', handleTouchStart, { passive: true });
      slide.addEventListener('touchmove', handleTouchMove, { passive: true });
      slide.addEventListener('touchend', handleTouchEnd);

      return () => {
        slide.removeEventListener('touchstart', handleTouchStart);
        slide.removeEventListener('touchmove', handleTouchMove);
        slide.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchStart, touchEnd]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setBackgroundTransitioning(true);

    const nextIndex = (index + 1) % specialGuestsData.length;
    setNextBackground(specialGuestsData[nextIndex].gradient);

    // Shorter transition for faster switching
    setTimeout(() => {
      setIndex(nextIndex);
      setCurrentBackground(specialGuestsData[nextIndex].gradient);
      setBackgroundTransitioning(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Reduced from 700ms
    }, 400); // Reduced from 700ms
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setBackgroundTransitioning(true);

    const prevIndex = (index - 1 + specialGuestsData.length) % specialGuestsData.length;
    setNextBackground(specialGuestsData[prevIndex].gradient);

    // Shorter transition for faster switching
    setTimeout(() => {
      setIndex(prevIndex);
      setCurrentBackground(specialGuestsData[prevIndex].gradient);
      setBackgroundTransitioning(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Reduced from 700ms
    }, 400); // Reduced from 700ms
  };



  const handleDotClick = (i) => {
    if (isAnimating || i === index) return;
    setIsAnimating(true);
    setBackgroundTransitioning(true);

    setNextBackground(specialGuestsData[i].gradient);

    // Shorter transition for faster switching
    setTimeout(() => {
      setIndex(i);
      setCurrentBackground(specialGuestsData[i].gradient);
      setBackgroundTransitioning(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Reduced from 700ms
    }, 400); // Reduced from 700ms
  };

  const currentGuest = specialGuestsData[index];

  return (
    <div className="pronites" id="special_guests">
      {/* Background layers with enhanced transitions */}
      <div
        className="pronites-background"
        ref={backgroundRef}
        style={{
          background: currentBackground,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: backgroundTransitioning ? 0 : 1
        }}
      ></div>

      <div
        className="pronites-background next-background"
        ref={nextBackgroundRef}
        style={{
          background: nextBackground,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: backgroundTransitioning ? 1 : 0
        }}
      ></div>

      <div className="pronites-container">
        {/* Updated title section with common heading style and animation */}
        <h1 className="section-heading" data-aos="fade-up">
          <span className="section-heading-text">SPECIAL GUESTS</span>
        </h1>
        <p className="pronites-subtitle" data-aos="fade-up" data-aos-delay="100">Experience unforgettable performances with our extraordinary guests at Halcyon 2025</p>

        <div className="pronites-content" ref={contentRef} data-aos="fade-up" data-aos-delay="200">
          {/* Enhanced navigation buttons */}
          <button
            className="nav-button prev-button"
            onClick={handlePrevious}
            disabled={isAnimating}
            aria-label="Previous guest"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Enhanced slide with better transitions and swipe functionality */}
          <div
            className="pronite-slide swipeable"
            ref={slideRef}
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: `translateY(${isAnimating ? '30px' : '0'}) scale(${isAnimating ? '0.98' : '1'})`,
              transition: 'opacity 0.4s ease, transform 0.4s ease' /* Reduced from 0.7s */
            }}
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <div className="pronite-info">
              <h2 className="pronite-name">{currentGuest.name}</h2>
              <div className="pronite-details">
                <div className="pronite-detail first-detail">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{currentGuest.date}</span>
                </div>
                <div className="pronite-detail last-detail">
                  <i className="fab fa-instagram"></i>
                  <a
                    href={currentGuest.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram-link"
                  >
                    @{currentGuest.instagram.split('/').pop()}
                  </a>
                </div>
              </div>
              <p className="pronite-description">{currentGuest.description}</p>
            </div>
            <div className="pronite-image-container" style={currentGuest.id === 2 ? { paddingTop: '30px' } : {}}>
              <div
                className="pronite-image"
                style={{
                  backgroundImage: `url(${currentGuest.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
              </div>
            </div>
          </div>

          {/* Enhanced navigation buttons */}
          <button
            className="nav-button next-button"
            onClick={handleNext}
            disabled={isAnimating}
            aria-label="Next guest"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Enhanced navigation dots */}
        <div className="pronite-dots" data-aos="fade-up" data-aos-delay="500">
          {specialGuestsData.map((guest, i) => (
            <button
              key={i}
              className={`pronite-dot ${i === index ? 'active' : ''}`}
              onClick={() => handleDotClick(i)}
              aria-label={`View ${guest.name}`}
              title={guest.name}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pronites; // Component name kept as Pronites for file consistency
