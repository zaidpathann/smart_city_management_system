/**
 * Emergency Contacts
 */
import { Link } from 'react-router-dom';

const CONTACTS = [
  { name: 'Police', number: '100', icon: '🚔', cls: 'police', desc: 'Law enforcement emergency' },
  { name: 'Fire Brigade', number: '101', icon: '🚒', cls: 'fire', desc: 'Fire & rescue services' },
  { name: 'Ambulance', number: '102', icon: '🚑', cls: 'ambulance', desc: 'Medical emergency' },
  { name: 'Women Helpline', number: '1091', icon: '🛡️', cls: 'women', desc: 'Women safety & support' },
  { name: 'Disaster Management', number: '108', icon: '⚠️', cls: 'disaster', desc: 'Natural disasters & accidents' },
  { name: 'Child Helpline', number: '1098', icon: '👶', cls: 'ambulance', desc: 'Child welfare services' }
];

export default function Emergency() {
  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">🚨 Emergency Contacts</h1>
          <p className="sc-page-sub">One-tap access to emergency services. Stay safe.</p>
        </div>
        <Link to="/dashboard" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Dashboard</Link>
      </div>

      {/* Emergency Banner */}
      <div className="sc-alert sc-alert-error mb-4" style={{ fontSize: '0.9rem', padding: '1rem' }}>
        <i className="bi bi-exclamation-octagon-fill" style={{ fontSize: '1.2rem' }}></i>
        <strong>In case of immediate danger, call the relevant number below or dial 112 (National Emergency).</strong>
      </div>

      <div className="row g-3">
        {CONTACTS.map((c) => (
          <div className="col-md-6 col-lg-4" key={c.name}>
            <div className="emergency-card">
              <span className="emergency-icon">{c.icon}</span>
              <h5>{c.name}</h5>
              <span className={'emergency-num ' + c.cls}>{c.number}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{c.desc}</div>
              <a href={'tel:' + c.number} className="btn-emergency-call">
                <i className="bi bi-telephone-fill"></i> Call {c.number}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* National Emergency */}
      <div className="sc-card mt-4" style={{ borderColor: 'rgba(248,81,73,0.4)', background: 'rgba(248,81,73,0.05)' }}>
        <div className="text-center py-2">
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>National Emergency Helpline</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 800, color: 'var(--red)', lineHeight: 1 }}>112</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Available 24/7 across India</div>
          <a href="tel:112" className="btn sc-btn-danger mt-3 px-4">
            <i className="bi bi-telephone-fill me-2"></i>Call 112 Now
          </a>
        </div>
      </div>
    </div>
  );
}
