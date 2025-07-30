"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/atoms/ProtectedRoute';
import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';
import { useTranslations } from '../../lib/i18n';

interface ProfileData {
  id: number;
  user_id: number;
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
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const { profile, loading, error, retryCount, retry, updateProfile } = useProfile();
  const t = useTranslations('en'); // Default to English, can be made dynamic

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchCsrfToken();
    }
  }, [user]);

  // Debug logging
  useEffect(() => {
    console.log('Profile state:', {
      profile,
      loading,
      error,
      onboardingCompleted: profile?.onboarding_completed,
    });
  }, [profile, loading, error]);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch('/api/csrf', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  const handleCompleteOnboarding = () => {
    router.push('/onboarding');
  };

  const handleEditProfile = () => {
    router.push('/onboarding');
  };

  const handleSecureLogout = async () => {
    try {
      if (!csrfToken) {
        console.error('No CSRF token available');
        return;
      }

      const response = await fetch('/api/auth/secure-logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ csrfToken }),
      });

      if (response.ok) {
        logout();
        setShowConfirm(false);
      } else {
        console.error('Secure logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><span className="loader"></span></div>;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-80 border border-blue-100 shadow-2xl rounded-2xl p-8 backdrop-blur-md">
              {/* Skeleton Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              
              {/* Skeleton Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-1"></div>
                      <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-1"></div>
                      <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skeleton Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
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
              <header className="flex flex-col items-center mb-8">
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-emerald-200 flex items-center justify-center text-2xl md:text-4xl font-bold text-emerald-800 mb-4"
                  role="img"
                  aria-label={`Avatar for ${user.username}`}
                >
                  {user.username?.[0]?.toUpperCase() || '?'}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2 text-center">
                  {user.username}
                </h1>
                <p className="text-gray-600 text-center">
                  {profile?.onboarding_completed ? t.profile.complete : t.profile.incomplete}
                </p>
              </header>

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
                        {t.profile.completeSetup}
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p id="onboarding-description">
                          {t.profile.completeProfileMessage}
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleCompleteOnboarding}
                          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none transition-colors"
                          aria-describedby="onboarding-description"
                        >
                          {t.profile.completeSetup}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile Information */}
              <section className="mb-6 md:mb-8" aria-labelledby="profile-info-heading">
                <h2 id="profile-info-heading" className="sr-only">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.username}</label>
                      <p className="text-lg font-semibold text-gray-900">{user.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.email}</label>
                      <p className="text-lg font-semibold text-gray-900">{user.email || t.profile.notProvided}</p>
                    </div>
                    {profile?.role && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.role}</label>
                        <p className="text-lg font-semibold text-gray-900 capitalize">
                          {profile.role.replace('_', ' ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {profile?.language && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.language}</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {(() => {
                            switch (profile.language) {
                              case 'lt': return 'Lietuvių';
                              case 'en': return 'English';
                              default: return 'English';
                            }
                          })()}
                        </p>
                      </div>
                    )}
                    {profile?.digest_frequency && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.newsletterFrequency}</label>
                        <p className="text-lg font-semibold text-gray-900 capitalize">
                          {profile.newsletter ? profile.digest_frequency : t.profile.disabled}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Topics of Interest */}
              {profile?.topic_slugs && profile.topic_slugs.length > 0 && (
                <section className="mb-8" aria-labelledby="topics-heading">
                  <h3 id="topics-heading" className="text-lg font-semibold text-gray-900 mb-4">{t.profile.topicsOfInterest}</h3>
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
                </section>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-red-600 text-sm">{error}</p>
                      {retryCount < 3 && (
                        <button
                          onClick={retry}
                          className="mt-2 text-sm text-red-600 hover:text-red-500 focus:outline-none focus:underline"
                          aria-label="Retry loading profile"
                        >
                          {t.profile.retry}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
                {profile?.onboarding_completed && (
                  <button
                    onClick={handleEditProfile}
                    className="flex-1 bg-brandMint text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-brandMint-dark focus:ring-2 focus:ring-brandMint focus:ring-offset-2 focus:outline-none transition-colors border border-brandMint-dark/20 shadow-sm"
                    aria-label="Edit your profile information"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex-1 bg-brandRose text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-brandRose-dark focus:ring-2 focus:ring-brandRose focus:ring-offset-2 focus:outline-none transition-colors border border-brandRose-dark/20 shadow-sm"
                  aria-label="Sign out of your account"
                >
                  {t.profile.signOut}
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none transition-colors text-center border border-gray-300 shadow-sm"
                  aria-label="Return to the home page"
                >
                  {t.profile.backToHome}
                </Link>
              </div>
            </motion.div>

            {/* Confirmation Modal */}
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md mx-4">
                  <p className="mb-4 text-lg text-center">{t.profile.confirmLogoutMessage}</p>
                  <div className="flex gap-4">
                    <button
                      className="px-4 py-2 rounded bg-brandRose text-gray-900 font-semibold hover:bg-brandRose-dark focus:ring-2 focus:ring-brandRose focus:ring-offset-2 focus:outline-none transition-colors border border-brandRose-dark/20 shadow-sm"
                      onClick={handleSecureLogout}
                      disabled={!csrfToken}
                    >
                      {t.profile.yesSignOut}
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none transition-colors"
                      onClick={() => setShowConfirm(false)}
                    >
                      {t.profile.cancel}
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