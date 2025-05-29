/**
 * Debug helper to identify deployment URLs and test backend connectivity
 */

import { checkBackendHealth, ORIGINAL_API_URL } from './corsHelper';

/**
 * Log current environment information
 */
export const logEnvironmentInfo = () => {
  console.log('🔍 ENVIRONMENT DEBUG INFO:');
  console.log('📍 Current URL:', window.location.href);
  console.log('🌐 Origin:', window.location.origin);
  console.log('🏠 Hostname:', window.location.hostname);
  console.log('🔗 API URL:', ORIGINAL_API_URL);
  console.log('🌍 User Agent:', navigator.userAgent);
  console.log('📱 Is Mobile:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};

/**
 * Test backend connectivity and log results
 */
export const testBackendConnectivity = async () => {
  console.log('🧪 TESTING BACKEND CONNECTIVITY:');
  
  try {
    // Test health endpoint
    console.log('🏥 Testing health endpoint...');
    const isHealthy = await checkBackendHealth();
    console.log(`✅ Health check: ${isHealthy ? 'PASSED' : 'FAILED'}`);
    
    // Test API info endpoint
    console.log('📡 Testing API info endpoint...');
    const response = await fetch(`${ORIGINAL_API_URL.replace('/api', '')}/api`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API info test: PASSED', data);
    } else {
      console.log('❌ API info test: FAILED', response.status, response.statusText);
    }
    
    // Test events endpoint
    console.log('🎪 Testing events endpoint...');
    const eventsResponse = await fetch(`${ORIGINAL_API_URL}/event`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      console.log(`✅ Events test: PASSED (${eventsData.length} events found)`);
    } else {
      console.log('❌ Events test: FAILED', eventsResponse.status, eventsResponse.statusText);
    }
    
  } catch (error) {
    console.error('💥 Backend connectivity test failed:', error);
  }
};

/**
 * Generate deployment report
 */
export const generateDeploymentReport = async () => {
  console.log('📊 GENERATING DEPLOYMENT REPORT:');
  console.log('='.repeat(50));
  
  logEnvironmentInfo();
  console.log('='.repeat(50));
  await testBackendConnectivity();
  console.log('='.repeat(50));
  
  // Generate summary
  const report = {
    timestamp: new Date().toISOString(),
    frontend: {
      url: window.location.origin,
      hostname: window.location.hostname,
      isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    },
    backend: {
      url: ORIGINAL_API_URL,
      baseUrl: ORIGINAL_API_URL.replace('/api', '')
    }
  };
  
  console.log('📋 DEPLOYMENT REPORT:', JSON.stringify(report, null, 2));
  
  // Copy to clipboard if possible
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      console.log('📋 Report copied to clipboard!');
    } catch (err) {
      console.log('📋 Could not copy to clipboard:', err);
    }
  }
  
  return report;
};

/**
 * Auto-run debug on page load in development
 */
if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
  console.log('🔧 Development mode detected - running auto-debug...');
  setTimeout(() => {
    logEnvironmentInfo();
    testBackendConnectivity();
  }, 1000);
}

export default {
  logEnvironmentInfo,
  testBackendConnectivity,
  generateDeploymentReport
};
