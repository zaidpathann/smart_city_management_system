/**
 * Admin Dashboard — city-wide overview
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { formatDate, statusClass } from '../../utils/helpers.js';

const NAV_CARDS = [
  { to: '/admin/complaints', icon: '📋', title: 'Manage Complaints', desc: 'View, update status, and resolve citizen complaints.' },
  { to: '/admin/announcements', icon: '📢', title: 'Announcements', desc: 'Post city-wide announcements and alerts to citizens.' },
  { to: '/admin/parking', icon: '🅿️', title: 'Parking Management', desc: 'Add and update parking locations and slot availability.' },
  { to: '/admin/feedback', icon: '💬', title: 'Citizen Feedback', desc: 'Read and manage feedback and suggestions from citizens.' },
  { to: '/admin/reports', icon: '🚮', title: 'Cleanliness Reports', desc: 'Track garbage and sanitation reports filed by citizens.' },
  { to: '/admin/services', icon: '🔧', title: 'Service Requests', desc: 'Manage utility service requests — water, electricity, etc.' },
  { to: '/admin/users', icon: '👥', title: 'User Management', desc: 'View all registered citizens and admin accounts.' }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplaintStats().then((res) => setStats(res.data.stats || { total: 0, pending: 0, inProgress: 0, resolved: 0 })).catch(() => {});
    api.getAllComplaints()
      .then((res) => setRecentComplaints((res.data.complaints || []).slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sc-dashboard">

      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">🛡️ Admin Control Panel</h1>
          <p className="sc-page-sub">City-wide overview and management hub</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-cyan"><i className="bi bi-chat-left-text" style={{ color: 'var(--cyan)' }}></i></div>
            <div><div className="stat-val">{stats.total}</div><div className="stat-label">Total Complaints</div></div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-yellow"><i className="bi bi-clock" style={{ color: 'var(--yellow)' }}></i></div>
            <div><div className="stat-val">{stats.pending}</div><div className="stat-label">Pending</div></div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'rgba(163,113,247,0.12)' }}><i className="bi bi-arrow-repeat" style={{ color: 'var(--purple)' }}></i></div>
            <div><div className="stat-val">{stats.inProgress}</div><div className="stat-label">In Progress</div></div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-green"><i className="bi bi-check-circle" style={{ color: 'var(--green)' }}></i></div>
            <div><div className="stat-val">{stats.resolved}</div><div className="stat-label">Resolved</div></div>
          </div>
        </div>
      </div>

      {/* Admin Nav Cards */}
      <div className="row g-3 mb-4">
        {NAV_CARDS.map((card) => (
          <div className="col-md-4 col-sm-6" key={card.to}>
            <Link to={card.to} style={{ textDecoration: 'none' }}>
              <div className="feature-card"><span className="feature-icon">{card.icon}</span><h5>{card.title}</h5><p>{card.desc}</p></div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Complaints Table */}
      <div className="sc-card">
        <div className="sc-card-header">
          <h3 className="sc-card-title"><i className="bi bi-list-ul" style={{ color: 'var(--cyan)' }}></i> Recent Complaints</h3>
          <Link to="/admin/complaints" className="btn-sc-sm btn-sc-info">View All</Link>
        </div>
        {loading && <div className="sc-spinner">Loading...</div>}
        {!loading && (
          <div className="table-responsive">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>Citizen</th><th>Title</th><th>Category</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ color: 'var(--text-dim)', padding: '2rem' }}>No complaints yet</td>
                  </tr>
                )}
                {recentComplaints.map((c) => (
                  <tr key={c._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{c.userName}</td>
                    <td>{c.title.slice(0, 40)}{c.title.length > 40 ? '...' : ''}</td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.category}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>{formatDate(c.createdAt)}</td>
                    <td><span className={'sc-badge ' + statusClass(c.status)}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
