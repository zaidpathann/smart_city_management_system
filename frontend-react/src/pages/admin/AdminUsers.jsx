/**
 * Admin: User Management
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllUsers()
      .then((res) => setUsers(res.data.users || []))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = (id) => {
    if (!confirm('Delete this user?')) return;
    api.deleteUser(id).then(() => {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    });
  };

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">👥 User Management</h1>
          <p className="sc-page-sub">All registered citizens and administrators</p>
        </div>
        <Link to="/admin" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Admin Panel</Link>
      </div>

      {loading && <div className="sc-spinner">Loading users...</div>}

      {!loading && users.length === 0 && (
        <div className="sc-empty">
          <i className="bi bi-people"></i><p>No users registered yet.</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="sc-card">
          <div className="table-responsive">
            <table className="sc-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u._id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '0.75rem' }}>{index + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>{u.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{u.phone || '—'}</td>
                    <td>
                      <span className={'sc-badge ' + (u.role === 'admin' ? 'badge-high' : 'badge-available')}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      {u.role !== 'admin'
                        ? <button className="btn-sc-sm btn-sc-delete" onClick={() => deleteUser(u._id)}>
                            <i className="bi bi-trash3"></i> Delete
                          </button>
                        : <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Protected</span>}
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
