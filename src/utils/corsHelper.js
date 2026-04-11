/**
 * Utility functions to help with CORS issues
 */

// Automatically detect environment and set API URL
const isProduction = window.location.hostname !== 'localhost' &&
                    window.location.hostname !== '127.0.0.1' &&
                    !window.location.hostname.includes('localhost');

// Static API URL - ALWAYS use production backend
// For localhost development:
export const ORIGINAL_API_URL = 'https://halcyonbackend-ra73.onrender.com/api';
// For production (ACTIVE):
// export const ORIGINAL_API_URL = 'https://halcyonbackend-1.onrender.com/api';

console.log('🔗 CORS Helper - API URL:', ORIGINAL_API_URL);
console.log('🌍 Environment:', isProduction ? 'Production' : 'Development');
console.log('🌐 Current hostname:', window.location.hostname);
console.log('🔗 Current origin:', window.location.origin);

/**
 * Custom fetch function that attempts to use different CORS approaches
 * @param {string} endpoint - The API endpoint to fetch (without the base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise} - The fetch promise
 */
export const corsProtectedFetch = async (endpoint, options = {}) => {
  const fullUrl = `${ORIGINAL_API_URL}/${endpoint}`;

  console.log(`🌐 Making API request to: ${fullUrl}`);
  console.log(`📝 Request method: ${options.method || 'GET'}`);
  console.log(`🔑 Headers:`, options.headers);

  if (options.body) {
    console.log(`📦 Request body:`, options.body);
  }

  try {
    // Create AbortController with 120 second timeout to handle Render free tier cold starts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds

    try {
      const response = await fetch(fullUrl, {
        ...options,
        // Include credentials since backend is configured to accept them
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`✅ Response received - Status: ${response.status} (${response.statusText})`);
      console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    
    console.error(`❌ ${isTimeout ? 'Request timeout' : 'Network error'} for ${fullUrl}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Throw the original error with more context
    console.error('💥 Fetch failed for:', fullUrl);
    console.error('🌍 Current environment:', isProduction ? 'Production' : 'Development');
    console.error('🔗 Backend URL being used:', ORIGINAL_API_URL);
    console.error('🌐 Frontend URL:', window.location.origin);

    // Provide environment-specific error messages
    const timeoutInfo = isTimeout 
      ? 'Request timed out after 120 seconds. This can happen when the backend is starting up on Render free tier.'
      : '';
    
    const environmentInfo = isProduction
      ? 'Production environment - check if backend server is running on Render'
      : 'Development environment - check if backend server is running on localhost:4001';

    throw new Error(`Network request failed: ${error.message}. ${timeoutInfo || environmentInfo}. Please check your internet connection and try again.`);
  }
};

/**
 * Enhanced fetch function with retry mechanism
 * @param {string} endpoint - The API endpoint to fetch (without the base URL)
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise} - The fetch promise
 */
export const fetchWithRetry = async (endpoint, options = {}, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${endpoint}`);
      const response = await corsProtectedFetch(endpoint, options);

      // If we get a response, return it (even if it's an error response)
      if (response) {
        console.log(`✅ Success on attempt ${attempt} for ${endpoint}`);
        return response;
      }
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt} failed for ${endpoint}:`, error.message);

      // If this is the last attempt, don't wait
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const waitTime = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // If all retries failed, throw the last error
  throw lastError;
};

/**
 * Check if the backend is healthy
 * @returns {Promise<boolean>} - True if backend is healthy
 */
export const checkBackendHealth = async () => {
  try {
    // Use the same base URL as ORIGINAL_API_URL but without /api
    const baseUrl = ORIGINAL_API_URL.replace('/api', '');

    console.log('🏥 Checking backend health at:', `${baseUrl}/health`);

    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend health check passed:', data);
      return true;
    } else {
      console.warn('⚠️ Backend health check failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend health check error:', error);
    return false;
  }
};

/**
 * Alternative approach using no-cors mode (for GET requests only)
 * Note: This will return an opaque response that you cannot read
 * @param {string} endpoint - The API endpoint to fetch (without the base URL)
 * @returns {Promise} - The fetch promise
 */
export const noCorsModeFetch = (endpoint) => {
  return fetch(`${ORIGINAL_API_URL}/${endpoint}`, {
    mode: 'no-cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export default {
  corsProtectedFetch,
  fetchWithRetry,
  checkBackendHealth,
  noCorsModeFetch,
  ORIGINAL_API_URL
};
