'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingButton from '@/components/LoadingButton';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid credentials. Try admin@esahayak.com or agent@esahayak.com with any password (3+ chars)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">ESahayak</h1>
          <p className="text-secondary">Real Estate Lead Management</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 rounded-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-secondary">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-3">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="premium-input w-full pl-12"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="premium-input w-full pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Demo Credentials</h4>
              <div className="space-y-1 text-sm text-blue-300">
                <p><strong>Admin:</strong> admin@esahayak.com</p>
                <p><strong>Agent:</strong> agent@esahayak.com</p>
                <p><strong>Password:</strong> Any password (3+ characters)</p>
              </div>
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </span>
            </LoadingButton>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-secondary text-sm">
              Don't have an account? Contact your administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
