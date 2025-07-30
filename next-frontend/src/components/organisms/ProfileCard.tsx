'use client';

import { useEmail } from '@/context/AuthContext';

export default function ProfileCard() {
  const email = useEmail();

  return (
    <p className="text-lg font-semibold text-gray-900" aria-label="user-email">
      {email ?? 'Not provided'}
    </p>
  );
} 