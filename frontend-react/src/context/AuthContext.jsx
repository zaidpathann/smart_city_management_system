/**
 * AuthContext
 * Manages JWT storage, user session, login/logout
 */
import { createContext, useContext, useState } from 'react';

const TOKEN_KEY = 'sc_token';
const USER_KEY = 'sc_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  });

  const saveSession = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const isLoggedIn = !!user;
  const isAdmin = !!user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
