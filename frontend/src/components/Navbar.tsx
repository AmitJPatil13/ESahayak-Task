'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LogOut, User, Home, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">ESahayak</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-secondary hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <Home className="w-4 h-4" />
              Dashboard
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-medium">{user.name || 'User'}</p>
                <p className="text-secondary text-xs">{user.isAdmin ? 'Admin' : 'Agent'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-secondary hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
