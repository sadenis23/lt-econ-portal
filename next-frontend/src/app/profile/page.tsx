"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/atoms/ProtectedRoute';
import { motion } from 'framer-motion';

interface ProfileData {
  id: number;
  user_id: number;
  first_name: string;
  role: string;
  language: "lt" | "en";
  newsletter: boolean;
  digest_frequency: string;
  onboarding_completed: boolean;
  topic_slugs: string[];
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else if (response.status === 404) {
        // Profile doesn't exist yet
        setProfile(null);
      } else {
        setError("Failed to load profile");
      }
    } catch (error) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = () => {
    router.push('/onboarding');
  };

  const handleEditProfile = () => {
    router.push('/onboarding');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><span className="loader"></span></div>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white bg-opacity-80 border border-blue-100 shadow-2xl rounded-2xl p-8 backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-emerald-200 flex items-center justify-center text-4xl font-bold text-emerald-700 mb-4">
                  {profile?.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                </div>
                <h1 className="text-3xl font-extrabold text-primary mb-2 text-center">
                  {profile?.first_name || user.username}
                </h1>
                <p className="text-gray-600 text-center">
                  {profile?.onboarding_completed ? "Profile Complete" : "Profile Incomplete"}
                </p>
              </div>

              {/* Onboarding Status */}
              {!profile?.onboarding_completed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-amber-800">
                        Complete Your Profile
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          To get personalized recommendations and the best experience, 
                          please complete your profile setup.
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleCompleteOnboarding}
                          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Complete Setup
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <p className="text-lg font-semibold text-gray-900">{user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-lg font-semibold text-gray-900">{user.email || 'Not provided'}</p>
                  </div>
                  {profile?.first_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <p className="text-lg font-semibold text-gray-900">{profile.first_name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {profile?.role && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {profile.role.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                  {profile?.language && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.language === 'lt' ? 'Lietuvių' : 'English'}
                      </p>
                    </div>
                  )}
                  {profile?.digest_frequency && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Frequency</label>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {profile.newsletter ? profile.digest_frequency : 'Disabled'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Topics of Interest */}
              {profile?.topic_slugs && profile.topic_slugs.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics of Interest</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.topic_slugs.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                      >
                        {topic.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                {profile?.onboarding_completed && (
                  <button
                    onClick={handleEditProfile}
                    className="flex-1 bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex-1 bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sign out
                </button>
                <a
                  href="/"
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Home
                </a>
              </div>
            </motion.div>

            {/* Confirmation Modal */}
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md mx-4">
                  <p className="mb-4 text-lg text-center">Are you sure you want to sign out?</p>
                  <div className="flex gap-4">
                    <button
                      className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                      onClick={logout}
                    >
                      Yes, sign out
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 