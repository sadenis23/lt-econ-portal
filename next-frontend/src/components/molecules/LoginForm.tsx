"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();

  // Load remembered username from localStorage
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      // Save username to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      const result = await login(username, password, rememberMe);
      
      if (!result.success) {
        setFormError(result.message || 'Login failed. Please try again.');
        return;
      }
      
      // Show success message before redirect
      setSuccessMessage('Login successful! Redirecting...');
      
      // Redirect after a short delay to show success animation
      setTimeout(() => {
        router.push('/');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    loading: { scale: 0.95 }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full opacity-20"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="relative bg-white bg-opacity-95 border border-blue-100 shadow-2xl rounded-3xl p-10 max-w-lg mx-auto backdrop-blur-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success overlay */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="absolute inset-0 bg-green-500 bg-opacity-90 rounded-3xl flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <FaCheck className="w-16 h-16 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Welcome Back!</h3>
                <p className="text-lg opacity-90">{successMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.h1 
            className="text-4xl font-extrabold text-primary mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to your account
          </motion.p>
        </motion.div>
        
        <motion.div className="space-y-6" variants={itemVariants}>
          {/* Username/Email field */}
          <motion.label className="flex flex-col gap-2" variants={itemVariants}>
            <span className="font-semibold text-primary text-sm uppercase tracking-wide flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              Email or Username
            </span>
            <motion.input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
              autoComplete="username"
              placeholder="Enter your email or username"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.label>
          
          {/* Password field */}
          <motion.label className="flex flex-col gap-2 relative" variants={itemVariants}>
            <span className="font-semibold text-primary text-sm uppercase tracking-wide flex items-center gap-2">
              <FaLock className="w-4 h-4" />
              Password
            </span>
            <motion.input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-12"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-blue-400 hover:text-primary transition-colors"
              tabIndex={-1}
              aria-label="Toggle password visibility"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </motion.button>
          </motion.label>
          
          {/* Remember me and Forgot password */}
          <motion.div className="flex justify-between items-center" variants={itemVariants}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a 
              href="#" 
              className="text-blue-500 text-sm hover:underline transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement forgot password
                alert('Forgot password functionality coming soon!');
              }}
            >
              Forgot password?
            </a>
          </motion.div>
        </motion.div>
        
        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={loading || isSubmitting}
          className="mt-8 w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center text-lg relative overflow-hidden"
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          animate={loading || isSubmitting ? "loading" : "idle"}
        >
          {/* Loading overlay */}
          {loading || isSubmitting ? (
            <motion.div
              className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </motion.div>
            </motion.div>
          ) : null}
          
          <span className={loading || isSubmitting ? 'opacity-0' : 'opacity-100'}>
            Sign in
          </span>
        </motion.button>
        
        {/* Error message */}
        <AnimatePresence>
          {formError && (
            <motion.div
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{formError}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Sign up link */}
        <motion.div className="text-center mt-8" variants={itemVariants}>
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <a 
            href="/register" 
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Sign up
          </a>
        </motion.div>
      </motion.form>
    </motion.div>
  );
} 