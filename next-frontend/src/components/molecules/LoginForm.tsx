"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    
    try {
      const result = await login(username, password);
      
      if (!result.success) {
        setFormError(result.message || 'Login failed. Please try again.');
        return;
      }
      
      // Login successful, redirect to dashboard
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setFormError('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 border border-blue-100 shadow-2xl rounded-3xl p-10 max-w-lg mx-auto mt-16 flex flex-col gap-8 backdrop-blur-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-3">Welcome Back</h1>
        <p className="text-gray-600 text-lg">Sign in to your account</p>
      </div>
      
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Email or Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          required
          autoComplete="username"
          placeholder="Enter your email or username"
        />
      </label>
      
      <label className="flex flex-col gap-2 relative">
        <span className="font-semibold text-primary text-sm uppercase tracking-wide">Password</span>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-blue-400 hover:text-primary text-sm font-medium"
          tabIndex={-1}
          aria-label="Show password"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </label>
      
      <div className="flex justify-end">
        <a href="#" className="text-blue-500 text-sm hover:underline transition-colors">
          Forgot password?
        </a>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="mt-6 bg-white text-black font-semibold py-4 rounded-xl shadow border-2 border-green-500 hover:bg-green-50 transition-all disabled:opacity-60 flex items-center justify-center text-lg"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
      
      {formError && (
        <p className="mt-2 text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-lg p-3">
          {formError}
        </p>
      )}
      
      <div className="text-center mt-6">
        <span className="text-gray-600">Don&apos;t have an account? </span>
        <a href="/register" className="text-primary font-semibold hover:underline transition-colors">
          Sign up
        </a>
      </div>
    </form>
  );
} 