/**
 * Utility Service Request
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const SERVICE_TYPES = ['Water', 'Electricity', 'Gas', 'Internet', 'Sewage', 'Other'];

export default function AddService() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ serviceType: 'Water', address: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.serviceType || !form.description || !form.address) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await api.submitService(form);
      setSuccess('Service request submitted!');
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
          <h2 className="sc-form-title mt-2">Utility Service Request</h2>
          <p className="sc-form-sub">Request repair or maintenance for water, electricity, gas and other utilities.</p>
        </div>

        {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="sc-alert sc-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Service Type *</label>
            <select className="form-select" value={form.serviceType} onChange={set('serviceType')}>
              {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Address / Location *</label>
            <input type="text" className="form-control" value={form.address} onChange={set('address')}
              placeholder="House No., Street, Ward, City" required />
          </div>

          <div className="mb-4">
            <label className="form-label">Problem Description *</label>
            <textarea className="form-control" value={form.description} onChange={set('description')} rows="4"
              placeholder="Describe the issue — e.g. No water supply since 2 days in Block B" required></textarea>
          </div>

          <button type="submit" className="btn-sc-primary" disabled={loading}>
            {loading
              ? <span><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></i>Submitting...</span>
              : <span><i className="bi bi-tools me-2"></i>Submit Request</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
