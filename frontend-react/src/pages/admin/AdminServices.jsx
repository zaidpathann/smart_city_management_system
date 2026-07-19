/**
 * Admin: Utility Service Requests
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { formatDate, statusClass } from '../../utils/helpers.js';

export default function AdminServices() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllServices()
      .then((res) => setRequests(res.data.requests || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (r, status) => {
    api.updateService(r._id, { status }).then((res) => {
      setRequests((prev) => prev.map((x) => x._id === r._id ? { ...x, status: res.data.request.status } : x));
    });
  };

  const deleteService = (id) => {
    if (!confirm('Delete this request?')) return;
    api.deleteService(id).then(() => {
      setRequests((prev) => prev.filter((r) => r._id !== id));
    });
  };

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">🔧 Service Requests</h1>
          <p className="sc-page-sub">Utility service requests submitted by citizens</p>
        </div>
        <Link to="/admin" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Admin Panel</Link>
      </div>

      {loading && <div className="sc-spinner">Loading requests...</div>}

      {!loading && requests.length === 0 && (
        <div className="sc-empty">
          <i className="bi bi-tools"></i><p>No service requests yet.</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="sc-card">
          <div className="table-responsive">
            <table className="sc-table">
              <thead>
                <tr><th>Citizen</th><th>Service Type</th><th>Address</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.userName}</td>
                    <td><span style={{ color: 'var(--cyan)', fontWeight: 600, fontSize: '0.85rem' }}>{r.serviceType}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.address}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.description.slice(0, 60)}...</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{formatDate(r.createdAt)}</td>
                    <td><span className={'sc-badge ' + statusClass(r.status)}>{r.status}</span></td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {r.status === 'Pending' && (
                          <button className="btn-sc-sm btn-sc-info" onClick={() => updateStatus(r, 'Assigned')}>Assign</button>
                        )}
                        {r.status !== 'Resolved' && (
                          <button className="btn-sc-sm btn-sc-resolve" onClick={() => updateStatus(r, 'Resolved')}>Resolve</button>
                        )}
                        <button className="btn-sc-sm btn-sc-delete" onClick={() => deleteService(r._id)}><i className="bi bi-trash3"></i></button>
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
