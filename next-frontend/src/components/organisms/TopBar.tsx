"use client";
import { useState, useEffect } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth, useProfileComplete } from '../../context/AuthContext';
import Link from 'next/link';

const menuItems = [
  { label: 'Economy', href: '/dashboard/economy' },
  { label: 'Labor & Income', href: '/dashboard/labor' },
  { label: 'Prices & Trade', href: '/dashboard/prices' },
  { label: 'Public Finance', href: '/dashboard/finance' },
  { label: 'Social Indicators', href: '/dashboard/social' },
  { label: 'Reports', href: '/reports' },
];

export default function TopBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const profileComplete = useProfileComplete();
  const [isClient, setIsClient] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('TopBar - User state:', user);
    console.log('TopBar - Loading state:', loading);
  }, [user, loading]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderAuthSection = () => {
    if (!isClient) {
      return (
        <div className="flex items-center gap-4">
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="w-24 h-8 flex items-center justify-center">
          <span className="loader"></span>
        </div>
      );
    }

    if (!user) {
      return (
        <>
          <Link href="/login" className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-50 transition">
            Sign in
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-white text-black font-semibold border-2 border-green-500 hover:bg-green-50 transition">
            Sign up
          </Link>
        </>
      );
    }

    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          onClick={() => setProfileMenuOpen(v => !v)}
          aria-label="Open account menu"
          type="button"
        >
          <FaUserCircle className="w-6 h-6 text-white" />
          <span className="text-white">Account</span>
        </button>
        {profileMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-blue-100 rounded-lg shadow-lg z-50 py-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-primary hover:bg-blue-50 rounded transition-colors"
            >
              Profile
            </Link>
            {!profileComplete && (
              <Link
                href="/onboarding"
                className="block px-4 py-2 text-primary hover:bg-blue-50 rounded transition-colors"
              >
                Complete Setup
              </Link>
            )}
            <hr className="my-1 border-blue-100" />
            <button
              onClick={() => fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() => location.reload())}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur border-b border-blue-100 shadow-elev-1 flex items-center px-4 md:px-8">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 mr-6">
        <a href="/" className="text-2xl font-extrabold tracking-tight text-primary drop-shadow flex items-center gap-2">
          <span>LT Econ Portal</span>
          <span className="inline-block w-7 h-5 align-middle border border-gray-200 rounded-sm overflow-hidden">
            <svg viewBox="0 0 21 15" width="28" height="20" xmlns="http://www.w3.org/2000/svg">
              <rect width="21" height="5" y="0" fill="#FDB913"/>
              <rect width="21" height="5" y="5" fill="#006A44"/>
              <rect width="21" height="5" y="10" fill="#C1272D"/>
            </svg>
          </span>
        </a>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-1 justify-center flex-wrap space-x-2">
        {menuItems.map(item => (
          <a
            key={item.label}
            href={item.href}
            className="text-base font-semibold text-primary hover:text-success px-2 py-1 rounded transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {item.label}
          </a>
        ))}
      </nav>
      
      {/* Auth */}
      <div className="flex-1 flex justify-end items-center gap-4 relative">
        {renderAuthSection()}
        
        {/* Mobile menu button */}
        <button
          className="ml-4 md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMobileMenuOpen(v => !v)}
          aria-label="Open menu"
        >
          <FaBars className="w-6 h-6 text-primary" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white/95 shadow-elev-2 flex flex-col items-center py-4 space-y-2 md:hidden animate-fade-in">
          {menuItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-lg font-semibold text-primary hover:text-success px-4 py-2 rounded transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {isClient && !user && (
            <>
              <Link href="/login" className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-50 transition w-32 text-center">
                Sign in
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-white text-black font-semibold border-2 border-green-500 hover:bg-green-50 transition w-32 text-center">
                Sign up
              </Link>
            </>
          )}
          {isClient && user && (
            <>
              <Link href="/profile" className="block px-4 py-2 text-primary hover:bg-blue-50">
                Profile
              </Link>
              {!profileComplete && (
                <Link href="/onboarding" className="block px-4 py-2 text-primary hover:bg-blue-50">
                  Complete Setup
                </Link>
              )}
                              <button onClick={() => fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() => location.reload())} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50">
                  Sign out
                </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
} 