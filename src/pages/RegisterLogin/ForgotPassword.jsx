import { useState } from 'react';
import { requestPasswordReset, verifyOTP, resetPassword } from '../../services/authService';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestPasswordReset(email);
      setSuccess('OTP sent to your email. Please check your inbox.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyOTP(email, otp);
      setSuccess('OTP verified successfully. Please set a new password.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email, otp, newPassword);
      setSuccess('Password reset successful. You can now login with your new password.');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/RegisterLogin';
      }, 3000);
    } catch (err) {
      setError(err.message || 'An error occurred while resetting password');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleRequestOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
              />
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter the OTP sent to your email"
              />
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-form-container">
      <h3>Recover Your Password</h3>
      <p className="auth-subtitle">
        {step === 1 && "Enter your email to receive a one-time password (OTP)"}
        {step === 2 && "Enter the OTP sent to your email"}
        {step === 3 && "Create a new password for your account"}
      </p>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}
      {renderStep()}
      <button
        className="auth-link back-link"
        onClick={() => window.location.href = '/RegisterLogin'}
      >
        Back to Login
      </button>
    </div>
  );
}

export default ForgotPassword;
