'use client';

import { createContext, useContext, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';

interface AuthContextValue extends ReturnType<typeof useCurrentUser> {
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, password, remember_me: rememberMe }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Revalidate user data after successful login
        await currentUser.mutate();
        return { success: true, message: data.message };
      }
      
      const data = await response.json().catch(() => ({}));
      return { success: false, message: data.detail?.message || data.detail?.error || data.detail || data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, email, password }),
      });
      
      if (response.ok) {
        // After successful registration, revalidate user data
        await currentUser.mutate();
        return { success: true, message: 'Registration successful' };
      }
      
      const data = await response.json().catch(() => ({}));
      console.error('Registration failed:', data);
      return { success: false, message: data.detail || data.error || 'Registration failed' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      
      // Clear the user data from SWR cache
      await currentUser.mutate(undefined, false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      await currentUser.mutate(undefined, false);
      router.push('/login');
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      
      if (response.ok) {
        // Revalidate user data after token refresh
        await currentUser.mutate();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const value: AuthContextValue = {
    ...currentUser,
    login,
    register,
    logout,
    refreshToken,
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