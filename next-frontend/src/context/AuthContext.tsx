"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session via API
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const res = await fetch('/api/auth/check-session', {
          credentials: 'include',
        });
        
        console.log('Session check response:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Session data:', data);
          setToken(data.access_token);
          setUser(data.user);
        } else {
          console.log('No valid session found');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login for:', username);
      const res = await fetch('http://localhost:8001/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
      });
      
      console.log('Login response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Login failed:', errorData);
        return false;
      }
      
      const data = await res.json();
      console.log('Login successful, setting tokens...');
      
      // Store tokens securely in memory only
      setToken(data.access_token);
      
      // Decode the access token to get user info
      const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
      setUser({ username: tokenPayload.sub, email: '' });
      
      // Store refresh token in httpOnly cookie via API
      console.log('Setting refresh token cookie...');
      const cookieRes = await fetch('/api/auth/set-refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: data.refresh_token }),
      });
      
      console.log('Cookie set response:', cookieRes.status);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:8001/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password_hash: password }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear refresh token via API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 