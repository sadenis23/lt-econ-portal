"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === '1';
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    if (!ok) setError('Login failed');
    else window.location.href = '/profile';
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 border border-blue-100 shadow-2xl rounded-2xl p-8 max-w-md mx-auto mt-24 flex flex-col gap-6 backdrop-blur-md">
      <h1 className="text-3xl font-extrabold text-primary mb-2 text-center">Sign in</h1>
      {registered && <div className="text-green-600 text-center font-semibold" aria-live="polite">Registration successful! Please log in.</div>}
      {error && <div className="text-red-600 text-center font-semibold" aria-live="polite">{error}</div>}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary">Email or Username</span>
        <input
          ref={emailInputRef}
          type="text"
          className="px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          required
          autoComplete="username"
        />
      </label>
      <label className="flex flex-col gap-2 relative">
        <span className="font-semibold text-primary">Password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          className="px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          required
          autoComplete="current-password"
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
      <div className="flex justify-end">
        <a href="#" className="text-blue-500 text-sm hover:underline">Forgot password?</a>
      </div>
      <button
        type="submit"
        className="mt-4 bg-primary text-white font-semibold py-3 rounded-lg shadow hover:bg-success transition disabled:opacity-60 flex items-center justify-center"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? <span className="loader mr-2"></span> : null}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
} 