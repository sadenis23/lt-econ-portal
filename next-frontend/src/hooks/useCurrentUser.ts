'use client';

import useSWR from 'swr';

export interface CurrentUser {
  id: string;
  email: string | null;
  profile_complete: boolean;
}

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then((r) => {
    if (!r.ok) throw new Error('Network error');
    return r.json();
  });

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<CurrentUser>('/api/auth/me', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 1,
    errorRetryInterval: 5000,
    onError: (err) => {
      console.error('useCurrentUser error:', err);
    }
  });
  
  return {
    user: data ?? null,
    loading: isLoading,
    error,
    mutate, // Expose mutate for manual revalidation
  };
} 