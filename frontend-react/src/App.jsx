/**
 * SmartCity React Application
 * Main app shell and client-side routing
 */
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { RequireUser, RequireAdmin } from './components/RouteGuards.jsx';

// Public pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Citizen pages
import Dashboard from './pages/Dashboard.jsx';
import AddComplaint from './pages/AddComplaint.jsx';
import AddReport from './pages/AddReport.jsx';
import AddService from './pages/AddService.jsx';
import AddFeedback from './pages/AddFeedback.jsx';
import Parking from './pages/Parking.jsx';
import Emergency from './pages/Emergency.jsx';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminComplaints from './pages/admin/AdminComplaints.jsx';
import AdminAnnouncements from './pages/admin/AdminAnnouncements.jsx';
import AdminParking from './pages/admin/AdminParking.jsx';
import AdminFeedback from './pages/admin/AdminFeedback.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import AdminServices from './pages/admin/AdminServices.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Navbar />

        <main className="sc-main">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Citizen routes */}
            <Route path="/dashboard" element={<RequireUser><Dashboard /></RequireUser>} />
            <Route path="/add-complaint" element={<RequireUser><AddComplaint /></RequireUser>} />
            <Route path="/add-report" element={<RequireUser><AddReport /></RequireUser>} />
            <Route path="/add-service" element={<RequireUser><AddService /></RequireUser>} />
            <Route path="/add-feedback" element={<RequireUser><AddFeedback /></RequireUser>} />
            <Route path="/parking" element={<RequireUser><Parking /></RequireUser>} />
            <Route path="/emergency" element={<RequireUser><Emergency /></RequireUser>} />

            {/* Admin routes */}
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/complaints" element={<RequireAdmin><AdminComplaints /></RequireAdmin>} />
            <Route path="/admin/announcements" element={<RequireAdmin><AdminAnnouncements /></RequireAdmin>} />
            <Route path="/admin/parking" element={<RequireAdmin><AdminParking /></RequireAdmin>} />
            <Route path="/admin/feedback" element={<RequireAdmin><AdminFeedback /></RequireAdmin>} />
            <Route path="/admin/reports" element={<RequireAdmin><AdminReports /></RequireAdmin>} />
            <Route path="/admin/services" element={<RequireAdmin><AdminServices /></RequireAdmin>} />
            <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </HashRouter>
    </AuthProvider>
  );
}
