import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import AdminLogin from './AdminLogin';
import ForgotPassword from './ForgotPassword';
import './styles.css';

function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');

  const renderContent = () => {
    switch (activeTab) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'admin':
        return <AdminLogin />;
      case 'forgot':
        return <ForgotPassword />;
      default:
        return <Login />;
    }
  };

  return (
    <div className="auth-container">
      {/* Floating stars */}
      <div className="stars-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome to Halcyon 2025</h2>
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
            <button
              className={`auth-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
          </div>
        </div>
        <div className="auth-content">
          {renderContent()}
        </div>
        {activeTab !== 'forgot' && activeTab !== 'admin' && (
          <div className="auth-footer">
            {activeTab === 'login' && (
              <button
                className="auth-link"
                onClick={() => setActiveTab('forgot')}
              >
                <i className="fas fa-question-circle"></i> Forgot Password?
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
