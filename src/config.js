// Configuration settings for the application

// API URL - ALWAYS pointing to production backend server
// Direct connection to the backend API
// export const API_URL = 'http://localhost:4001/api';
export const API_URL = 'https://halcyonbackend-1.onrender.com/api';
// Other configuration settings
export const APP_CONFIG = {
  appName: 'Halcyon 2025',
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

export default {
  API_URL,
  APP_CONFIG,
  FESTIVAL_DAYS,
  EVENT_CATEGORIES
};
