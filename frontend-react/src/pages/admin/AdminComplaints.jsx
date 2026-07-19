/**
 * Admin: Manage All Complaints
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { formatDate, statusClass } from '../../utils/helpers.js';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' }
];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getAllComplaints().then((res) => {
      setComplaints(res.data.complaints || []);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all'
    ? complaints
    : complaints.filter((c) => c.status.toLowerCase().replace(' ', '') === filter);

  const updateStatus = (c, status) => {
    api.updateComplaint(c._id, { status, adminNote: c.adminNote || '' })
      .then((res) => {
        setComplaints((prev) => prev.map((x) => x._id === c._id ? { ...x, status: res.data.complaint.status } : x));
      })
      .catch(() => alert('Update failed'));
  };

  const deleteComplaint = (id) => {
    if (!confirm('Delete this complaint?')) return;
    api.deleteComplaint(id).then(() => {
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    });
  };

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">📋 Manage Complaints</h1>
          <p className="sc-page-sub">Review, update and resolve citizen complaints</p>
        </div>
        <Link to="/admin" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Admin Panel</Link>
      </div>

      {/* Filter tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f.key} className={'btn-sc-sm ' + (filter === f.key ? 'btn-sc-info' : 'btn-sc-resolve')}
            onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {loading && <div className="sc-spinner">Loading complaints...</div>}

      {!loading && filtered.length === 0 && (
        <div className="sc-empty">
          <i className="bi bi-inbox"></i><p>No complaints in this category.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="sc-card">
          <div className="table-responsive">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>Citizen</th><th>Title</th><th>Category</th><th>Image</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id}>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{c.userName}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.description.slice(0, 60)}...</div>
                      {c.adminNote && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--green)', marginTop: 2 }}>
                          <i className="bi bi-chat-dots-fill"></i> {c.adminNote}
                        </div>
                      )}
                    </td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.category}</span></td>
                    <td>
                      {c.imageUrl
                        ? <a href={c.imageUrl} target="_blank" rel="noreferrer">
                            <img src={c.imageUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                          </a>
                        : <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>—</span>}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                    <td><span className={'sc-badge ' + statusClass(c.status)}>{c.status}</span></td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {c.status === 'Pending' && (
                          <button className="btn-sc-sm btn-sc-info" onClick={() => updateStatus(c, 'In Progress')}>In Progress</button>
                        )}
                        {c.status !== 'Resolved' && (
                          <button className="btn-sc-sm btn-sc-resolve" onClick={() => updateStatus(c, 'Resolved')}>Resolve</button>
                        )}
                        <button className="btn-sc-sm btn-sc-delete" onClick={() => deleteComplaint(c._id)}>Delete</button>
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
