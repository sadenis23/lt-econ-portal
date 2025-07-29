"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const ok = await register(username, email, password);
    if (!ok) setError('Registration failed');
    else router.push('/login?registered=1');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 border border-blue-100 shadow-2xl rounded-2xl p-8 max-w-md mx-auto mt-24 flex flex-col gap-6 backdrop-blur-md">
      <h1 className="text-3xl font-extrabold text-primary mb-2 text-center">Register</h1>
      {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary">Username</span>
        <input
          type="text"
          className="px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary">Email</span>
        <input
          type="email"
          className="px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label className="flex flex-col gap-2 relative">
        <span className="font-semibold text-primary">Password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          className="px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-blue-400 hover:text-primary text-sm"
          onClick={() => setShowPassword(v => !v)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary">Confirm Password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          className="px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </label>
      <button
        type="submit"
        className="mt-6 bg-primary text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-success transition disabled:opacity-60 border border-primary"
        disabled={loading}
      >
        {loading ? 'Registering…' : 'Register'}
      </button>
    </form>
  );
} 