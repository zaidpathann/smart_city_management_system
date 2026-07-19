/**
 * Navbar — dynamic navigation bar
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user ? user.name : '';
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sc-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand sc-brand" to="/">
          <span className="brand-icon">🏙️</span>
          <span className="brand-text">SmartCity</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">

            {/* Not logged in */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/"><i className="bi bi-house me-1"></i>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn sc-btn-outline ms-2" to="/login"><i className="bi bi-box-arrow-in-right me-1"></i>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn sc-btn-primary ms-2" to="/register"><i className="bi bi-person-plus me-1"></i>Register</Link>
                </li>
              </>
            )}

            {/* Citizen logged in */}
            {isLoggedIn && !isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/dashboard"><i className="bi bi-speedometer2 me-1"></i>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/add-complaint"><i className="bi bi-chat-left-text me-1"></i>Complaint</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/add-report"><i className="bi bi-trash3 me-1"></i>Report</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/parking"><i className="bi bi-p-square me-1"></i>Parking</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/emergency"><i className="bi bi-telephone-fill me-1"></i>Emergency</Link>
                </li>
              </>
            )}

            {/* Admin logged in */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/admin"><i className="bi bi-shield-check me-1"></i>Admin Panel</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/admin/announcements"><i className="bi bi-megaphone me-1"></i>Announcements</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link sc-navlink" to="/admin/parking"><i className="bi bi-p-square me-1"></i>Parking</Link>
                </li>
              </>
            )}

            {/* User pill */}
            {isLoggedIn && (
              <>
                <li className="nav-item ms-2">
                  <div className="sc-user-pill">
                    <span className="pill-avatar">{initial}</span>
                    <span className="pill-name">{userName}</span>
                  </div>
                </li>
                <li className="nav-item">
                  <button className="btn sc-btn-danger ms-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
