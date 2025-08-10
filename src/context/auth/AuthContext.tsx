'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/lib/auth';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  setUser: (user: UserSession | null) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserSession | null;
}) {
  const [user, setUser] = useState<UserSession | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const refreshSession = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/session', {
        credentials: 'include',
      });

      if (response.ok) {
        const sessionData = await response.json();
        setUser(sessionData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check for session updates on page focus (useful after redirects)
  useEffect(() => {
    const handleFocus = () => {
      if (!user) {
        refreshSession();
      }
    };

    window.addEventListener('focus', handleFocus);

    // Also check immediately if no initial user but we might have a session cookie
    if (!initialUser) {
      refreshSession();
    }

    return () => window.removeEventListener('focus', handleFocus);
  }, [initialUser, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
