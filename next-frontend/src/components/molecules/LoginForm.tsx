"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === '1';
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(username, password);
    if (!ok) setError('Login failed');
    else router.push('/');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 border border-blue-100 shadow-2xl rounded-3xl p-10 max-w-lg mx-auto mt-16 flex flex-col gap-8 backdrop-blur-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-3">Welcome Back</h1>
        <p className="text-gray-600 text-lg">Sign in to your account</p>
      </div>
      {registered && <div className="text-green-600 text-center font-semibold" aria-live="polite">Registration successful! Please log in.</div>}
      {error && <div className="text-red-600 text-center font-semibold" aria-live="polite">{error}</div>}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Email or Username</span>
        <input
          ref={usernameInputRef}
          type="text"
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          value={username}
          onChange={e => { setUsername(e.target.value); setError(''); }}
          required
          autoComplete="username"
          placeholder="Enter your email or username"
        />
      </label>
      <label className="flex flex-col gap-2 relative">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        <button
          type="button"
          className="absolute right-3 top-9 text-blue-400 hover:text-primary text-sm font-medium"
          onClick={() => setShowPassword(v => !v)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </label>
      <div className="flex justify-end">
        <a href="#" className="text-blue-500 text-sm hover:underline transition-colors">Forgot password?</a>
      </div>
      <button
        type="submit"
        className="mt-6 bg-white text-black font-semibold py-4 rounded-xl shadow border-2 border-green-500 hover:bg-green-50 transition-all disabled:opacity-60 flex items-center justify-center text-lg"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? <span className="loader mr-3"></span> : null}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      
      <div className="text-center mt-6">
        <span className="text-gray-600">Don't have an account? </span>
        <a href="/register" className="text-primary font-semibold hover:underline transition-colors">Sign up</a>
      </div>
    </form>
  );
} 