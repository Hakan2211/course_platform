'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserSession } from '@/lib/auth';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  setUser: (user: UserSession | null) => void;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
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
