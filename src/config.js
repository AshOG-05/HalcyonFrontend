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
      red: '#FF1744',
      blue: '#00B0FF',
      yellow: '#FFEB3B',
      purple: '#9C27B0',
      green: '#00E676',
      cyan: '#00E5FF'
    },
    categories: {
      dance: {
        hex: '#FF1744',
        name: 'red',
        rgb: 'rgb(255, 23, 68)',
        rgbGlow: 'rgba(255, 23, 68, 0.5)',
        cssVariable: '--color-red'
      },
      music: {
        hex: '#00B0FF',
        name: 'blue',
        rgb: 'rgb(0, 176, 255)',
        rgbGlow: 'rgba(0, 176, 255, 0.5)',
        cssVariable: '--color-blue'
      },
      gaming: {
        hex: '#FFEB3B',
        name: 'yellow',
        rgb: 'rgb(255, 235, 59)',
        rgbGlow: 'rgba(255, 235, 59, 0.5)',
        cssVariable: '--color-yellow'
      },
      theatre: {
        hex: '#9C27B0',
        name: 'purple',
        rgb: 'rgb(156, 39, 176)',
        rgbGlow: 'rgba(156, 39, 176, 0.5)',
        cssVariable: '--color-purple'
      },
      finearts: {
        hex: '#00E676',
        name: 'green',
        rgb: 'rgb(0, 230, 118)',
        rgbGlow: 'rgba(0, 230, 118, 0.5)',
        cssVariable: '--color-green'
      },
      literary: {
        hex: '#00E5FF',
        name: 'cyan',
        rgb: 'rgb(0, 229, 255)',
        rgbGlow: 'rgba(0, 229, 255, 0.5)',
        cssVariable: '--color-cyan'
      },
      other: {
        hex: '#FF1744',
        name: 'red',
        rgb: 'rgb(255, 23, 68)',
        rgbGlow: 'rgba(255, 23, 68, 0.5)',
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

export default {
  API_URL,
  APP_CONFIG,
  FESTIVAL_DAYS,
  EVENT_CATEGORIES,
  THEME_CONFIG,
  getCategoryColor,
  getCategoryComicPanelClass
};
