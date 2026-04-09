# Pop Comics Theme Implementation Guide
## Complete Detailed Changes for Every Page & Component

---

## TABLE OF CONTENTS
1. [Global Theme Setup](#global-theme-setup)
2. [Main Entry Points](#main-entry-points)
3. [Components](#components)
4. [Pages](#pages)
5. [CSS Utilities & Mixins](#css-utilities--mixins)
6. [Font Requirements](#font-requirements)

---

## GLOBAL THEME SETUP

### ✅ Update: `src/theme/colors.css`

**Current Status:** Already has Comic Pop Art colors defined (GOOD!)

**Additional Changes Needed:**

```css
/* Add these NEW variables to :root */

/* COMIC POP FONTS - Add to resources */
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Righteous&display=swap');

:root {
  /* Add Comic Sound Effects Font */
  --font-comic-bold: 'Fredoka One', cursive;
  --font-comic-impact: 'Righteous', sans-serif;
  
  /* Add Shadow Effects for Comic Feel */
  --shadow-comic-small: 3px 3px 0px rgba(0, 0, 0, 0.3);
  --shadow-comic-medium: 5px 5px 0px rgba(0, 0, 0, 0.4);
  --shadow-comic-large: 8px 8px 0px rgba(0, 0, 0, 0.5);
  
  /* Comic Text Effects */
  --text-shadow-comic: 2px 2px 0px rgba(0, 0, 0, 0.5);
  --text-shadow-white: 2px 2px 0px rgba(255, 255, 255, 0.8);
  
  /* Additional Comic Borders */
  --border-comic-thin: 2px solid;
  --border-comic-medium: 3px solid;
  --border-comic-thick: 5px solid;
  
  /* Comic Glow Effects - Added variants */
  --glow-effect-strong: 0 0 25px rgba(255, 255, 255, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.3);
  --glow-effect-neon: 0 0 20px currentColor, 0 0 10px currentColor;
}

/* Add Comic Sound Effect Classes */
.comic-sound-effect {
  font-family: var(--font-comic-bold);
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: var(--text-shadow-comic);
  animation: popComicPunch 0.3s ease-out;
}

@keyframes popComicPunch {
  0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

---

## MAIN ENTRY POINTS

### 1. App.jsx

**File:** `src/App.jsx`

**Changes:**

```jsx
// 1. ADD AT TOP: Comic theme wrapper styling
import './theme/comicTheme.css'; // Create this new file

// 2. UPDATE: Loading screen with comic effect
// Current: Black background with logo
// Change: Add comic-style frame and POW/BAM effect

// Within the loading div, replace with:
<div className="comic-loading-container">
  <div className="comic-loading-frame">
    <div className="comic-sound-effect comic-pow">POW!</div>
    <img
      src="/assets/final LOGO.png"
      alt="Preloader"
      className="comic-logo-pulse"
    />
    <div className="comic-loading-text">Getting Ready To Rock...</div>
  </div>
</div>

// 3. Add CSS animation in App.css:
// - .comic-loading-frame: Black border with yellow/red halftone background
// - .comic-logo-pulse: Pulsing scale animation
// - .comic-pow: Positioned at top-right with rotation and scale animations
```

**CSS Additions for App.css:**

```css
.comic-loading-container {
  background: linear-gradient(135deg, #FF1744 0%, #00B0FF 50%, #FFEB3B 100%);
  background-image: 
    repeating-radial-gradient(circle at 10% 20%, rgba(0,0,0,0.1) 2px, transparent 2px),
    linear-gradient(135deg, #FF1744 0%, #00B0FF 50%, #FFEB3B 100%);
  background-size: 100% 100%, 100% 100%;
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
}

.comic-loading-frame {
  border: 8px solid #000000;
  border-radius: 12px;
  padding: 3rem;
  background: white;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), 
              inset 0 0 20px rgba(255, 235, 59, 0.2);
  position: relative;
  z-index: 2;
}

.comic-logo-pulse {
  animation: pulseComicLogo 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 23, 68, 0.6));
}

@keyframes pulseComicLogo {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.comic-pow {
  position: absolute;
  top: -20px;
  right: -20px;
  color: #FF1744;
  animation: popComicPunch 0.5s ease-out 0.3s both;
}

.comic-loading-text {
  text-align: center;
  margin-top: 1.5rem;
  font-family: var(--font-comic-bold);
  font-size: 1.2rem;
  color: #000000;
  letter-spacing: 2px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

---

### 2. main.jsx

**File:** `src/main.jsx`

**Changes:** (Minimal - mostly theme setup)

```jsx
// 1. Ensure global theme imports are at TOP
import './theme/colors.css';
import './theme/comicTheme.css'; // Create new file
import './index.css';

// 2. Add comment at top
// | POP COMICS THEME - Enhanced with vibrant colors, halftone patterns, and dynamic effects |
```

---

## COMPONENTS

### 1. Banner.jsx

**File:** `src/components/Banner.jsx`

**Current Status:** Has basic navbar and countdown

**Detailed Changes:**

```jsx
// 1. UPDATE: Import comic font and styles
import './Banner.css';
import './ComicBannerEffects.css'; // Create new file

// 2. COUNTDOWN TIMER - Add comic styling
// Replace countdown timer display with:

<div className="comic-countdown-container">
  <div className="comic-countdown-title">
    <span className="comic-sound-effect">⚡ COUNTDOWN ⚡</span>
  </div>
  
  <div className="countdown-grid">
    <div className="countdown-item comic-panel-red">
      <div className="countdown-value">{days}</div>
      <div className="countdown-label">DAYS</div>
    </div>
    <div className="countdown-item comic-panel-blue">
      <div className="countdown-value">{hours}</div>
      <div className="countdown-label">HOURS</div>
    </div>
    <div className="countdown-item comic-panel-yellow">
      <div className="countdown-value">{minutes}</div>
      <div className="countdown-label">MINUTES</div>
    </div>
    <div className="countdown-item comic-panel-purple">
      <div className="countdown-value">{seconds}</div>
      <div className="countdown-label">SECONDS</div>
    </div>
  </div>
</div>

// 3. UPDATE: Main banner section styling
// - Add gradient background with halftone pattern
// - Apply comic-panel class with thick borders
// - Add animated glow effects
```

**CSS Additions for Banner.css:**

```css
.comic-counting-container {
  background: linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000),
              linear-gradient(45deg, #000000 25%, transparent 25%, transparent 75%, #000000 75%, #000000);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  background-color: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 90%;
}

.comic-countdown-title {
  text-align: center;
  margin-bottom: 2rem;
  font-family: var(--font-comic-bold);
  font-size: 2.5rem;
  animation: bounceComic 2s infinite;
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.countdown-item {
  padding: 1.5rem;
  text-align: center;
  border: 4px solid;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.countdown-item:hover {
  transform: translateY(-5px);
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.4);
}

.countdown-value {
  font-family: var(--font-comic-impact);
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
}

.countdown-label {
  font-family: var(--font-comic-bold);
  font-size: 0.9rem;
  font-weight: 700;
  margin-top: 0.5rem;
  letter-spacing: 1px;
}

@keyframes bounceComic {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

### 2. About.jsx

**File:** `src/components/About.jsx`

**Current Status:** Has decorative elements and animations

**Detailed Changes:**

```jsx
// 1. UPDATE: About section styling
// Replace: <div className="about panel">
// With: <div className="about comic-panel comic-about-container">

// 2. ADD: Comic-style section title
<div className="comic-section-header">
  <h1 className="comic-title-text">ABOUT HALCYON</h1>
  <div className="comic-title-underline"></div>
</div>

// 3. ADD: Comic thought bubble for about text
<div className="comic-thought-bubble">
  <p className="comic-body-text">
    [Your about text here]
  </p>
</div>

// 4. ENHANCE: Decorative elements with comic styling
// Add comic-style badges or stamps around astronaut/planet images
<div className="comic-badge comic-badge-red">
  AMAZING!
</div>
<div className="comic-badge comic-badge-blue">
  POW!
</div>
```

**CSS Additions for About.css:**

```css
.comic-about-container {
  background: linear-gradient(135deg, #f8fafc 0%, #FFEB3B 100%);
  border: 5px solid #000000;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.4),
              inset 0 0 20px rgba(255, 235, 59, 0.2);
}

.comic-section-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.comic-title-text {
  font-family: var(--font-comic-bold);
  font-size: 3rem;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: var(--text-shadow-white);
  margin: 0;
}

.comic-title-underline {
  height: 4px;
  background: linear-gradient(90deg, #FF1744, #00B0FF, #FFEB3B, #9C27B0);
  margin-top: 1rem;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 23, 68, 0.5);
}

.comic-thought-bubble {
  background: white;
  border: 4px solid #000000;
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
}

.comic-thought-bubble::before {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 0 solid transparent;
  border-top: 15px solid white;
  border-bottom: 0 solid transparent;
}

.comic-thought-bubble::after {
  content: '';
  position: absolute;
  bottom: -25px;
  left: 20px;
  width: 8px;
  height: 8px;
  background: white;
  border: 2px solid #000000;
  border-radius: 50%;
  box-shadow: -12px -8px 0 -2px white, -12px -8px 0 0 #000000;
}

.comic-body-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #000000;
  margin: 0;
}

.comic-badge {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-comic-bold);
  font-size: 0.8rem;
  font-weight: 900;
  text-align: center;
  border: 4px solid #000000;
  transform: rotate(-15deg);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3), 4px 4px 0px rgba(0, 0, 0, 0.2);
  animation: rotateBadge 4s linear infinite;
}

.comic-badge-red {
  background: linear-gradient(135deg, #FF1744, #FF5252);
  color: white;
  text-shadow: var(--text-shadow-comic);
}

.comic-badge-blue {
  background: linear-gradient(135deg, #00B0FF, #00E5FF);
  color: #000000;
}

@keyframes rotateBadge {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
}
```

---

### 3. Explore.jsx

**File:** `src/components/Explore.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Category cards with comic styling
// Replace card structure with comic-themed cards:

<div className="explore-grid comic-explore-grid">
  {categories.map(category => (
    <div 
      key={category.id} 
      className={`comic-category-card comic-category-${category.slug}`}
    >
      <div className="comic-card-header">
        <h3 className="comic-card-title">{category.name.toUpperCase()}</h3>
        <span className="comic-sound-effect comic-card-effect">
          {getRandomComicEffect()}
        </span>
      </div>
      
      <div className="comic-card-content">
        <img 
          src={category.image} 
          alt={category.name}
          className="comic-card-image"
        />
      </div>
      
      <div className="comic-card-footer">
        <button className="comic-button comic-button-primary">
          EXPLORE NOW
        </button>
      </div>
    </div>
  ))}
</div>

// 2. ADD: Function for random comic effects
const getRandomComicEffect = () => {
  const effects = ['POW!', 'BAM!', 'BOOM!', 'WHAM!', 'ZAPP!'];
  return effects[Math.floor(Math.random() * effects.length)];
};
```

**CSS Additions for Explore.css:**

```css
.comic-explore-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.comic-category-card {
  border: 5px solid #000000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  position: relative;
  background: white;
  cursor: pointer;
}

.comic-category-card:hover {
  transform: translateY(-10px) rotate(2deg);
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.5);
}

.comic-category-dance { border-color: var(--color-dance); }
.comic-category-music { border-color: var(--color-music); }
.comic-category-gaming { border-color: var(--color-gaming); }
.comic-category-theatre { border-color: var(--color-theatre); }
.comic-category-finearts { border-color: var(--color-finearts); }
.comic-category-literary { border-color: var(--color-literary); }

.comic-card-header {
  padding: 1rem;
  border-bottom: 4px solid #000000;
  background: linear-gradient(135deg, #FF1744, #FFEB3B);
  position: relative;
}

.comic-card-title {
  font-family: var(--font-comic-bold);
  font-size: 1.3rem;
  color: #000000;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 2px;
  font-weight: 900;
}

.comic-card-effect {
  position: absolute;
  top: -15px;
  right: 10px;
  font-size: 1.2rem;
  color: #00B0FF;
}

.comic-card-content {
  padding: 1rem;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.comic-card-image {
  max-width: 100%;
  max-height: 180px;
  object-fit: cover;
  filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.2));
}

.comic-card-footer {
  padding: 1rem;
  border-top: 3px solid #000000;
  background: #f8fafc;
}

.comic-button {
  width: 100%;
  padding: 0.75rem;
  border: 3px solid #000000;
  border-radius: 6px;
  font-family: var(--font-comic-bold);
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
}

.comic-button:hover {
  transform: translateY(-3px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
}

.comic-button-primary {
  background: var(--color-red);
  color: white;
}
```

---

### 4. Navbar.jsx

**File:** `src/components/Navbar.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Navbar styling with comic look
// Add to navbar container: className="comic-navbar"

// 2. UPDATE: Logo with comic styling
<div className="comic-logo-container">
  <img src="/logo.png" alt="Halcyon" className="comic-logo" />
  <span className="comic-logo-text">HALCYON 2026</span>
</div>

// 3. UPDATE: Navigation links with comic styling
<nav className="comic-nav-menu">
  {navItems.map(item => (
    <a 
      key={item.id}
      href={item.link}
      className="comic-nav-link"
    >
      {item.name}
    </a>
  ))}
</nav>

// 4. ADD: Comic-style login button
<button className="comic-login-btn">ENTER</button>
```

**CSS Additions for Navbar.css:**

```css
.comic-navbar {
  background: linear-gradient(90deg, #000000 0%, #1a1a1a 100%);
  border-bottom: 5px solid #FFEB3B;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(255, 235, 59, 0.3);
}

.comic-logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.comic-logo {
  height: 50px;
  filter: drop-shadow(0 0 8px rgba(255, 235, 59, 0.6));
  animation: glowPulse 2s ease-in-out infinite;
}

.comic-logo-text {
  font-family: var(--font-comic-bold);
  font-size: 1.3rem;
  color: #FFEB3B;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0px #000000;
}

@keyframes glowPulse {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 235, 59, 0.6)); }
  50% { filter: drop-shadow(0 0 15px rgba(255, 235, 59, 0.9)); }
}

.comic-nav-menu {
  display: flex;
  gap: 2rem;
}

.comic-nav-link {
  font-family: var(--font-comic-bold);
  color: #FFEB3B;
  text-decoration: none;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  font-weight: 700;
  transition: all 0.3s ease;
}

.comic-nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #FF1744, #00B0FF);
  transition: width 0.3s ease;
}

.comic-nav-link:hover::after {
  width: 100%;
}

.comic-login-btn {
  background: linear-gradient(135deg, #FF1744, #FFEB3B);
  color: #000000;
  border: 3px solid #000000;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-family: var(--font-comic-bold);
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.comic-login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
}
```

---

### 5. EventModal.jsx & EventForm.jsx

**Files:** `src/components/EventModal.jsx` & `src/components/EventForm.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Modal container
// Wrap modal in comic-styled container
<div className="comic-modal-overlay">
  <div className="comic-modal-container comic-panel">
    <div className="comic-modal-header">
      <h2 className="comic-modal-title">EVENT REGISTRATION</h2>
      <div className="comic-sound-effect">BOOM!</div>
      <button 
        onClick={onClose} 
        className="comic-close-btn"
      >
        ✕
      </button>
    </div>
    
    <div className="comic-modal-content">
      {/* Form content */}
    </div>
    
    <div className="comic-modal-footer">
      <button className="comic-btn-secondary">CANCEL</button>
      <button className="comic-btn-primary">REGISTER!</button>
    </div>
  </div>
</div>

// 2. UPDATE: Form inputs
// Wrap inputs in comic-styled containers
<div className="comic-form-group">
  <label className="comic-form-label">{label}</label>
  <input 
    type={type}
    className="comic-form-input"
    placeholder={placeholder}
  />
</div>

// 3. UPDATE: Select dropdowns
<div className="comic-form-group">
  <label className="comic-form-label">{label}</label>
  <select className="comic-form-select">
    {/* Options */}
  </select>
</div>
```

**CSS Additions:**

```css
.comic-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.comic-modal-container {
  background: white;
  border: 5px solid #000000;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.5),
              inset 0 0 30px rgba(255, 235, 59, 0.1);
}

.comic-modal-header {
  background: linear-gradient(135deg, #FF1744, #00B0FF);
  border-bottom: 4px solid #000000;
  padding: 1.5rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.comic-modal-title {
  font-family: var(--font-comic-bold);
  font-size: 1.8rem;
  color: #000000;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 2px;
  flex: 1;
  text-shadow: var(--text-shadow-white);
}

.comic-close-btn {
  background: #FFEB3B;
  color: #000000;
  border: 3px solid #000000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  transition: all 0.2s ease;
}

.comic-close-btn:hover {
  transform: rotate(90deg) scale(1.1);
}

.comic-modal-content {
  padding: 2rem;
}

.comic-form-group {
  margin-bottom: 1.5rem;
}

.comic-form-label {
  font-family: var(--font-comic-bold);
  font-size: 0.95rem;
  color: #000000;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.comic-form-input,
.comic-form-select {
  width: 100%;
  padding: 0.75rem;
  border: 3px solid #000000;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  background: white;
  color: #000000;
  transition: all 0.3s ease;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.comic-form-input:focus,
.comic-form-select:focus {
  outline: none;
  border-color: #FF1744;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1),
              0 0 10px rgba(255, 23, 68, 0.4);
}

.comic-modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 4px solid #000000;
  background: #f8fafc;
}

.comic-btn-secondary,
.comic-btn-primary {
  flex: 1;
  padding: 0.9rem;
  border: 3px solid #000000;
  border-radius: 6px;
  font-family: var(--font-comic-bold);
  font-size: 0.95rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
}

.comic-btn-secondary {
  background: #FFEB3B;
  color: #000000;
}

.comic-btn-primary {
  background: #FF1744;
  color: white;
}

.comic-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
}

.comic-btn-secondary:hover {
  background: #FFD54F;
}
```

---

### 6. Footer.jsx

**File:** `src/components/Footer.jsx`

**Detailed Changes:**

```jsx
// UPDATE: Footer with comic styling
<footer className="comic-footer">
  <div className="comic-footer-container">
    <div className="comic-footer-section">
      <h4 className="comic-footer-title">QUICK LINKS</h4>
      <ul className="comic-footer-links">
        {/* Links */}
      </ul>
    </div>
    
    <div className="comic-footer-section">
      <h4 className="comic-footer-title">FOLLOW US</h4>
      <div className="comic-social-icons">
        {/* Social icons */}
      </div>
    </div>
    
    <div className="comic-footer-divider"></div>
    
    <div className="comic-footer-bottom">
      <p className="comic-footer-copyright">
        © 2026 HALCYON - ALL RIGHTS RESERVED ®
      </p>
      <div className="comic-footer-badges">
        <span className="comic-footer-badge">EPIC</span>
        <span className="comic-footer-badge">AWESOME</span>
      </div>
    </div>
  </div>
</footer>
```

**CSS for Footer.css:**

```css
.comic-footer {
  background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
  border-top: 5px solid #FF1744;
  padding: 3rem 2rem;
  margin-top: 3rem;
}

.comic-footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.comic-footer-section {
  margin-bottom: 2rem;
}

.comic-footer-title {
  font-family: var(--font-comic-bold);
  color: #FFEB3B;
  text-transform: uppercase;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0px #000000;
}

.comic-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comic-footer-links li {
  margin-bottom: 0.5rem;
}

.comic-footer-links a {
  color: #00E5FF;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
}

.comic-footer-links a:hover {
  color: #FFEB3B;
  text-shadow: 0 0 8px rgba(255, 235, 59, 0.6);
}

.comic-social-icons {
  display: flex;
  gap: 1rem;
}

.comic-social-icon {
  width: 45px;
  height: 45px;
  border: 2px solid #FFEB3B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFEB3B;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 235, 59, 0.3);
}

.comic-social-icon:hover {
  background: #FFEB3B;
  color: #000000;
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 0 20px rgba(255, 235, 59, 0.6);
}

.comic-footer-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFEB3B, transparent);
  margin: 2rem 0;
}

.comic-footer-bottom {
  text-align: center;
  padding-top: 1rem;
  border-top: 2px solid #FFEB3B;
}

.comic-footer-copyright {
  color: #f8fafc;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  letter-spacing: 1px;
}

.comic-footer-badges {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.comic-footer-badge {
  background: linear-gradient(135deg, #FF1744, #FFEB3B);
  color: #000000;
  padding: 0.4rem 0.8rem;
  border: 2px solid #000000;
  border-radius: 20px;
  font-family: var(--font-comic-bold);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
}
```

---

### 7. Timeline.jsx, TimelineCard.jsx, TimelineCardMobile.jsx

**Files:** `src/components/Timeline.jsx`, `TimelineCard.jsx`, `TimelineCardMobile.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Timeline container
<div className="comic-timeline-container">
  <div className="comic-timeline-header">
    <h2 className="comic-timeline-title">EVENT TIMELINE</h2>
  </div>
  
  <div className="comic-timeline">
    {events.map((event, index) => (
      <div key={index} className="comic-timeline-item">
        <div className="comic-timeline-card">
          {/* Card content */}
        </div>
      </div>
    ))}
  </div>
</div>

// 2. UPDATE: Individual timeline cards
<div className="comic-card comic-panel">
  <div className="comic-card-date">{date}</div>
  <h3 className="comic-card-title">{title}</h3>
  <p className="comic-card-description">{description}</p>
</div>
```

**CSS:**

```css
.comic-timeline-container {
  padding: 3rem 2rem;
}

.comic-timeline-header {
  text-align: center;
  margin-bottom: 3rem;
}

.comic-timeline-title {
  font-family: var(--font-comic-bold);
  font-size: 2.5rem;
  color: #FF1744;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
}

.comic-timeline {
  position: relative;
  padding: 2rem 0;
}

.comic-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #FF1744, #00B0FF);
  top: 0;
}

.comic-timeline-item {
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
}

.comic-timeline-item:nth-child(odd) {
  flex-direction: row-reverse;
}

.comic-timeline-item:nth-child(odd) .comic-timeline-card {
  margin-right: 2rem;
}

.comic-timeline-item:nth-child(even) .comic-timeline-card {
  margin-left: 2rem;
}

.comic-timeline-card {
  width: calc(50% - 2rem);
  background: white;
  border: 5px solid #000000;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.comic-timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 9px 9px 0px rgba(0, 0, 0, 0.4);
}

.comic-card-date {
  font-family: var(--font-comic-bold);
  font-size: 0.9rem;
  color: #FF1744;
  text-transform: uppercase;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.comic-card-title {
  font-family: var(--font-comic-bold);
  font-size: 1.3rem;
  color: #000000;
  margin: 0.5rem 0;
  text-transform: uppercase;
}

.comic-card-description {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .comic-timeline::before {
    left: 30px;
  }

  .comic-timeline-item,
  .comic-timeline-item:nth-child(odd) {
    flex-direction: column-reverse;
    align-items: flex-start;
    margin-left: 80px;
  }

  .comic-timeline-card {
    width: 100%;
    margin: 0 !important;
  }
}
```

---

### 8. Pronites.jsx

**File:** `src/components/Pronites.jsx`

**Detailed Changes:**

```jsx
// UPDATE: Pronite event cards
<div className="comic-pronites-container">
  <h2 className="comic-pronites-title">PRONITE NIGHTS</h2>
  
  <div className="comic-pronites-grid">
    {pronites.map(pronite => (
      <div key={pronite.id} className="comic-pronite-card">
        <div className="comic-pronite-badge">{pronite.date}</div>
        <h3 className="comic-pronite-artist">{pronite.artist}</h3>
        <p className="comic-pronite-description">{pronite.description}</p>
        <button className="comic-button comic-button-pronite">
          GET TICKETS!
        </button>
      </div>
    ))}
  </div>
</div>
```

**CSS:**

```css
.comic-pronites-container {
  padding: 3rem 2rem;
  background: linear-gradient(to bottom, #f8fafc, #FFEB3B);
}

.comic-pronites-title {
  font-family: var(--font-comic-bold);
  font-size: 2.5rem;
  color: #000000;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 2rem;
  letter-spacing: 3px;
  text-shadow: 3px 3px 0px rgba(255, 235, 59, 0.5);
}

.comic-pronites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.comic-pronite-card {
  background: white;
  border: 5px solid #000000;
  border-radius: 10px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.comic-pronite-card::before {
  content: '♪';
  position: absolute;
  top: -20px;
  right: 20px;
  font-size: 2rem;
  animation: floatNote 2s ease-in-out infinite;
}

.comic-pronite-badge {
  position: absolute;
  top: -12px;
  left: 20px;
  background: #FF1744;
  color: white;
  padding: 0.4rem 0.8rem;
  border: 2px solid #000000;
  border-radius: 20px;
  font-family: var(--font-comic-bold);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

.comic-pronite-artist {
  font-family: var(--font-comic-bold);
  font-size: 1.5rem;
  color: #000000;
  margin: 1.5rem 0 0.5rem;
  text-transform: uppercase;
}

.comic-pronite-description {
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.comic-button-pronite {
  background: #00B0FF;
  color: white;
  width: 100%;
}

.comic-pronite-card:hover {
  transform: translateY(-8px) rotate(-2deg);
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.5);
}

@keyframes floatNote {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}
```

---

## PAGES

### 1. Events Page - `src/pages/Events/index.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Page header
<div className="comic-page-header">
  <h1 className="comic-page-title">ALL EVENTS</h1>
  <div className="comic-sound-effect comic-page-effect">BOOM!</div>
</div>

// 2. UPDATE: Filter controls
<div className="comic-filter-bar">
  <div className="comic-filter-group">
    <label className="comic-filter-label">FILTER BY CATEGORY:</label>
    <div className="comic-filter-buttons">
      {categories.map(cat => (
        <button 
          key={cat.id}
          className={`comic-filter-btn ${
            selectedCategory === cat.id ? 'active' : ''
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  </div>
</div>

// 3. UPDATE: Events display grid with comic cards
<div className="comic-events-grid">
  {events.map(event => (
    <EventCard key={event.id} event={event} />
  ))}
</div>
```

**CSS for styles.css:**

```css
.comic-page-header {
  background: linear-gradient(135deg, #FF1744 0%, #00B0FF 100%);
  border-bottom: 6px solid #000000;
  padding: 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.comic-page-title {
  font-family: var(--font-comic-bold);
  font-size: 3rem;
  color: white;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
}

.comic-page-effect {
  position: absolute;
  top: -15px;
  right: 30px;
  font-size: 1.5rem;
  color: #FFEB3B;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.comic-filter-bar {
  background: #f8fafc;
  border-bottom: 3px solid #000000;
  padding: 1.5rem;
  margin: 1rem;
  border-radius: 8px;
  border: 3px solid #000000;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
}

.comic-filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.comic-filter-label {
  font-family: var(--font-comic-bold);
  font-size: 0.95rem;
  color: #000000;
  text-transform: uppercase;
  font-weight: 900;
  white-space: nowrap;
}

.comic-filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.comic-filter-btn {
  padding: 0.6rem 1rem;
  border: 2px solid #000000;
  background: white;
  color: #000000;
  font-family: var(--font-comic-bold);
  font-size: 0.85rem;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 700;
}

.comic-filter-btn.active {
  background: #FF1744;
  color: white;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
}

.comic-filter-btn:hover {
  transform: translateY(-2px);
}

.comic-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.comic-event-card {
  background: white;
  border: 5px solid #000000;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.comic-event-card:hover {
  transform: translateY(-10px) rotate(2deg);
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.4);
}

.comic-event-card-header {
  background: linear-gradient(135deg, #00B0FF, #9C27B0);
  padding: 1rem;
  border-bottom: 4px solid #000000;
}

.comic-event-card-title {
  font-family: var(--font-comic-bold);
  color: white;
  margin: 0;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);
}

.comic-event-card-body {
  padding: 1rem;
}

.comic-event-card-category {
  display: inline-block;
  background: var(--color-yellow);
  color: #000000;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  border: 1px solid #000000;
}

.comic-event-card-description {
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0.5rem 0;
}
```

---

### 2. Admin Dashboard - `src/pages/AdminDashboard/index.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Dashboard header
<div className="comic-admin-header">
  <div className="comic-admin-title-block">
    <h1 className="comic-admin-title">ADMIN CONTROL CENTER</h1>
    <div className="comic-admin-subtitle">EVENT MANAGEMENT HQ</div>
  </div>
  <button onClick={handleLogout} className="comic-logout-btn">
    EXIT
  </button>
</div>

// 2. UPDATE: Stats dashboard with comic cards
<div className="comic-stats-grid">
  <div className="comic-stat-card">
    <div className="comic-stat-icon">📊</div>
    <div className="comic-stat-value">{totalEvents}</div>
    <div className="comic-stat-label">TOTAL EVENTS</div>
  </div>
  
  <div className="comic-stat-card">
    <div className="comic-stat-icon">👥</div>
    <div className="comic-stat-value">{totalUsers}</div>
    <div className="comic-stat-label">REGISTRATIONS</div>
  </div>
  
  {/* More stats */}
</div>

// 3. UPDATE: Event management table with comic styling
<div className="comic-table-container">
  <h2 className="comic-section-title">MANAGE EVENTS</h2>
  <table className="comic-table">
    {/* Table content */}
  </table>
</div>
```

**CSS for styles.css:**

```css
.comic-admin-header {
  background: linear-gradient(90deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  border-bottom: 6px solid #FF1744;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.3);
}

.comic-admin-title-block {
  flex: 1;
}

.comic-admin-title {
  font-family: var(--font-comic-bold);
  font-size: 2.5rem;
  color: #FF1744;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
  letter-spacing: 3px;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.8);
}

.comic-admin-subtitle {
  font-family: var(--font-comic-bold);
  font-size: 0.95rem;
  color: #FFEB3B;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.comic-logout-btn {
  background: #FF1744;
  color: white;
  border: 3px solid #000000;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-family: var(--font-comic-bold);
  font-size: 0.95rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.comic-logout-btn:hover {
  transform: translateY(-3px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
}

.comic-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.comic-stat-card {
  background: white;
  border: 4px solid #000000;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.comic-stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.4);
}

.comic-stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.comic-stat-value {
  font-family: var(--font-comic-impact);
  font-size: 2.5rem;
  color: #FF1744;
  margin: 0.5rem 0;
  font-weight: 900;
}

.comic-stat-label {
  font-family: var(--font-comic-bold);
  font-size: 0.9rem;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.comic-section-title {
  font-family: var(--font-comic-bold);
  font-size: 1.8rem;
  color: #000000;
  text-transform: uppercase;
  margin: 2rem 0 1rem 0;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0px rgba(255, 235, 59, 0.5);
}

.comic-table-container {
  padding: 2rem;
}

.comic-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 3px solid #000000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
}

.comic-table thead {
  background: linear-gradient(135deg, #FF1744, #00B0FF);
  border-bottom: 4px solid #000000;
}

.comic-table th {
  padding: 1rem;
  color: white;
  font-family: var(--font-comic-bold);
  font-size: 0.9rem;
  text-transform: uppercase;
  text-align: left;
  font-weight: 900;
  letter-spacing: 1px;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.4);
}

.comic-table td {
  padding: 1rem;
  border-bottom: 2px solid #e0e0e0;
  color: #333;
}

.comic-table tbody tr:hover {
  background: #f8fafc;
}

.comic-table-action-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #000000;
  background: #FFEB3B;
  color: #000000;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.comic-table-action-btn:hover {
  background: #FF1744;
  color: white;
}
```

---

### 3. Profile Page - `src/pages/Profile/index.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: User profile header
<div className="comic-profile-header comic-panel">
  <div className="comic-profile-avatar">
    <img src={userAvatar} alt="User" className="comic-avatar-img" />
    <span className="comic-profile-status">LOGGED IN</span>
  </div>
  
  <div className="comic-profile-info">
    <h1 className="comic-profile-name">{userName}</h1>
    <p className="comic-profile-email">{userEmail}</p>
  </div>
</div>

// 2. UPDATE: Tab navigation with comic styling
<div className="comic-tabs">
  <button 
    className={`comic-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
  >
    MY REGISTRATIONS
  </button>
  <button 
    className={`comic-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
  >
    SETTINGS
  </button>
</div>

// 3. UPDATE: Registrations list with comic cards
<div className="comic-registrations-list">
  {registrations.map(reg => (
    <div key={reg.id} className="comic-registration-card">
      <div className="comic-reg-header">{reg.eventName}</div>
      <div className="comic-reg-details">
        <span>Status: {reg.status}</span>
        <span>Date: {reg.date}</span>
      </div>
    </div>
  ))}
</div>
```

**CSS for styles.css:**

```css
.comic-profile-header {
  background: linear-gradient(135deg, #00B0FF 0%, #00E5FF 100%);
  border: 5px solid #000000;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  margin: 2rem;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.4);
}

.comic-profile-avatar {
  position: relative;
}

.comic-avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #000000;
  background: white;
  object-fit: cover;
}

.comic-profile-status {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #FF1744;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 900;
  border: 2px solid #000000;
}

.comic-profile-info {
  flex: 1;
}

.comic-profile-name {
  font-family: var(--font-comic-bold);
  font-size: 2rem;
  color: #000000;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.6);
}

.comic-profile-email {
  color: #000000;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
}

.comic-tabs {
  display: flex;
  gap: 1rem;
  padding: 0 2rem;
  border-bottom: 3px solid #000000;
  margin: 2rem 2rem 0 2rem;
}

.comic-tab-btn {
  padding: 1rem 1.5rem;
  background: transparent;
  border: 3px solid #000000;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  font-family: var(--font-comic-bold);
  font-size: 0.95rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 900;
  color: #000000;
}

.comic-tab-btn.active {
  background: linear-gradient(135deg, #FF1744, #FFEB3B);
  color: #000000;
  box-shadow: 0 -4px 0px rgba(0, 0, 0, 0.3);
}

.comic-tab-btn:hover {
  background: #f8fafc;
}

.comic-registrations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.comic-registration-card {
  background: white;
  border: 4px solid #000000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.comic-registration-card:hover {
  transform: translateY(-5px);
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.4);
}

.comic-reg-header {
  background: linear-gradient(135deg, #9C27B0, #00B0FF);
  color: white;
  padding: 1rem;
  border-bottom: 3px solid #000000;
  font-family: var(--font-comic-bold);
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: 900;
}

.comic-reg-details {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #333;
}
```

---

### 4. Category Events Page - `src/pages/CategoryEvents/index.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Category header with comic styling
<div className="comic-category-header">
  <h1 className="comic-category-title">{categoryName}</h1>
  <div className="comic-category-banner">
    <img src={categoryImage} alt={categoryName} />
  </div>
</div>

// 2. UPDATE: Events grid
<div className="comic-category-events-grid">
  {events.map(event => (
    <div key={event.id} className="comic-event-tile">
      {/* Event details */}
    </div>
  ))}
</div>
```

**CSS for styles.css:**

```css
.comic-category-header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #000000, #1a1a1a);
  padding: 2rem;
  border-bottom: 6px solid;
}

.comic-category-header.dance { border-color: var(--color-dance); }
.comic-category-header.music { border-color: var(--color-music); }
.comic-category-header.gaming { border-color: var(--color-gaming); }
.comic-category-header.theatre { border-color: var(--color-theatre); }
.comic-category-header.finearts { border-color: var(--color-finearts); }
.comic-category-header.literary { border-color: var(--color-literary); }

.comic-category-title {
  font-family: var(--font-comic-bold);
  font-size: 3.5rem;
  color: #FFEB3B;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 2;
}

.comic-category-banner {
  margin-top: 1.5rem;
  border: 5px solid #FFEB3B;
  border-radius: 10px;
  overflow: hidden;
  max-height: 300px;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.5);
}

.comic-category-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comic-category-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.comic-event-tile {
  background: white;
  border: 5px solid #000000;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.comic-event-tile:hover {
  transform: scale(1.05) rotate(-1deg);
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.4);
}
```

---

### 5. Event Detail Page - `src/pages/EventDetail/index.jsx`

**Detailed Changes:**

```jsx
// 1. UPDATE: Event detail header
<div className="comic-event-detail-header">
  <img src={eventImage} alt={eventName} className="comic-event-hero-image" />
  <div className="comic-event-detail-overlay">
    <h1 className="comic-event-detail-title">{eventName}</h1>
    <p className="comic-event-detail-category">{categoryName}</p>
  </div>
</div>

// 2. UPDATE: Event information panels
<div className="comic-event-info-grid">
  <div className="comic-info-panel comic-panel-blue">
    <div className="comic-info-icon">📅</div>
    <h3 className="comic-info-label">DATE & TIME</h3>
    <p className="comic-info-value">{dateTime}</p>
  </div>
  
  <div className="comic-info-panel comic-panel-purple">
    <div className="comic-info-icon">📍</div>
    <h3 className="comic-info-label">LOCATION</h3>
    <p className="comic-info-value">{location}</p>
  </div>
  
  <div className="comic-info-panel comic-panel-green">
    <div className="comic-info-icon">💰</div>
    <h3 className="comic-info-label">PRICE</h3>
    <p className="comic-info-value">{price}</p>
  </div>
</div>

// 3. ADD: Registration CTA button
<div className="comic-registration-cta">
  <button className="comic-button comic-button-large comic-button-register">
    REGISTER NOW!!
  </button>
</div>
```

**CSS for styles.css:**

```css
.comic-event-detail-header {
  position: relative;
  height: 400px;
  overflow: hidden;
  border-bottom: 6px solid #FF1744;
}

.comic-event-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.comic-event-detail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 2rem;
  color: white;
}

.comic-event-detail-title {
  font-family: var(--font-comic-bold);
  font-size: 3rem;
  margin: 0;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.7);
}

.comic-event-detail-category {
  font-family: var(--font-comic-bold);
  font-size: 1.1rem;
  color: #FFEB3B;
  text-transform: uppercase;
  margin: 0.5rem 0 0 0;
  letter-spacing: 1px;
}

.comic-event-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.comic-info-panel {
  padding: 1.5rem;
  border: 4px solid;
  border-radius: 8px;
  text-align: center;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.comic-info-panel:hover {
  transform: translateY(-5px);
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.4);
}

.comic-info-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.comic-info-label {
  font-family: var(--font-comic-bold);
  font-size: 0.95rem;
  color: #000000;
  text-transform: uppercase;
  margin: 0.5rem 0;
  letter-spacing: 1px;
  font-weight: 900;
}

.comic-info-value {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.comic-registration-cta {
  text-align: center;
  padding: 2rem;
}

.comic-button-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  letter-spacing: 2px;
}

.comic-button-register {
  background: linear-gradient(135deg, #00E676, #00E5FF);
  color: #000000;
  border: 4px solid #000000;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.4);
}

.comic-button-register:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.5);
}
```

---

### 6. Register/Login Pages - `src/pages/RegisterLogin/`

**Files:** `Login.jsx`, `Register.jsx`, `AdminLogin.jsx`, `ForgotPassword.jsx`

**Detailed Changes for all auth pages:**

```jsx
// 1. UPDATE: Auth form containers
<div className="comic-auth-form-container comic-panel">
  <h2 className="comic-auth-title">LOGIN</h2>
  
  <form className="comic-auth-form">
    <div className="comic-form-group">
      <label className="comic-form-label">USERNAME</label>
      <input 
        type="text" 
        className="comic-form-input"
        placeholder="Enter your username"
      />
    </div>
    
    <div className="comic-form-group">
      <label className="comic-form-label">PASSWORD</label>
      <input 
        type="password" 
        className="comic-form-input"
        placeholder="Enter your password"
      />
    </div>
    
    <button type="submit" className="comic-button comic-button-primary">
      LOGIN!
    </button>
  </form>
  
  <div className="comic-auth-footer">
    <a href="#" className="comic-auth-link">Forgot Password?</a>
    <span className="comic-auth-divider">|</span>
    <a href="#" className="comic-auth-link">Sign Up</a>
  </div>
</div>
```

**CSS for auth pages:**

```css
.comic-auth-form-container {
  background: white;
  border: 6px solid #000000;
  border-radius: 12px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  margin: 0 auto;
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.4);
}

.comic-auth-title {
  font-family: var(--font-comic-bold);
  font-size: 2rem;
  color: #000000;
  text-align: center;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 1.5rem;
  letter-spacing: 3px;
  text-shadow: 2px 2px 0px rgba(255, 235, 59, 0.5);
}

.comic-auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comic-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comic-auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e0e0;
}

.comic-auth-link {
  color: #FF1744;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
}

.comic-auth-link:hover {
  color: #00B0FF;
  text-decoration: underline;
}

.comic-auth-divider {
  margin: 0 0.5rem;
  color: #999;
}
```

---

## CSS UTILITIES & MIXINS

### Create: `src/theme/comicTheme.css`

```css
/* POP COMICS THEME - Complete utilities and mixins */

/* ========== TEXT UTILITIES ========== */

.text-comic-title {
  font-family: var(--font-comic-bold);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.text-comic-bold {
  font-family: var(--font-comic-bold);
  font-weight: 900;
}

.text-comic-impact {
  font-family: var(--font-comic-impact);
  font-weight: 900;
}

.text-shadow-comic {
  text-shadow: var(--text-shadow-comic);
}

.text-shadow-white {
  text-shadow: var(--text-shadow-white);
}

/* ========== BORDER UTILITIES ========== */

.border-comic-thin {
  border: var(--border-comic-thin) #000000;
}

.border-comic-medium {
  border: var(--border-comic-medium) #000000;
}

.border-comic-thick {
  border: var(--border-comic-thick) #000000;
}

.rounded-comic {
  border-radius: 8px;
}

/* ========== SHADOW UTILITIES ========== */

.shadow-comic-small {
  box-shadow: var(--shadow-comic-small);
}

.shadow-comic-medium {
  box-shadow: var(--shadow-comic-medium);
}

.shadow-comic-large {
  box-shadow: var(--shadow-comic-large);
}

/* ========== GLOW UTILITIES ========== */

.glow-red {
  box-shadow: var(--glow-red);
}

.glow-blue {
  box-shadow: var(--glow-blue);
}

.glow-yellow {
  box-shadow: var(--glow-yellow);
}

.glow-purple {
  box-shadow: var(--glow-purple);
}

.glow-green {
  box-shadow: var(--glow-green);
}

/* ========== ANIMATION UTILITIES ========== */

.animate-pulse-comic {
  animation: pulseComic 1.5s ease-in-out infinite;
}

.animate-bounce-comic {
  animation: bounceComic 2s ease-in-out infinite;
}

.animate-pop-comic {
  animation: popComicPunch 0.5s ease-out;
}

/* ========== BACKGROUND PATTERNS ========== */

.bg-halftone {
  background-image: 
    repeating-radial-gradient(circle at 20% 80%, rgba(255,23,68,0.2) 2px, transparent 2px),
    repeating-radial-gradient(circle at 60% 20%, rgba(0,176,255,0.2) 2px, transparent 2px);
  background-size: 50px 50px, 80px 80px;
  background-position: 0 0, 25px 25px;
}

.bg-comic-dots {
  background-image: radial-gradient(circle, #000000 1px, transparent 1px);
  background-size: 8px 8px;
  background-position: 0 0;
  opacity: 0.05;
}

/* ========== HELPER UTILITIES ========== */

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }

.p-1 { padding: 0.5rem; }
.p-2 { padding: 1rem; }
.p-3 { padding: 1.5rem; }

/* ========== RESPONSIVE UTILITIES ========== */

@media (max-width: 768px) {
  .text-comic-title {
    font-size: 1.5rem;
  }

  .shadow-comic-medium {
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
  }
}
```

---

## FONT REQUIREMENTS

### Add to `index.html` head:

```html
<!-- Comic Pop Art Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Righteous&display=swap" rel="stylesheet">

<!-- Optional: Comic Sans alternative (if needed) -->
<link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet">
```

---

## SUMMARY OF CHANGES BY CATEGORY

### Components to Update (13 files):
- ✅ Banner.jsx - Add comic countdown styling
- ✅ About.jsx - Add thought bubbles and badges
- ✅ Explore.jsx - Comic category cards with effects
- ✅ Navbar.jsx - Comic logo and nav styling
- ✅ EventModal.jsx - Comic modal styling
- ✅ EventForm.jsx - Comic form inputs
- ✅ Footer.jsx - Comic footer design
- ✅ Timeline.jsx - Comic timeline display
- ✅ TimelineCard.jsx - Comic card styling
- ✅ TimelineCardMobile.jsx - Responsive timeline
- ✅ Pronites.jsx - Comic event cards
- ✅ ParticlesComponent.jsx - Keep or enhance
- ✅ Sponsors.jsx - Add comic border/styling

### Pages to Update (6 directories):
- ✅ Events/index.jsx - Comic event grid with filters
- ✅ AdminDashboard/index.jsx - Comic stats and tables
- ✅ Profile/index.jsx - Comic profile card
- ✅ CategoryEvents/index.jsx - Comic category display
- ✅ EventDetail/index.jsx - Comic detail panels
- ✅ RegisterLogin/ - Login, Register, AdminLogin, ForgotPassword

### New Files to Create:
- ✅ `src/theme/comicTheme.css` - Comic utilities and mixins
- ✅ `src/components/ComicBannerEffects.css` - Banner effects

### Global Updates:
- ✅ `src/theme/colors.css` - Add new variables and utilities
- ✅ `src/index.html` - Add Google Fonts imports

---

## IMPLEMENTATION PRIORITY

**Phase 1 (Critical):**
1. Update colors.css with all new variables
2. Create comicTheme.css with utilities
3. Update App.jsx loading screen
4. Update main.jsx imports

**Phase 2 (High):**
1. Banner.jsx - Countdown styling
2. Navbar.jsx - Navigation styling
3. Events page - Event grid and filters

**Phase 3 (Medium):**
1. All component styling
2. Form styling
3. Modal styling

**Phase 4 (Polish):**
1. Animations and transitions
2. Responsiveness fine-tuning
3. Accessibility improvements

---

**Total Files Requiring Changes: 30+**
**Estimated Implementation Time: 8-12 hours**
**Difficulty Level: Medium (mostly CSS, some JSX updates)**
