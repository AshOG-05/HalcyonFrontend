import React, { useState, useEffect } from 'react';

function TestAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('TestAdminDashboard mounted');
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setDebugInfo({
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        localStorage: {
          adminCookie: localStorage.getItem('adminCookie'),
          userData: localStorage.getItem('userData')
        }
      });
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <h2>Loading Test Admin Dashboard...</h2>
        <div style={{ marginTop: '1rem' }}>Please wait...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#f8fafc',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#38bdf8', marginBottom: '2rem' }}>Test Admin Dashboard</h1>
      
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>✅ Dashboard Loaded Successfully!</h3>
        <p>This test page confirms that React components can render properly.</p>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>Debug Information</h3>
        <pre style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          overflow: 'auto'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '1.5rem',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>Next Steps</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>If you can see this page, React routing is working</li>
          <li>The white screen issue is likely in the main AdminDashboard component</li>
          <li>Check browser console for JavaScript errors</li>
          <li>Verify backend API connectivity</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => window.location.href = '/admin/dashboard?debug=true'}
          style={{
            background: '#38bdf8',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Try Real Dashboard (Debug Mode)
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'transparent',
            color: '#38bdf8',
            border: '1px solid #38bdf8',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default TestAdminDashboard;
