/**
 * Route guards — protect citizen and admin routes
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function RequireUser({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
