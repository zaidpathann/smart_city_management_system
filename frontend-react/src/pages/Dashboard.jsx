/**
 * Citizen Dashboard — complaints, announcements, AQI, quick actions
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, statusClass, priorityClass } from '../utils/helpers.js';

// Dummy AQI data
const AQI = { value: 87, category: 'Moderate', color: 'aqi-moderate' };
const AQI_PERCENT = Math.min((AQI.value / 300) * 100, 100);

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user ? user.name : 'Citizen';

  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [services, setServices] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyComplaints().then((res) => setComplaints(res.data.complaints || [])).catch(() => {});
    api.getAnnouncements().then((res) => setAnnouncements((res.data.announcements || []).slice(0, 5))).catch(() => {});
    api.getMyServices().then((res) => setServices(res.data.requests || [])).catch(() => {});
    api.getMyReports()
      .then((res) => setReports(res.data.reports || []))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  const complaintPriority = (status) =>
    status === 'Pending' ? 'priority-High' : status === 'Resolved' ? 'priority-Low' : 'priority-Medium';

  return (
    <div className="sc-dashboard">

      {/* Header */}
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">Good day, {userName} 👋</h1>
          <p className="sc-page-sub">Here's a summary of your civic activities</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/add-complaint" className="btn sc-btn-primary"><i className="bi bi-plus-circle me-1"></i>New Complaint</Link>
          <Link to="/add-report" className="btn sc-btn-outline"><i className="bi bi-trash3 me-1"></i>Report Issue</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-cyan"><i className="bi bi-chat-left-text" style={{ color: 'var(--cyan)' }}></i></div>
            <div>
              <div className="stat-val">{complaints.length}</div>
              <div className="stat-label">Total Complaints</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-yellow"><i className="bi bi-clock" style={{ color: 'var(--yellow)' }}></i></div>
            <div>
              <div className="stat-val">{pendingCount}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-green"><i className="bi bi-check-circle" style={{ color: 'var(--green)' }}></i></div>
            <div>
              <div className="stat-val">{resolvedCount}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-red"><i className="bi bi-trash3" style={{ color: 'var(--red)' }}></i></div>
            <div>
              <div className="stat-val">{reports.length}</div>
              <div className="stat-label">Reports Filed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">

        {/* Left Column */}
        <div className="col-lg-8">

          {/* My Complaints */}
          <div className="sc-card mb-4">
            <div className="sc-card-header">
              <h3 className="sc-card-title"><i className="bi bi-chat-left-text" style={{ color: 'var(--cyan)' }}></i> My Complaints</h3>
              <Link to="/add-complaint" className="btn-sc-sm btn-sc-info">+ New</Link>
            </div>

            {loading && <div className="sc-spinner">Loading complaints...</div>}

            {!loading && complaints.length === 0 && (
              <div className="sc-empty">
                <i className="bi bi-inbox"></i>
                <p>No complaints yet. <Link to="/add-complaint">File your first complaint →</Link></p>
              </div>
            )}

            {!loading && complaints.slice(0, 5).map((c) => (
              <div key={c._id} className={'ann-card mb-2 ' + complaintPriority(c.status)}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ann-title">{c.title}</div>
                    <div className="ann-content">{c.description.slice(0, 100)}{c.description.length > 100 ? '...' : ''}</div>
                    <div className="ann-meta">{c.category} · {formatDate(c.createdAt)}</div>
                    {c.adminNote && (
                      <div className="ann-meta mt-1" style={{ color: 'var(--green)' }}>
                        <i className="bi bi-chat-dots-fill"></i> Admin: {c.adminNote}
                      </div>
                    )}
                  </div>
                  <span className={'sc-badge ' + statusClass(c.status)}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Announcements */}
          <div className="sc-card">
            <div className="sc-card-header">
              <h3 className="sc-card-title"><i className="bi bi-megaphone" style={{ color: 'var(--yellow)' }}></i> City Announcements</h3>
            </div>

            {announcements.length === 0 && (
              <div className="sc-empty">
                <i className="bi bi-megaphone"></i><p>No announcements at this time.</p>
              </div>
            )}

            {announcements.map((a) => (
              <div key={a._id} className={'ann-card priority-' + a.priority}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ann-title">{a.title}</div>
                    <div className="ann-content">{a.content}</div>
                    <div className="ann-meta">{formatDate(a.createdAt)}</div>
                  </div>
                  <span className={'sc-badge ' + priorityClass(a.priority)}>{a.priority}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column */}
        <div className="col-lg-4">

          {/* AQI */}
          <div className="aqi-widget mb-4">
            <div className="sc-section-title">Air Quality Index</div>
            <div className={'aqi-number ' + AQI.color}>{AQI.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{AQI.category}</div>
            <div className="aqi-meter">
              <div className="aqi-needle" style={{ left: AQI_PERCENT + '%' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
              <span>Good</span><span>Moderate</span><span>Poor</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sc-card mb-4">
            <div className="sc-card-header"><h3 className="sc-card-title"><i className="bi bi-grid" style={{ color: 'var(--cyan)' }}></i> Quick Actions</h3></div>
            <div className="d-grid gap-2">
              <Link to="/add-complaint" className="btn sc-btn-outline text-start" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-chat-left-text me-2"></i>File a Complaint
              </Link>
              <Link to="/add-report" className="btn sc-btn-outline text-start" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-trash3 me-2"></i>Report Cleanliness Issue
              </Link>
              <Link to="/add-service" className="btn sc-btn-outline text-start" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-tools me-2"></i>Request Utility Service
              </Link>
              <Link to="/add-feedback" className="btn sc-btn-outline text-start" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-star me-2"></i>Submit Feedback
              </Link>
              <Link to="/parking" className="btn sc-btn-outline text-start" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-p-square me-2"></i>Check Parking
              </Link>
              <Link to="/emergency" className="btn sc-btn-outline text-start" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-telephone-fill me-2"></i>Emergency Contacts
              </Link>
            </div>
          </div>

          {/* Recent Service Requests */}
          {services.length > 0 && (
            <div className="sc-card">
              <div className="sc-card-header"><h3 className="sc-card-title"><i className="bi bi-tools" style={{ color: 'var(--purple)' }}></i> Service Requests</h3></div>
              {services.slice(0, 3).map((s) => (
                <div key={s._id}
                  className={'ann-card mb-2 ' + (s.status === 'Pending' ? 'priority-High' : s.status === 'Resolved' ? 'priority-Low' : '')}>
                  <div className="ann-title">{s.serviceType}</div>
                  <div className="ann-content">{s.description.slice(0, 80)}...</div>
                  <span className={'sc-badge ' + statusClass(s.status)}>{s.status}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
