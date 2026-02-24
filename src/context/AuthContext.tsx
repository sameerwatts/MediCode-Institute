'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { IAuthContext, IUser } from '@/types';
import {
  mockLogin,
  mockSignup,
  persistUser,
  clearUser,
  loadUser,
} from '@/services/authService';

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error('AuthProvider not mounted');
  },
  signup: async () => {
    throw new Error('AuthProvider not mounted');
  },
  logout: () => {
    throw new Error('AuthProvider not mounted');
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = loadUser();
    if (stored) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const loggedInUser = await mockLogin(email, password);
      persistUser(loggedInUser);
      setUser(loggedInUser);
    },
    [],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<void> => {
      const newUser = await mockSignup(name, email, password);
      persistUser(newUser);
      setUser(newUser);
    },
    [],
  );

  const logout = useCallback((): void => {
    clearUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
