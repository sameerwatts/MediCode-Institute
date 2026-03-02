'use client';

/**
 * AuthContext.tsx — Global authentication state for the entire app.
 *
 * How the cookie flow works here:
 *
 * On app load (useEffect):
 *   We call getMe() — the browser automatically sends the httpOnly cookie.
 *   FastAPI reads it and returns the user, or 401 if not authenticated.
 *   This is how the app "remembers" you are logged in after a page refresh
 *   without ever storing anything in localStorage.
 *
 * After login/signup:
 *   The API call sets the httpOnly cookie in the browser.
 *   We update React state with the returned user object.
 *
 * On logout:
 *   We call the logout API — FastAPI sends back delete_cookie() headers.
 *   The browser discards both tokens. We clear React state.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { IAuthContext, IUser } from '@/types';
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getMe,
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
  logout: async () => {
    throw new Error('AuthProvider not mounted');
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: ask the backend "who am I?" using the stored httpOnly cookie.
  // getMe() returns null (not an error) if there's no valid cookie.
  useEffect(() => {
    getMe().then((fetchedUser) => {
      setUser(fetchedUser);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const loggedInUser = await apiLogin(email, password);
      // FastAPI set the httpOnly cookie during this request.
      // We just store the user data in React state.
      setUser(loggedInUser);
    },
    [],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, inviteToken?: string): Promise<void> => {
      const newUser = await apiSignup(name, email, password, inviteToken);
      setUser(newUser);
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    await apiLogout(); // FastAPI clears the cookies in the response
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
