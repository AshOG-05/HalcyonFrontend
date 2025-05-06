/**
 * Utility functions to help with CORS issues
 */

// The original API URL without the CORS proxy
// export const ORIGINAL_API_URL = 'https://halcyonbackend-1.onrender.com/api';
export const ORIGINAL_API_URL = 'http://localhost:4000/api';

/**
 * Custom fetch function that attempts to use different CORS approaches
 * @param {string} endpoint - The API endpoint to fetch (without the base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise} - The fetch promise
 */
export const corsProtectedFetch = async (endpoint, options = {}) => {
  // Try with the default fetch first - WITHOUT credentials
  try {
    console.log(`Attempting to fetch from ${ORIGINAL_API_URL}/${endpoint}`);
    const response = await fetch(`${ORIGINAL_API_URL}/${endpoint}`, {
      ...options,
      // Don't include credentials to avoid CORS issues with wildcard
      credentials: 'omit',
      mode: 'cors',
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      }
    });

    // Even if the response is not ok (e.g., 400, 500), we still want to return it
    // so the caller can handle the error appropriately
    return response;
  } catch (error) {
    console.log('First attempt failed, trying with alternative approach...', error);

    // Try a second approach with no-cors mode
    try {
      // For GET requests, we can try no-cors mode as a last resort
      if (!options.method || options.method === 'GET') {
        console.log('Trying with no-cors mode...');

        // This will return an opaque response that we can't read
        // But we'll handle that in the calling function with mock data
        const response = await fetch(`${ORIGINAL_API_URL}/${endpoint}`, {
          ...options,
          mode: 'no-cors',
          credentials: 'omit',
        });

        // We can't check if it's ok because the response is opaque
        // So we'll just return it and let the caller handle it
        return response;
      }
    } catch (noCorsError) {
      console.error('No-cors approach failed:', noCorsError);
    }

    // If all else fails, throw the original error with more context
    console.error('All fetch attempts failed:', error);
    throw new Error(`Failed to fetch from ${ORIGINAL_API_URL}/${endpoint}: ${error.message}`);
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
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export default {
  corsProtectedFetch,
  noCorsModeFetch,
  ORIGINAL_API_URL
};
