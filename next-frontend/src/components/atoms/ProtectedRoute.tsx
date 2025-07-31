'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, fallback, adminOnly }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (!loading && user && adminOnly && !user.is_admin) {
      router.push('/unauthorized');
    }
  }, [user, loading, router, adminOnly]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg text-primary font-semibold">Loading...</p>
        </div>
      </motion.div>
    );
  }

  // Show fallback or redirect if not authenticated
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null; // Will redirect in useEffect
  }

  // Check admin access if required
  if (adminOnly && !user.is_admin) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null; // Will redirect in useEffect
  }

  // User is authenticated, show protected content
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
} 