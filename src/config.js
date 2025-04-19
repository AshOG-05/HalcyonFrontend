// Configuration settings for the application

// API URL - pointing to the local backend server
export const API_URL = 'http://localhost:4000/api';

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

export default {
  API_URL,
  APP_CONFIG,
  FESTIVAL_DAYS
};
