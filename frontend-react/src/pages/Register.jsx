/**
 * Register page
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { isLoggedIn, isAdmin, saveSession } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'user', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate(isAdmin ? '/admin' : '/dashboard');
  }, [isLoggedIn, isAdmin, navigate]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.register(form);
      saveSession(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-form-wrap" style={{ maxWidth: 540 }}>
      <div className="sc-form-card">
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
          <h2 className="sc-form-title">Create Account</h2>
          <p className="sc-form-sub">Join the SmartCity civic platform</p>
        </div>

        {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="sc-alert sc-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-control" value={form.name} onChange={set('name')}
                placeholder="Ravi Kumar" required />
            </div>

            <div className="col-12">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-control" value={form.email} onChange={set('email')}
                placeholder="ravi@example.com" required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" value={form.phone} onChange={set('phone')}
                placeholder="+91 9876543210" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option value="user">Citizen (User)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Password * <small style={{ color: 'var(--text-dim)' }}>(min 6 characters)</small></label>
              <input type="password" className="form-control" value={form.password} onChange={set('password')}
                placeholder="Choose a strong password" required />
            </div>

            <div className="col-12 mt-2">
              <button type="submit" className="btn-sc-primary" disabled={loading}>
                {loading
                  ? <span><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></i>Creating...</span>
                  : <span><i className="bi bi-person-check me-2"></i>Create Account</span>}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--cyan)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
