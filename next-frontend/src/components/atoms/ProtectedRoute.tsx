"use client";
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user && user.username === 'admin'; // Mock admin check

  useEffect(() => {
    if (!user) router.replace('/login');
    else if (adminOnly && !isAdmin) router.replace('/unauthorized');
  }, [user, adminOnly, isAdmin, router]);

  if (!user || (adminOnly && !isAdmin)) return null;
  return <>{children}</>;
} 