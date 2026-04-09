import { useState } from 'react';
import { adminLogin, teamLogin } from '../../services/authService';
import { APP_CONFIG } from '../../config';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'team'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;

      if (loginType === 'admin') {
        // For admin login
        data = await adminLogin(formData.email, formData.password);
        // Store the admin token in localStorage
        localStorage.setItem(APP_CONFIG.adminTokenName, data.token);
        // Redirect to admin dashboard
        window.location.href = APP_CONFIG.adminRedirectPath;
      } else {
        // For team login
        data = await teamLogin(formData.email, formData.password);
        // Store the team token in localStorage
        localStorage.setItem(APP_CONFIG.teamTokenName, data.token);
        // Redirect to team dashboard
        window.location.href = APP_CONFIG.teamRedirectPath;
      }
    } catch (err) {
      setError(err.message || `An error occurred during ${loginType} login`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h3>{loginType === 'admin' ? 'Admin Login' : 'Team Login'}</h3>

      <p className="auth-subtitle">
        {loginType === 'admin'
          ? 'Login with your pre-created admin account'
          : 'Login with your pre-created team account'}
      </p>
      <p className="auth-note">
        Note: Admin and team accounts cannot be created through registration.
        Please contact the system administrator if you need access.
      </p>

      <div className="auth-tabs">
        <button
          className={`auth-tab ${loginType === 'admin' ? 'active' : ''}`}
          onClick={() => handleLoginTypeChange('admin')}
          type="button"
        >
          Admin
        </button>
        <button
          className={`auth-tab ${loginType === 'team' ? 'active' : ''}`}
          onClick={() => handleLoginTypeChange('team')}
          type="button"
        >
          Team
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">{loginType === 'admin' ? 'Admin' : 'Team'} Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={`Enter ${loginType} email`}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className={`auth-button ${loginType === 'admin' ? 'admin-button' : 'team-button'}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : `${loginType === 'admin' ? 'Admin' : 'Team'} Login`}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
