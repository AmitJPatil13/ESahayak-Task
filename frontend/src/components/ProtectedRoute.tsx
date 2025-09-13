'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && requireAdmin && !user.isAdmin) {
      router.push('/'); // Redirect non-admin users to home
    }
  }, [user, isLoading, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen transition-colors duration-300 flex items-center justify-center" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-primary mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requireAdmin && !user.isAdmin) {
    return (
      <div className="min-h-screen transition-colors duration-300 flex items-center justify-center" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-primary mb-2">Access Denied</h2>
          <p className="text-secondary">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
