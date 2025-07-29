"use client";
import { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
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
  const { user, logout, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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
      {/* Mega-menu (center) */}
      <nav className="flex flex-1 justify-center space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        {menuItems.map(item => (
          <a
            key={item.label}
            href={item.href}
            className="text-base font-semibold text-primary hover:text-success px-3 py-2 rounded transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
          >
            {item.label}
          </a>
        ))}
      </nav>
      {/* Search and Auth (right) */}
      {mounted ? (
        <div className="flex-1 flex justify-end items-center gap-4 relative">
          <form className="relative w-40 md:w-64">
            <input
              type="search"
              placeholder="Search all data..."
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-card text-primary placeholder:text-blue-300 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
              aria-label="Search all data"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
          </form>
          {loading ? (
            <div className="w-24 h-8 flex items-center justify-center"><span className="loader"></span></div>
          ) : !user ? (
            <>
              <Link href="/login" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-success transition">Log in</Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-white text-primary font-semibold border border-primary hover:bg-primary hover:text-white transition">Sign up</Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-400 text-white font-semibold hover:bg-blue-500 transition border-2 border-blue-700 z-50"
                onClick={() => setProfileMenuOpen(v => !v)}
                aria-label="Open account menu"
                type="button"
                style={{ position: 'relative', zIndex: 50 }}
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
                  <hr className="my-1 border-blue-100" />
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Hamburger for mobile */}
          <button
            className="ml-4 md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Open menu"
          >
            <FaBars className="w-6 h-6 text-primary" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex justify-end items-center gap-4 relative" />
      )}
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
          {!user ? (
            <>
              <Link href="/login" className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-success transition w-32 text-center">Log in</Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-white text-primary font-semibold border border-primary hover:bg-primary hover:text-white transition w-32 text-center">Sign up</Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="block px-4 py-2 text-primary hover:bg-blue-50">Profile</Link>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50">Sign out</button>
            </>
          )}
        </nav>
      )}
    </header>
  );
} 