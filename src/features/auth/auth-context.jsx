import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const LS_KEY = 'epermit_admin_user_v1';

/**
 * Very small auth layer for the prototype.
 * Replace with real OIDC/JWT when the backend is ready.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = async ({ email, password }) => {
    // Demo accounts (mock). In real world: call POST /auth/login
    if (!email || !password) throw new Error('Email and password are required.');

    const demoUser = {
      id: 'u_admin_1',
      name: email.split('@')[0] || 'Admin',
      email,
      role: email.toLowerCase().includes('approver') ? 'Approver' : 'Reviewer',
    };
    setUser(demoUser);
    localStorage.setItem(LS_KEY, JSON.stringify(demoUser));
    return demoUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEY);
  };

  const value = useMemo(() => ({ user, login, logout, isAuthenticated: !!user }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
