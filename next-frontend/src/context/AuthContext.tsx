'use client';

import { createContext, useContext, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';

interface AuthContextValue extends ReturnType<typeof useCurrentUser> {
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        // Instead of reloading, manually revalidate the user data
        await currentUser.mutate();
        return { success: true };
      }
      const data = await response.json().catch(() => ({}));
      return { success: false, message: data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Internal error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });
      
      if (response.ok) {
        // After successful registration, revalidate user data
        await currentUser.mutate();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      // Clear the user data from SWR cache
      await currentUser.mutate(undefined, false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextValue = {
    ...currentUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be in <AuthProvider>');
  return ctx;
};

export const useEmail = () => useAuth().user?.email ?? null;
export const useProfileComplete = () => !!useAuth().user?.profile_complete; 