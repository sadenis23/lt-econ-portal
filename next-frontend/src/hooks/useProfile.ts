import { useState, useEffect, useCallback } from 'react';

interface ProfileData {
  id: number;
  user_id: number;
  username: string;
  email: string;
  role: string;
  language: "lt" | "en";
  newsletter: boolean;
  digest_frequency: string;
  onboarding_completed: boolean;
  topic_slugs: string[];
  topics: string[];
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const fetchProfile = useCallback(async () => {
    try {
      setError("");
      const response = await fetch('/api/profile/me', {
        credentials: 'include',
        cache: 'no-store', // Prevent caching
      });

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setRetryCount(0);
      } else if (response.status === 404) {
        setProfile(null);
        setRetryCount(0);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError("Failed to load profile. Please try again.");
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<ProfileData>) => {
    try {
      setError("");
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // Refetch profile data to get updated state
        await fetchProfile();
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError("Failed to update profile. Please try again.");
      return false;
    }
  }, [fetchProfile]);

  const retry = () => {
    setLoading(true);
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    retryCount,
    retry,
    refetch: fetchProfile,
    updateProfile,
  };
} 