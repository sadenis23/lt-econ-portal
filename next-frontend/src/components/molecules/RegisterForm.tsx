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
    
    // Validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    // Password validation temporarily disabled for testing
    // if (password.length < 12) {
    //   setError('Password must be at least 12 characters long');
    //   return;
    // }
    // 
    // if (!/[A-Z]/.test(password)) {
    //   setError('Password must contain at least one uppercase letter');
    //   return;
    // }
    // 
    // if (!/[a-z]/.test(password)) {
    //   setError('Password must contain at least one lowercase letter');
    //   return;
    // }
    // 
    // if (!/\d/.test(password)) {
    //   setError('Password must contain at least one number');
    //   return;
    // }
    // 
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   setError('Password must contain at least one special character');
    //   return;
    // }
    // 
    // // Check for common patterns
    // const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'user'];
    // const passwordLower = password.toLowerCase();
    // for (const pattern of commonPatterns) {
    //   if (passwordLower.includes(pattern)) {
    //   setError('Password contains common patterns that are not allowed');
    //   return;
    //   }
    // }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const ok = await register(username, email, password);
    if (!ok) setError('Registration failed. Username or email may already be taken.');
    else router.push('/login?registered=1');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 border border-blue-100 shadow-2xl rounded-2xl p-10 w-full max-w-4xl mx-auto mt-16 flex flex-col gap-8 backdrop-blur-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-3">Create Account</h1>
      </div>
      {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Username</span>
        <input
          type="text"
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
          placeholder="Enter your username"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Email</span>
        <input
          type="email"
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="Enter your email"
        />
      </label>
      <label className="flex flex-col gap-2 relative">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
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
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Confirm Password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Confirm your password"
        />
      </label>
      <button
        type="submit"
        className="mt-8 bg-white text-black font-semibold py-4 rounded-xl shadow-lg border-2 border-green-500 hover:bg-green-50 transition-all disabled:opacity-60 flex items-center justify-center text-lg"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? <span className="loader mr-3"></span> : null}
        {loading ? 'Creating Account…' : 'Create Account'}
      </button>
      
      <div className="text-center mt-6">
        <span className="text-gray-600">Already have an account? </span>
        <a href="/login" className="text-primary font-semibold hover:underline transition-colors">Sign in</a>
      </div>
    </form>
  );
} 