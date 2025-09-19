'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(data.isAuthenticated);
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  const login = async (password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // BYPASS_FEATURE: Temporary bypass for demo purposes
  // This function can be easily removed to restore normal login flow
  const bypassLogin = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bypass: true })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      bypassLogin // BYPASS_FEATURE: Remove this line to disable bypass
    }}>
      {children}
    </AuthContext.Provider>
  );
} 