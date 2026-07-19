/**
 * Admin: Citizen Feedback
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllFeedback()
      .then((res) => setFeedbacks(res.data.feedbacks || []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = (f) => {
    api.markFeedbackRead(f._id).then(() => {
      setFeedbacks((prev) => prev.map((x) => x._id === f._id ? { ...x, isRead: true } : x));
    });
  };

  const deleteFeedback = (id) => {
    if (!confirm('Delete this feedback?')) return;
    api.deleteFeedback(id).then(() => {
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    });
  };

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">💬 Citizen Feedback</h1>
          <p className="sc-page-sub">Suggestions and feedback submitted by citizens</p>
        </div>
        <Link to="/admin" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Admin Panel</Link>
      </div>

      {loading && <div className="sc-spinner">Loading feedback...</div>}

      {!loading && feedbacks.length === 0 && (
        <div className="sc-empty">
          <i className="bi bi-chat-heart"></i><p>No feedback received yet.</p>
        </div>
      )}

      {!loading && feedbacks.length > 0 && (
        <div className="sc-card">
          <div className="table-responsive">
            <table className="sc-table">
              <thead>
                <tr><th>Citizen</th><th>Subject</th><th>Message</th><th>Rating</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f._id} style={{ opacity: f.isRead ? 0.7 : 1 }}>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{f.userName}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.subject}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{f.message.slice(0, 80)}{f.message.length > 80 ? '...' : ''}</td>
                    <td>
                      <span className="star-rating">
                        {Array.from({ length: f.rating }, (_, i) => <span key={i}>★</span>)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}> {f.rating}/5</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{formatDate(f.createdAt)}</td>
                    <td>
                      <span className={'sc-badge ' + (f.isRead ? 'badge-resolved' : 'badge-pending')}>
                        {f.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {!f.isRead && <button className="btn-sc-sm btn-sc-info" onClick={() => markRead(f)}>Mark Read</button>}
                        <button className="btn-sc-sm btn-sc-delete" onClick={() => deleteFeedback(f._id)}><i className="bi bi-trash3"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
