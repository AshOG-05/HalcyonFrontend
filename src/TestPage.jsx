import React from 'react';

function TestPage() {
  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1>Test Page</h1>
      <p>If you can see this, React is working correctly!</p>
    </div>
  );
}

export default TestPage;
