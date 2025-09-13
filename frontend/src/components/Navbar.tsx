'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LogOut, User, Home, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="glass-card mx-4 mt-4 mb-6 rounded-2xl sticky top-4 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold gradient-text">ESahayak</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-secondary hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/buyers"
              className="flex items-center gap-2 text-secondary hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <Users className="w-4 h-4" />
              Buyers
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-medium">{user.name || 'User'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-secondary hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
