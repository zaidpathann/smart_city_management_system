/**
 * Admin: Announcements — post and manage
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { formatDate, priorityClass } from '../../utils/helpers.js';

const PRIORITIES = ['Low', 'Medium', 'High', 'Emergency'];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [ann, setAnn] = useState({ priority: 'Medium', title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.getAnnouncements().then((res) => setAnnouncements(res.data.announcements || []));
  }, []);

  const set = (field) => (e) => setAnn({ ...ann, [field]: e.target.value });

  const postAnnouncement = async (e) => {
    e.preventDefault();
    setError('');
    if (!ann.title || !ann.content) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.postAnnouncement(ann);
      setAnnouncements((prev) => [res.data.announcement, ...prev]);
      setAnn({ priority: 'Medium', title: '', content: '' });
      setSuccess('Announcement posted!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = (id) => {
    if (!confirm('Delete this announcement?')) return;
    api.deleteAnnouncement(id).then(() => {
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    });
  };

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">📢 Announcements</h1>
          <p className="sc-page-sub">Post city-wide announcements visible to all citizens</p>
        </div>
        <Link to="/admin" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Admin Panel</Link>
      </div>

      <div className="row g-4">
        {/* Post New */}
        <div className="col-lg-5">
          <div className="sc-card h-100">
            <div className="sc-card-header"><h3 className="sc-card-title"><i className="bi bi-plus-circle" style={{ color: 'var(--cyan)' }}></i> New Announcement</h3></div>

            {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
            {success && <div className="sc-alert sc-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

            <form onSubmit={postAnnouncement}>
              <div className="mb-3">
                <label className="form-label">Priority</label>
                <select className="form-select" value={ann.priority} onChange={set('priority')}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Title *</label>
                <input type="text" className="form-control" value={ann.title} onChange={set('title')}
                  placeholder="Announcement headline" required />
              </div>
              <div className="mb-4">
                <label className="form-label">Content *</label>
                <textarea className="form-control" value={ann.content} onChange={set('content')} rows="5"
                  placeholder="Full announcement text..." required></textarea>
              </div>
              <button type="submit" className="btn-sc-primary" disabled={loading}>
                {loading
                  ? <span>Posting...</span>
                  : <span><i className="bi bi-megaphone me-2"></i>Post Announcement</span>}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="col-lg-7">
          <div className="sc-card">
            <div className="sc-card-header"><h3 className="sc-card-title"><i className="bi bi-list-ul" style={{ color: 'var(--yellow)' }}></i> Posted Announcements</h3></div>

            {announcements.length === 0 && (
              <div className="sc-empty">
                <i className="bi bi-megaphone"></i><p>No announcements posted yet.</p>
              </div>
            )}

            {announcements.map((a) => (
              <div key={a._id} className={'ann-card priority-' + a.priority}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className={'sc-badge ' + priorityClass(a.priority)}>{a.priority}</span>
                      <span className="ann-title">{a.title}</span>
                    </div>
                    <div className="ann-content">{a.content}</div>
                    <div className="ann-meta">{formatDate(a.createdAt)}</div>
                  </div>
                  <button className="btn-sc-sm btn-sc-delete flex-shrink-0" onClick={() => deleteAnnouncement(a._id)}>
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
