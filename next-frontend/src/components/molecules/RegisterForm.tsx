"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Basic validation
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const result = await register(username, email, password);
      if (!result.success) {
        setError(result.message || 'Registration failed. Username or email may already be taken.');
      } else {
        setSuccessMessage('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
                <h3 className="text-2xl font-bold mb-2">Welcome!</h3>
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
            Create Account
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join our community today
          </motion.p>
        </motion.div>

        <motion.div className="space-y-6" variants={itemVariants}>
          {/* Username field */}
          <motion.label className="flex flex-col gap-2" variants={itemVariants}>
            <span className="font-semibold text-primary text-sm uppercase tracking-wide flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              Username
            </span>
            <motion.input
              type="text"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.label>

          {/* Email field */}
          <motion.label className="flex flex-col gap-2" variants={itemVariants}>
            <span className="font-semibold text-primary text-sm uppercase tracking-wide flex items-center gap-2">
              <FaEnvelope className="w-4 h-4" />
              Email
            </span>
            <motion.input
              type="email"
              className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
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
              type={showPassword ? 'text' : 'password'}
              className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Enter your password"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.button
              type="button"
              className="absolute right-3 top-9 text-blue-400 hover:text-primary transition-colors"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </motion.button>
          </motion.label>

          {/* Confirm Password field */}
          <motion.label className="flex flex-col gap-2" variants={itemVariants}>
            <span className="font-semibold text-primary text-sm uppercase tracking-wide flex items-center gap-2">
              <FaLock className="w-4 h-4" />
              Confirm Password
            </span>
            <motion.input
              type={showPassword ? 'text' : 'password'}
              className="px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Confirm your password"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.label>
        </motion.div>

        {/* Submit button */}
        <motion.button
          type="submit"
          className="mt-8 w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center text-lg relative overflow-hidden"
          disabled={loading}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          animate={loading ? "loading" : "idle"}
        >
          {/* Loading overlay */}
          {loading ? (
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
          
          <span className={loading ? 'opacity-0' : 'opacity-100'}>
            Create Account
          </span>
        </motion.button>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign in link */}
        <motion.div className="text-center mt-8" variants={itemVariants}>
          <span className="text-gray-600">Already have an account? </span>
          <a 
            href="/login" 
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Sign in
          </a>
        </motion.div>
      </motion.form>
    </motion.div>
  );
} 