/**
 * ApiService
 * Centralised HTTP layer for all backend API calls
 */
import axios from 'axios';

// Base URL comes from Vite env (VITE_API_URL); falls back to the deployed
// backend so a missing env var can never point the app at localhost.
const DEFAULT_API_URL = 'https://smart-city-management-system-twd6.onrender.com/api';

function resolveBaseURL() {
  const raw = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : trimmed + '/api';
}

const http = axios.create({
  baseURL: resolveBaseURL()
});

// Attach JWT to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('sc_token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

const api = {
  /* ── Users ── */
  register: (data) => http.post('/users/register', data),
  login: (data) => http.post('/users/login', data),
  getProfile: () => http.get('/users/profile'),
  getAllUsers: () => http.get('/users/all'),
  deleteUser: (id) => http.delete('/users/' + id),

  /* ── Complaints ── */
  submitComplaint: (fd) => http.post('/complaints', fd),
  getMyComplaints: () => http.get('/complaints/my'),
  getAllComplaints: () => http.get('/complaints'),
  getComplaintStats: () => http.get('/complaints/stats'),
  updateComplaint: (id, data) => http.put('/complaints/' + id, data),
  deleteComplaint: (id) => http.delete('/complaints/' + id),

  /* ── Announcements ── */
  getAnnouncements: () => http.get('/announcements'),
  postAnnouncement: (data) => http.post('/announcements', data),
  deleteAnnouncement: (id) => http.delete('/announcements/' + id),

  /* ── Feedback ── */
  submitFeedback: (data) => http.post('/feedback', data),
  getMyFeedback: () => http.get('/feedback/my'),
  getAllFeedback: () => http.get('/feedback'),
  markFeedbackRead: (id) => http.put('/feedback/' + id + '/read', {}),
  deleteFeedback: (id) => http.delete('/feedback/' + id),

  /* ── Parking ── */
  getParkings: () => http.get('/parking'),
  addParking: (data) => http.post('/parking', data),
  updateParking: (id, data) => http.put('/parking/' + id, data),
  deleteParking: (id) => http.delete('/parking/' + id),

  /* ── Service Requests ── */
  submitService: (data) => http.post('/services', data),
  getMyServices: () => http.get('/services/my'),
  getAllServices: () => http.get('/services'),
  updateService: (id, data) => http.put('/services/' + id, data),
  deleteService: (id) => http.delete('/services/' + id),

  /* ── Cleanliness Reports ── */
  submitReport: (fd) => http.post('/reports', fd),
  getMyReports: () => http.get('/reports/my'),
  getAllReports: () => http.get('/reports'),
  updateReport: (id, data) => http.put('/reports/' + id, data),
  deleteReport: (id) => http.delete('/reports/' + id)
};

export default api;
