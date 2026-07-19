/**
 * Smart Parking — citizen view of parking availability
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { parkingStatusClass } from '../utils/helpers.js';

const fillPercent = (p) => {
  if (!p.totalSlots) return 0;
  return Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100);
};

const barColor = (p) => {
  const pct = fillPercent(p);
  if (pct >= 90) return '#f85149';
  if (pct >= 60) return '#d29922';
  return '#3fb950';
};

export default function Parking() {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getParkings()
      .then((res) => setParkings(res.data.parkings || []))
      .catch(() => setError('Failed to load parking data.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">🅿️ Smart Parking</h1>
          <p className="sc-page-sub">Live parking slot availability across the city</p>
        </div>
        <Link to="/dashboard" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Dashboard</Link>
      </div>

      {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
      {loading && <div className="sc-spinner">Loading parking data...</div>}

      {!loading && parkings.length === 0 && (
        <div className="sc-empty">
          <i className="bi bi-p-square"></i>
          <p>No parking locations added yet. Check back soon.</p>
        </div>
      )}

      {!loading && parkings.length > 0 && (
        <div className="row g-3">
          {parkings.map((p) => (
            <div className="col-md-6 col-lg-4" key={p._id}>
              <div className="parking-card">
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div className="parking-name">{p.name}</div>
                  <span className={'sc-badge ' + parkingStatusClass(p.status)}>{p.status}</span>
                </div>
                <div className="parking-address"><i className="bi bi-geo-alt me-1"></i>{p.address}</div>

                <div className="parking-slots">
                  <span className="available">{p.availableSlots}</span>
                  <span className="total"> / {p.totalSlots} slots free</span>
                </div>

                <div className="parking-bar">
                  <div className="parking-bar-fill"
                    style={{ width: fillPercent(p) + '%', background: barColor(p) }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <span>{fillPercent(p)}% occupied</span>
                  {p.fee && <span>Fee: {p.fee}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      {!loading && parkings.length > 0 && (
        <div className="sc-card mt-4" style={{ maxWidth: 400 }}>
          <div className="sc-card-header"><h3 className="sc-card-title"><i className="bi bi-info-circle" style={{ color: 'var(--cyan)' }}></i> Legend</h3></div>
          <div className="d-flex gap-3 flex-wrap">
            <div><span className="sc-badge badge-available">Available</span> <small style={{ color: 'var(--text-muted)' }}>Slots open</small></div>
            <div><span className="sc-badge badge-full">Full</span> <small style={{ color: 'var(--text-muted)' }}>No space</small></div>
            <div><span className="sc-badge badge-closed">Closed</span> <small style={{ color: 'var(--text-muted)' }}>Not operating</small></div>
          </div>
        </div>
      )}
    </div>
  );
}
