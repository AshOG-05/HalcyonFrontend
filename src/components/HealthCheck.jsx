import React, { useState, useEffect } from 'react';
import { checkBackendHealth, ORIGINAL_API_URL } from '../utils/corsHelper';

const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState({
    isHealthy: null,
    loading: true,
    error: null,
    lastChecked: null
  });

  const checkHealth = async () => {
    setHealthStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const isHealthy = await checkBackendHealth();
      setHealthStatus({
        isHealthy,
        loading: false,
        error: null,
        lastChecked: new Date().toLocaleTimeString()
      });
    } catch (error) {
      setHealthStatus({
        isHealthy: false,
        loading: false,
        error: error.message,
        lastChecked: new Date().toLocaleTimeString()
      });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = () => {
    if (healthStatus.loading) return '#fbbf24'; // yellow
    if (healthStatus.isHealthy) return '#10b981'; // green
    return '#ef4444'; // red
  };

  const getStatusText = () => {
    if (healthStatus.loading) return 'Checking...';
    if (healthStatus.isHealthy) return 'Backend is healthy';
    return 'Backend is not responding';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          marginRight: '8px',
          animation: healthStatus.loading ? 'pulse 1.5s infinite' : 'none'
        }}></div>
        <strong style={{ color: getStatusColor() }}>
          {getStatusText()}
        </strong>
      </div>
      
      <div style={{ fontSize: '12px', color: '#666' }}>
        <div>API: {ORIGINAL_API_URL}</div>
        {healthStatus.lastChecked && (
          <div>Last checked: {healthStatus.lastChecked}</div>
        )}
        {healthStatus.error && (
          <div style={{ color: '#ef4444', marginTop: '4px' }}>
            Error: {healthStatus.error}
          </div>
        )}
      </div>
      
      <button
        onClick={checkHealth}
        disabled={healthStatus.loading}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: getStatusColor(),
          color: 'white',
          cursor: healthStatus.loading ? 'not-allowed' : 'pointer',
          fontSize: '12px'
        }}
      >
        {healthStatus.loading ? 'Checking...' : 'Recheck'}
      </button>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default HealthCheck;
