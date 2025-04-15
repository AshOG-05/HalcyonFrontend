import { useState } from 'react';
import { adminLogin } from '../../services/authService';
import { APP_CONFIG } from '../../config';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await adminLogin(formData.email, formData.password, formData.adminCode);

      // Store the admin token in localStorage
      localStorage.setItem(APP_CONFIG.adminTokenName, data.token);

      // Redirect to admin dashboard
      window.location.href = APP_CONFIG.adminRedirectPath;
    } catch (err) {
      setError(err.message || 'An error occurred during admin login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h3>Admin Login</h3>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Admin Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter admin email"
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
            placeholder="Enter admin password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="adminCode">Admin Code</label>
          <input
            type="password"
            id="adminCode"
            name="adminCode"
            value={formData.adminCode}
            onChange={handleChange}
            required
            placeholder="Enter admin security code"
          />
        </div>
        <button
          type="submit"
          className="auth-button admin-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Admin Login'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
