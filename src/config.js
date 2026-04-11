// Configuration settings for the application

// API URL - ALWAYS pointing to production backend server
// Direct connection to the backend API
// export const API_URL = 'http://localhost:4001/api';
export const API_URL = 'https://halcyonbackend-ra73.onrender.com/api';
// Other configuration settings
export const APP_CONFIG = {
  appName: 'Halcyon 2026',
  tokenName: 'cookie',
  adminTokenName: 'adminCookie',
  teamTokenName: 'teamCookie',
  defaultRedirectPath: '/',
  adminRedirectPath: '/admin/dashboard',
  teamRedirectPath: '/team/dashboard'
};
// Festival days configuration
export const FESTIVAL_DAYS = [
  { id: 1, label: 'Day 1', description: 'Join us for exciting events on day one of Halcyon 2025!' },
  { id: 2, label: 'Day 2', description: 'The fun continues through to the second day with more amazing events!' }
];
// Event categories configuration
export const EVENT_CATEGORIES = [
  { id: 'dance', label: 'Dance', icon: 'fas fa-walking' },
  { id: 'music', label: 'Music', icon: 'fas fa-guitar' },
  { id: 'gaming', label: 'Gaming', icon: 'fas fa-gamepad' },
  { id: 'theatre', label: 'Theatre', icon: 'fas fa-theater-masks' },
  { id: 'finearts', label: 'Fine Arts', icon: 'fas fa-paint-brush' },
  { id: 'literary', label: 'Literary', icon: 'fas fa-book' },
  { id: 'other', label: 'Other', icon: 'fas fa-star' }
];

// Comic Pop Art Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      red: '#D31034',
      blue: '#1089D3',
      yellow: '#B28F10',
      purple: '#802095',
      green: '#10B24C',
      orange: '#D37B10',
      cyan: '#00E5FF'
    },
    categories: {
      dance: {
        hex: '#D31034',
        name: 'red',
        rgb: 'rgb(211, 16, 52)',
        rgbGlow: 'rgba(211, 16, 52, 0.5)',
        cssVariable: '--color-red'
      },
      music: {
        hex: '#1089D3',
        name: 'blue',
        rgb: 'rgb(16, 137, 211)',
        rgbGlow: 'rgba(16, 137, 211, 0.5)',
        cssVariable: '--color-blue'
      },
      gaming: {
        hex: '#802095',
        name: 'purple',
        rgb: 'rgb(128, 32, 149)',
        rgbGlow: 'rgba(128, 32, 149, 0.5)',
        cssVariable: '--color-purple'
      },
      theatre: {
        hex: '#D37B10',
        name: 'orange',
        rgb: 'rgb(211, 123, 16)',
        rgbGlow: 'rgba(211, 123, 16, 0.5)',
        cssVariable: '--color-orange'
      },
      finearts: {
        hex: '#10B24C',
        name: 'green',
        rgb: 'rgb(16, 178, 76)',
        rgbGlow: 'rgba(16, 178, 76, 0.5)',
        cssVariable: '--color-green'
      },
      literary: {
        hex: '#B28F10',
        name: 'yellow',
        rgb: 'rgb(178, 143, 16)',
        rgbGlow: 'rgba(178, 143, 16, 0.5)',
        cssVariable: '--color-yellow'
      },
      other: {
        hex: '#D31034',
        name: 'red',
        rgb: 'rgb(211, 16, 52)',
        rgbGlow: 'rgba(211, 16, 52, 0.5)',
        cssVariable: '--color-red'
      }
    },
    text: {
      primary: '#f8fafc',
      secondary: '#FFFFFF',
      dark: '#000000'
    },
    background: {
      black: '#000000',
      white: '#FFFFFF',
      darkGray: '#1a1a1a',
      lightGray: '#f8fafc'
    }
  },
  borders: {
    thickWidth: '3px',
    color: '#000000',
    radius: '8px'
  },
  fonts: {
    display: "'Fredoka One', 'Arial Black', sans-serif",
    body: "'Poppins', sans-serif"
  }
};

// Helper function to get category color
export const getCategoryColor = (categoryId) => {
  return THEME_CONFIG.colors.categories[categoryId] || THEME_CONFIG.colors.categories.other;
};

// Helper function to get category CSS class for comic panel
export const getCategoryComicPanelClass = (categoryId) => {
  const colorName = getCategoryColor(categoryId).name;
  return `comic-panel-${colorName}`;
};

/**
 * Category card / page accent — matches InteractiveExplore flex-cards (reference palette).
 */
export const INTERACTIVE_CARD_CATEGORY_HEX = {
  dance: '#d31034',
  music: '#1089d3',
  gaming: '#802095',
  theatre: '#d37b10',
  finearts: '#10b24c',
  literary: '#b28f10',
  other: '#d31034'
};

function parseHexToRgb(hex) {
  const h = (hex || '#d31034').replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function mixWithWhite(r, g, b, t) {
  return {
    r: Math.round(r + (255 - r) * t),
    g: Math.round(g + (255 - g) * t),
    b: Math.round(b + (255 - b) * t)
  };
}

function mixTowardBlack(r, g, b, t) {
  return {
    r: Math.round(r * (1 - t)),
    g: Math.round(g * (1 - t)),
    b: Math.round(b * (1 - t))
  };
}

function contrastOnAccent(r, g, b) {
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 168 ? '#0a0a0a' : '#ffffff';
}

/**
 * Full category page theme (matches InteractiveExplore card colors): sun rays, paper tint, accents, buttons.
 */
export const getCategoryPageThemeStyle = (categoryId) => {
  const hex =
    INTERACTIVE_CARD_CATEGORY_HEX[categoryId] ||
    INTERACTIVE_CARD_CATEGORY_HEX.other;
  const { r, g, b } = parseHexToRgb(hex);
  const rD = Math.round(r * 0.42);
  const gD = Math.round(g * 0.42);
  const bD = Math.round(b * 0.42);
  const paper = mixWithWhite(r, g, b, 0.84);
  const paperSoft = mixWithWhite(r, g, b, 0.9);
  const btnIdle = mixWithWhite(r, g, b, 0.72);
  const dayBg = mixWithWhite(r, g, b, 0.5);
  const darkAcc = mixTowardBlack(r, g, b, 0.25);
  const onAccent = contrastOnAccent(r, g, b);

  return {
    '--cat-accent': hex,
    '--cat-accent-rgb': `${r}, ${g}, ${b}`,
    '--cat-accent-dark': `rgb(${darkAcc.r}, ${darkAcc.g}, ${darkAcc.b})`,
    '--cat-paper': `rgb(${paper.r}, ${paper.g}, ${paper.b})`,
    '--cat-paper-soft': `rgb(${paperSoft.r}, ${paperSoft.g}, ${paperSoft.b})`,
    '--cat-btn-idle': `rgb(${btnIdle.r}, ${btnIdle.g}, ${btnIdle.b})`,
    '--cat-day-badge': `rgb(${dayBg.r}, ${dayBg.g}, ${dayBg.b})`,
    '--cat-on-accent': onAccent,
    '--cat-ray-conic-1': `rgba(${r}, ${g}, ${b}, 0.36)`,
    '--cat-ray-conic-2': `rgba(${rD}, ${gD}, ${bD}, 0.15)`,
    '--cat-ray-glow-1': `rgba(${r}, ${g}, ${b}, 0.22)`,
    '--cat-ray-glow-2': `rgba(${r}, ${g}, ${b}, 0.1)`,
    '--cat-ray-glow-end': `rgba(${r}, ${g}, ${b}, 0)`,
    '--cat-ray-vignette': `rgba(${r}, ${g}, ${b}, 0.18)`,
    '--cat-ray-vignette-end': `rgba(${r}, ${g}, ${b}, 0)`
  };
};

/** @deprecated use getCategoryPageThemeStyle */
export const getCategorySunrayStyle = getCategoryPageThemeStyle;

export default {
  API_URL,
  APP_CONFIG,
  FESTIVAL_DAYS,
  EVENT_CATEGORIES,
  THEME_CONFIG,
  getCategoryColor,
  getCategoryComicPanelClass,
  INTERACTIVE_CARD_CATEGORY_HEX,
  getCategoryPageThemeStyle,
  getCategorySunrayStyle
};
