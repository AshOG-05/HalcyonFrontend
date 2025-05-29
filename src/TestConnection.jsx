import React, { useState, useEffect } from 'react';
import { corsProtectedFetch } from './utils/corsHelper';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing...');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      setStatus('Connecting to API...');
      
      // Test the events endpoint
      const response = await corsProtectedFetch('event');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ API connection successful!', data);
      
      setEvents(data);
      setStatus('✅ Connection successful!');
      setError(null);
      
    } catch (err) {
      console.error('❌ API connection failed:', err);
      setStatus('❌ Connection failed');
      setError(err.message);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>🔗 API Connection Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Status:</strong> <span style={{ 
          color: status.includes('✅') ? 'green' : status.includes('❌') ? 'red' : 'orange' 
        }}>{status}</span>
      </div>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Events loaded:</strong> {events.length}
      </div>
      
      {events.length > 0 && (
        <div>
          <h3>📋 Sample Events:</h3>
          <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {events.slice(0, 5).map((event, index) => (
              <li key={event._id || index} style={{ marginBottom: '5px' }}>
                <strong>{event.name}</strong> - {event.description?.substring(0, 100)}...
              </li>
            ))}
          </ul>
          {events.length > 5 && (
            <p><em>... and {events.length - 5} more events</em></p>
          )}
        </div>
      )}
      
      <button 
        onClick={testConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        🔄 Test Again
      </button>
    </div>
  );
};

export default TestConnection;
