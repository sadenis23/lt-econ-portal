"use client";
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Note: Admin check should be done server-side in production
  // This is a temporary client-side check for development
  const isAdmin = user && user.username === 'admin';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (!loading && adminOnly && !isAdmin) {
      router.replace('/unauthorized');
    }
  }, [user, loading, adminOnly, isAdmin, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (adminOnly && !isAdmin)) return null;
  return <>{children}</>;
} 