/**
 * Submit Feedback — with star rating
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const STARS = [1, 2, 3, 4, 5];

export default function AddFeedback() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ rating: 4, subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.subject || !form.message) {
      setError('Subject and message are required.');
      return;
    }
    setLoading(true);
    try {
      await api.submitFeedback(form);
      setSuccess('Thank you for your feedback!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-form-wrap" style={{ maxWidth: 600 }}>
      <div className="sc-form-card">
        <div className="mb-4">
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}><i className="bi bi-arrow-left me-1"></i>Back</Link>
          <h2 className="sc-form-title mt-2">Submit Feedback</h2>
          <p className="sc-form-sub">Share your suggestions and experiences with the city administration.</p>
        </div>

        {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="sc-alert sc-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-3">
            <label className="form-label">Overall Rating *</label>
            <div style={{ fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1 }}>
              {STARS.map((s) => (
                <span key={s} onClick={() => setForm({ ...form, rating: s })}
                  style={{ color: form.rating >= s ? '#d29922' : 'var(--border)', transition: 'color 0.15s', marginRight: 4 }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              {form.rating}/5 stars selected
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Subject *</label>
            <input type="text" className="form-control" value={form.subject} onChange={set('subject')}
              placeholder="e.g. Suggestion for road maintenance" required />
          </div>

          <div className="mb-4">
            <label className="form-label">Your Message *</label>
            <textarea className="form-control" value={form.message} onChange={set('message')} rows="5"
              placeholder="Share your thoughts, suggestions or appreciation..." required></textarea>
          </div>

          <button type="submit" className="btn-sc-primary" disabled={loading}>
            {loading
              ? <span><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></i>Sending...</span>
              : <span><i className="bi bi-envelope-check me-2"></i>Submit Feedback</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
