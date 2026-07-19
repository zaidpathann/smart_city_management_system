/**
 * File a Complaint — with image upload
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const CATEGORIES = ['Road', 'Water', 'Electricity', 'Sanitation', 'Noise', 'Other'];

export default function AddComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', description: '', category: 'Other' });
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
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }
    setLoading(true);

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    if (selectedFile) fd.append('image', selectedFile);

    try {
      await api.submitComplaint(fd);
      setSuccess('Complaint submitted successfully!');
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
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}><i className="bi bi-arrow-left me-1"></i>Back to Dashboard</Link>
          <h2 className="sc-form-title mt-2">File a Complaint</h2>
          <p className="sc-form-sub">Report a civic issue to the city administration.</p>
        </div>

        {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="sc-alert sc-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Complaint Title *</label>
            <input type="text" className="form-control" value={form.title} onChange={set('title')}
              placeholder="Brief title of the issue" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea className="form-control" value={form.description} onChange={set('description')} rows="4"
              placeholder="Describe the issue in detail — location, severity, etc." required></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label">Upload Image <small style={{ color: 'var(--text-dim)' }}>(optional)</small></label>
            <label className="sc-file-label" htmlFor="imgInput">
              <i className="bi bi-cloud-upload"></i>
              Click to upload photo (max 5MB · JPG, PNG, WebP)
            </label>
            <input type="file" id="imgInput" style={{ display: 'none' }} accept="image/*" onChange={onFileSelect} />
            {imagePreview && <img src={imagePreview} className="img-preview" alt="Preview" />}
          </div>

          <button type="submit" className="btn-sc-primary" disabled={loading}>
            {loading
              ? <span><i className="bi bi-arrow-repeat me-2" style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></i>Submitting...</span>
              : <span><i className="bi bi-send me-2"></i>Submit Complaint</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
