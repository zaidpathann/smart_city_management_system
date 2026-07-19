/**
 * Admin: Cleanliness Reports
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { formatDate, statusClass } from '../../utils/helpers.js';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllReports()
      .then((res) => setReports(res.data.reports || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (r, status) => {
    api.updateReport(r._id, { status }).then((res) => {
      setReports((prev) => prev.map((x) => x._id === r._id ? { ...x, status: res.data.report.status } : x));
    });
  };

  const deleteReport = (id) => {
    if (!confirm('Delete this report?')) return;
    api.deleteReport(id).then(() => {
      setReports((prev) => prev.filter((r) => r._id !== id));
    });
  };

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">🚮 Cleanliness Reports</h1>
          <p className="sc-page-sub">Garbage and sanitation issues reported by citizens</p>
        </div>
        <Link to="/admin" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Admin Panel</Link>
      </div>

      {loading && <div className="sc-spinner">Loading reports...</div>}

      {!loading && reports.length === 0 && (
        <div className="sc-empty">
          <i className="bi bi-trash3"></i><p>No reports filed yet.</p>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div className="sc-card">
          <div className="table-responsive">
            <table className="sc-table">
              <thead>
                <tr><th>Citizen</th><th>Category</th><th>Location</th><th>Description</th><th>Image</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.userName}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--cyan)' }}>{r.category}</td>
                    <td style={{ fontSize: '0.82rem' }}>{r.location}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.description.slice(0, 60)}...</td>
                    <td>
                      {r.imageUrl
                        ? <a href={r.imageUrl} target="_blank" rel="noreferrer">
                            <img src={r.imageUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                          </a>
                        : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{formatDate(r.createdAt)}</td>
                    <td><span className={'sc-badge ' + statusClass(r.status)}>{r.status}</span></td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {r.status === 'Pending' && (
                          <button className="btn-sc-sm btn-sc-info" onClick={() => updateStatus(r, 'In Progress')}>Progress</button>
                        )}
                        {r.status !== 'Resolved' && (
                          <button className="btn-sc-sm btn-sc-resolve" onClick={() => updateStatus(r, 'Resolved')}>Resolve</button>
                        )}
                        <button className="btn-sc-sm btn-sc-delete" onClick={() => deleteReport(r._id)}><i className="bi bi-trash3"></i></button>
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
