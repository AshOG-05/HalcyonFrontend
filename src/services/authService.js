// Authentication service for handling API requests
import { APP_CONFIG } from '../config';
import { corsProtectedFetch } from '../utils/corsHelper';

// Helper function for making API requests
const apiRequest = async (url, method, data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    // Use the corsProtectedFetch utility to handle CORS issues
    // Remove the leading slash from the URL if it exists
    const endpoint = url.startsWith('/') ? url.substring(1) : url;
    console.log(`Making API request to ${endpoint} with method ${method}`);
    if (data) {
      console.log('Request data:', data);
    }

    const response = await corsProtectedFetch(endpoint, options);

    // Try to parse the JSON response
    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error(`Failed to parse server response: ${jsonError.message}`);
    }

    // Log the response for debugging
    console.log(`Response status: ${response.status}`, responseData);

    if (!response.ok) {
      const errorMessage = responseData.error || responseData.message || `Server returned ${response.status}`;
      console.error('API error:', errorMessage);
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  return apiRequest('/auth/login', 'POST', { email, password });
};

// Register user
export const register = async (userData) => {
  // Ensure the user is registered as a normal user by explicitly setting the role
  const userDataWithRole = {
    ...userData,
    role: 'user' // Force the role to be 'user'
  };

  return apiRequest('/auth/register', 'POST', userDataWithRole);
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
  window.location.href = APP_CONFIG.defaultRedirectPath;
};

// Logout admin
export const adminLogout = () => {
  localStorage.removeItem(APP_CONFIG.adminTokenName);
  window.location.href = APP_CONFIG.defaultRedirectPath;
};

// Logout team member
export const teamLogout = () => {
  localStorage.removeItem(APP_CONFIG.teamTokenName);
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
