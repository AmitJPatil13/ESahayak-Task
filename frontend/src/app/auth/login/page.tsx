'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const { user, token } = await mockApi.demoLogin();
      
      // Store auth data (in real app, use secure storage)
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      showError('Login Failed', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-secondary">Sign in to access ESahayak CRM</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Demo Login
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Demo credentials will be used for testing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
