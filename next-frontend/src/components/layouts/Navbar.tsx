'use client';

import { useState, useEffect } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth, useProfileComplete } from '../../context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavDropdown from '../molecules/NavDropdown';
import { NAV_ITEMS, INDICATOR_SUB_ITEMS } from '../../constants/nav';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const profileComplete = useProfileComplete();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  
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

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur border-b border-blue-100 shadow-elev-1 flex items-center px-4 md:px-8">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 mr-6">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary drop-shadow flex items-center gap-2">
          <span>LT Econ Portal</span>
          <span className="inline-block w-7 h-5 align-middle border border-gray-200 rounded-sm overflow-hidden">
            <svg viewBox="0 0 21 15" width="28" height="20" xmlns="http://www.w3.org/2000/svg">
              <rect width="21" height="5" y="0" fill="#FDB913"/>
              <rect width="21" height="5" y="5" fill="#006A44"/>
              <rect width="21" height="5" y="10" fill="#C1272D"/>
            </svg>
          </span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex flex-1 justify-center items-center space-x-8">
        {NAV_ITEMS.map(({ title, href }) =>
          href ? (
            <Link
              key={title}
              href={href}
              className={`text-base font-semibold px-2 py-1 rounded transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActiveLink(href)
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-primary hover:text-emerald-600'
              }`}
            >
              {title}
            </Link>
          ) : (
            <div key={title}>
              <NavDropdown />
            </div>
          )
        )}
      </nav>
      
      {/* Auth */}
      <div className="flex-1 flex justify-end items-center gap-4 relative">
        {renderAuthSection()}
        
        {/* Mobile menu button */}
        <button
          className="ml-4 lg:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMobileMenuOpen(v => !v)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
        >
          <FaBars className="w-6 h-6 text-primary" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white/95 shadow-elev-2 flex flex-col items-center py-4 space-y-2 lg:hidden animate-fade-in">
          {/* Main nav items */}
          {NAV_ITEMS.map(({ title, href }) =>
            href ? (
              <Link
                key={title}
                href={href}
                className={`text-lg font-semibold px-4 py-2 rounded transition-colors duration-150 ${
                  isActiveLink(href)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-primary hover:text-emerald-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {title}
              </Link>
            ) : (
              <div key={title} className="w-full">
                <div className="text-lg font-semibold text-primary px-4 py-2">
                  {title}
                </div>
                {/* Flattened dropdown items for mobile */}
                <div className="pl-4 space-y-1">
                  {INDICATOR_SUB_ITEMS.map(({ title: subTitle, href: subHref }) => (
                    <Link
                      key={subHref}
                      href={subHref}
                      className={`block text-base font-medium px-4 py-2 rounded transition-colors duration-150 ${
                        isActiveLink(subHref)
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-gray-600 hover:text-emerald-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subTitle}
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
          
          {/* Auth section for mobile */}
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
              <button 
                onClick={() => fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() => location.reload())} 
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50"
              >
                Sign out
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
} 