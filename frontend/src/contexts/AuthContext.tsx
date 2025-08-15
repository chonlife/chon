import React, { createContext, useContext, useMemo, useState } from 'react';

interface AuthUser {
  userId: string;
  username: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (userId: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialUserId = localStorage.getItem('chon_user_id') || '';
  const initialUsername = localStorage.getItem('chon_username') || '';
  const initialUser: AuthUser | null = initialUsername ? { userId: initialUserId, username: initialUsername } : null;

  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: !!user,
    user,
    login: (userId: string, username: string) => {
      localStorage.setItem('chon_user_id', userId);
      localStorage.setItem('chon_username', username);
      setUser({ userId, username });
    },
    logout: () => {
      // Clear all local storage as requested, removing any persisted user/test data
      try {
        localStorage.clear();
      } catch (_) {
        // no-op
      }
      setUser(null);
    }
  }), [user]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


