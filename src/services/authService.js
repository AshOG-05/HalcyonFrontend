// Authentication service for handling API requests
import { APP_CONFIG } from '../config';
import { ORIGINAL_API_URL } from '../utils/corsHelper';

// Helper function for making API requests (simplified for auth)
const apiRequest = async (url, method, data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Include credentials for CORS
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  // Build the full URL - ORIGINAL_API_URL already includes /api
  const endpoint = url.startsWith('/') ? url.substring(1) : url;
  const fullUrl = `${ORIGINAL_API_URL}/${endpoint}`;

  try {
    console.log(`🔐 Making auth API request to ${fullUrl} with method ${method}`);
    if (data) {
      console.log('🔐 Request data:', data);
    }

    const response = await fetch(fullUrl, options);

    // Try to parse the JSON response
    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('❌ Failed to parse JSON response:', jsonError);
      throw new Error(`Failed to parse server response: ${jsonError.message}`);
    }

    // Log the response for debugging
    console.log(`🔐 Response status: ${response.status}`, responseData);

    if (!response.ok) {
      const errorMessage = responseData.error || responseData.message || `Server returned ${response.status}`;
      console.error('❌ API error:', errorMessage);
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('❌ API request failed:', error);

    // If it's a network error, provide a more helpful message
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      const isProduction = !fullUrl.includes('localhost');
      const environmentInfo = isProduction
        ? 'Production backend (Render)'
        : 'Local development backend';

      throw new Error(`Network error: Unable to connect to ${environmentInfo} at ${fullUrl}. Please check if the backend server is running and your internet connection.`);
    }

    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  const data = await apiRequest('/auth/login', 'POST', { email, password });

  // Store user data in localStorage for later use
  if (data && data.user) {
    // Store basic user info
    const userData = {
      id: data.user.id,
      name: data.user.name,
      email: email,  // We know this from the login form
      role: data.user.role,
      // Add any other fields you want to store
    };

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('User data stored in localStorage:', userData);
  }

  return data;
};

// Register user
export const register = async (userData) => {
  // Ensure the user is registered as a normal user by explicitly setting the role
  const userDataWithRole = {
    ...userData,
    role: 'user' // Force the role to be 'user'
  };

  const data = await apiRequest('/auth/register', 'POST', userDataWithRole);

  // Store user data in localStorage for later use
  if (data && data.user) {
    // Store basic user info
    const userInfo = {
      id: data.user.id,
      name: data.user.name,
      email: userData.email,
      mobile: userData.mobile,
      role: data.user.role,
    };

    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userInfo));
    console.log('User data stored in localStorage after registration:', userInfo);
  }

  return data;
};

// Admin login
export const adminLogin = async (email, password) => {
  // Proceed with login
  const data = await apiRequest('/auth/login', 'POST', { email, password });

  // Verify if the user has admin role
  if (data.user && data.user.role !== 'admin') {
    throw new Error('You do not have admin privileges');
  }

  return data;
};

// Team login
export const teamLogin = async (email, password) => {
  // Proceed with login
  const data = await apiRequest('/auth/login', 'POST', { email, password });

  // Verify if the user has team role
  if (data.user && data.user.role !== 'team') {
    throw new Error('You do not have team privileges');
  }

  return data;
};

// Request password reset (send OTP)
export const requestPasswordReset = async (email) => {
  return apiRequest('/forgot-password', 'POST', { email });
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  return apiRequest('/verify-otp', 'POST', { email, otp });
};

// Reset password
export const resetPassword = async (email, otp, newPassword) => {
  return apiRequest('/reset-password', 'POST', { email, otp, newPassword });
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem(APP_CONFIG.tokenName);
};

// Check if admin is logged in
export const isAdminLoggedIn = () => {
  return !!localStorage.getItem(APP_CONFIG.adminTokenName);
};

// Check if team member is logged in
export const isTeamLoggedIn = () => {
  return !!localStorage.getItem(APP_CONFIG.teamTokenName);
};

// Logout user
export const logout = () => {
  localStorage.removeItem(APP_CONFIG.tokenName);
  localStorage.removeItem('userData'); // Also remove the stored user data
  window.location.href = APP_CONFIG.defaultRedirectPath;
};

// Logout admin
export const adminLogout = () => {
  localStorage.removeItem(APP_CONFIG.adminTokenName);
  localStorage.removeItem('userData'); // Also remove the stored user data
  window.location.href = APP_CONFIG.defaultRedirectPath;
};

// Logout team member
export const teamLogout = () => {
  localStorage.removeItem(APP_CONFIG.teamTokenName);
  localStorage.removeItem('userData'); // Also remove the stored user data
  window.location.href = APP_CONFIG.defaultRedirectPath;
};

export default {
  login,
  register,
  adminLogin,
  teamLogin,
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  isLoggedIn,
  isAdminLoggedIn,
  isTeamLoggedIn,
  logout,
  adminLogout,
  teamLogout
};
