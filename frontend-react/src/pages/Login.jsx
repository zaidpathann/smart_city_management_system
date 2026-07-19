/**
 * Login page
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { isLoggedIn, isAdmin, saveSession } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate(isAdmin ? '/admin' : '/dashboard');
  }, [isLoggedIn, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      saveSession(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-form-wrap">
      <div className="sc-form-card">
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏙️</div>
          <h2 className="sc-form-title">Welcome back</h2>
          <p className="sc-form-sub">Sign in to your SmartCity account</p>
        </div>

        {error && (
          <div className="sc-alert sc-alert-error">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" required />
          </div>

          <button type="submit" className="btn-sc-primary" disabled={loading}>
            {loading
              ? <span><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></i>Signing in...</span>
              : <span><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</span>}
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--cyan)' }}>Register here</Link>
        </p>

        <div className="sc-alert sc-alert-info mt-3" style={{ fontSize: '0.78rem' }}>
          <i className="bi bi-info-circle"></i>
          <span><strong>Demo:</strong> Create an account to get started. Use role: <code>admin</code> for admin access.</span>
        </div>
      </div>
    </div>
  );
}
