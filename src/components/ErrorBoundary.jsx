import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #000000, #1a1a2e)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: '"Poppins", sans-serif'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid #ff4444',
            borderRadius: '10px',
            padding: '30px',
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{
              fontSize: '3rem',
              color: '#ff4444',
              marginBottom: '20px'
            }}></i>
            <h2 style={{ color: '#ff4444', margin: '0 0 15px 0' }}>
              Something went wrong
            </h2>
            <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
              The {this.props.componentName || 'page'} encountered an error and couldn't load properly.
            </p>
            <details style={{ 
              marginBottom: '20px', 
              textAlign: 'left',
              background: 'rgba(0,0,0,0.3)',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Error Details (for developers)
              </summary>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
            <div>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginRight: '10px'
                }}
              >
                <i className="fas fa-redo"></i> Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-home"></i> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
