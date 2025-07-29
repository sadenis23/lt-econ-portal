"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/atoms/ProtectedRoute';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><span className="loader"></span></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <section className="bg-white bg-opacity-80 border border-blue-100 shadow-2xl rounded-2xl p-8 max-w-md mx-auto flex flex-col gap-6 backdrop-blur-md">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700 mb-2">
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <h1 className="text-3xl font-extrabold text-primary mb-2 text-center">Profile</h1>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-primary">Username:</span>
            <span className="text-lg">{user.username}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-primary">Email:</span>
            <span className="text-lg">{user.email || 'user@email.com'}</span>
          </div>
          <button className="mt-4 bg-primary text-white font-semibold py-3 rounded-lg shadow hover:bg-red-600 transition" onClick={() => setShowConfirm(true)}>Sign out</button>
          <a href="/" className="text-blue-500 text-center mt-2 hover:underline">Back to Home</a>
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                <p className="mb-4 text-lg">Are you sure you want to sign out?</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600" onClick={logout}>Yes, sign out</button>
                  <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300" onClick={() => setShowConfirm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
} 