/**
 * Utility functions to help with CORS issues
 */

// The original API URL without the CORS proxy
export const ORIGINAL_API_URL = 'https://halcyonbackend-1.onrender.com/api';
// export const ORIGINAL_API_URL = 'http://localhost:4000/api';

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
    const response = await fetch(fullUrl, {
      ...options,
      // Don't include credentials to avoid CORS issues with wildcard
      credentials: 'omit',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });

    console.log(`✅ Response received - Status: ${response.status} (${response.statusText})`);
    console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));

    // Even if the response is not ok (e.g., 400, 500), we still want to return it
    // so the caller can handle the error appropriately
    return response;
  } catch (error) {
    console.error(`❌ Network error for ${fullUrl}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // For GET requests, we can try no-cors mode as a last resort
    if (!options.method || options.method === 'GET') {
      console.log('🔄 Trying with no-cors mode as fallback...');

      try {
        // This will return an opaque response that we can't read
        // But we'll handle that in the calling function with mock data
        const response = await fetch(fullUrl, {
          ...options,
          mode: 'no-cors',
          credentials: 'omit',
        });

        console.log('⚠️ No-cors response received (opaque)');
        // We can't check if it's ok because the response is opaque
        // So we'll just return it and let the caller handle it
        return response;
      } catch (noCorsError) {
        console.error('❌ No-cors approach also failed:', noCorsError);
      }
    }

    // If all else fails, throw the original error with more context
    console.error('💥 All fetch attempts failed for:', fullUrl);
    throw new Error(`Network request failed: ${error.message}. Please check your internet connection and try again.`);
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
