/**
 * Admin: Parking Management
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { parkingStatusClass } from '../../utils/helpers.js';

const STATUSES = ['Available', 'Full', 'Closed'];
const EMPTY_FORM = { name: '', address: '', totalSlots: '', availableSlots: '', fee: 'Free', status: 'Available' };

export default function AdminParking() {
  const [parkings, setParkings] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.getParkings().then((res) => setParkings(res.data.parkings || []));
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const addParking = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.address || !form.totalSlots) {
      setError('Name, address and total slots are required.');
      return;
    }
    const payload = {
      ...form,
      totalSlots: Number(form.totalSlots),
      availableSlots: form.availableSlots !== '' ? Number(form.availableSlots) : Number(form.totalSlots)
    };
    setLoading(true);
    try {
      const res = await api.addParking(payload);
      setParkings((prev) => [...prev, res.data.parking]);
      setForm(EMPTY_FORM);
      setSuccess('Parking location added!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (p) => {
    const next = p.status === 'Available' ? 'Full' : 'Available';
    api.updateParking(p._id, { status: next, availableSlots: next === 'Full' ? 0 : p.totalSlots })
      .then((res) => {
        setParkings((prev) => prev.map((x) =>
          x._id === p._id ? { ...x, status: res.data.parking.status, availableSlots: res.data.parking.availableSlots } : x));
      });
  };

  const deleteParking = (id) => {
    if (!confirm('Delete this parking location?')) return;
    api.deleteParking(id).then(() => {
      setParkings((prev) => prev.filter((p) => p._id !== id));
    });
  };

  return (
    <div className="sc-dashboard">
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="sc-page-title">🅿️ Parking Management</h1>
          <p className="sc-page-sub">Add and manage parking locations visible to citizens</p>
        </div>
        <Link to="/admin" className="btn sc-btn-outline"><i className="bi bi-arrow-left me-1"></i>Admin Panel</Link>
      </div>

      <div className="row g-4">
        {/* Add Form */}
        <div className="col-lg-4">
          <div className="sc-card">
            <div className="sc-card-header"><h3 className="sc-card-title"><i className="bi bi-plus-circle" style={{ color: 'var(--cyan)' }}></i> Add Location</h3></div>

            {error && <div className="sc-alert sc-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
            {success && <div className="sc-alert sc-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

            <form onSubmit={addParking}>
              <div className="mb-3">
                <label className="form-label">Location Name *</label>
                <input type="text" className="form-control" value={form.name} onChange={set('name')} placeholder="e.g. Central Mall Parking" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Address *</label>
                <input type="text" className="form-control" value={form.address} onChange={set('address')} placeholder="Full address" required />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label">Total Slots *</label>
                  <input type="number" className="form-control" value={form.totalSlots} onChange={set('totalSlots')} min="1" required />
                </div>
                <div className="col-6">
                  <label className="form-label">Available</label>
                  <input type="number" className="form-control" value={form.availableSlots} onChange={set('availableSlots')} min="0" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Fee</label>
                <input type="text" className="form-control" value={form.fee} onChange={set('fee')} placeholder="e.g. ₹20/hr or Free" />
              </div>
              <div className="mb-4">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={set('status')}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-sc-primary" disabled={loading}>
                {loading
                  ? <span>Adding...</span>
                  : <span><i className="bi bi-plus-circle me-2"></i>Add Parking</span>}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="col-lg-8">
          <div className="sc-card">
            <div className="sc-card-header"><h3 className="sc-card-title"><i className="bi bi-list-ul" style={{ color: 'var(--cyan)' }}></i> All Locations</h3></div>

            {parkings.length === 0 && (
              <div className="sc-empty">
                <i className="bi bi-p-square"></i><p>No parking locations added yet.</p>
              </div>
            )}

            {parkings.length > 0 && (
              <div className="table-responsive">
                <table className="sc-table">
                  <thead>
                    <tr><th>Name</th><th>Address</th><th>Slots</th><th>Fee</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {parkings.map((p) => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.address}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--green)' }}>{p.availableSlots}</span><span style={{ color: 'var(--text-dim)' }}>/{p.totalSlots}</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.fee}</td>
                        <td><span className={'sc-badge ' + parkingStatusClass(p.status)}>{p.status}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn-sc-sm btn-sc-info" onClick={() => toggleStatus(p)}>Toggle</button>
                            <button className="btn-sc-sm btn-sc-delete" onClick={() => deleteParking(p._id)}><i className="bi bi-trash3"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
