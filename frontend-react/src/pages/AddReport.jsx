/**
 * Report Cleanliness Issue — with photo evidence
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const CATEGORIES = ['Garbage', 'Open Drain', 'Stagnant Water', 'Illegal Dumping', 'Other'];

export default function AddReport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ category: 'Garbage', location: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.category || !form.location || !form.description) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);

    const fd = new FormData();
    fd.append('category', form.category);
    fd.append('location', form.location);
    fd.append('description', form.description);
    if (selectedFile) fd.append('image', selectedFile);

    try {
      await api.submitReport(fd);
      setSuccess('Report submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-form-wrap" style={{ maxWidth: 600 }}>
      <div className="sc-form-card">
        <div className="mb-4">
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}><i className="bi bi-arrow-left me-1"></i>Back</Link>
          <h2 className="sc-form-title mt-2">Report Cleanliness Issue</h2>
          <p className="sc-form-sub">Report garbage, open drains, or sanitation problems in your area.</p>
        </div>

        {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="sc-alert sc-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Issue Category *</label>
            <select className="form-select" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Location / Area *</label>
            <input type="text" className="form-control" value={form.location} onChange={set('location')}
              placeholder="e.g. Near Gandhi Chowk, Ward 5" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea className="form-control" value={form.description} onChange={set('description')} rows="4"
              placeholder="Describe what you observed and the extent of the problem" required></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label">Photo Evidence <small style={{ color: 'var(--text-dim)' }}>(recommended)</small></label>
            <label className="sc-file-label" htmlFor="reportImg">
              <i className="bi bi-camera"></i>
              Upload a photo of the issue
            </label>
            <input type="file" id="reportImg" style={{ display: 'none' }} accept="image/*" onChange={onFileSelect} />
            {imagePreview && <img src={imagePreview} className="img-preview" alt="Preview" />}
          </div>

          <button type="submit" className="btn-sc-primary" disabled={loading}>
            {loading
              ? <span><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></i>Submitting...</span>
              : <span><i className="bi bi-flag me-2"></i>Submit Report</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
