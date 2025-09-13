import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
}: LoadingButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-accent text-primary hover:from-primary/90 hover:to-accent/90 focus:ring-primary shadow-lg shadow-primary/25',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 hover:border-secondary/40 focus:ring-secondary',
    outline: 'border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 focus:ring-primary',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-primary hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg shadow-red-500/25',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
  };

  const spinnerSizes = {
    sm: 'sm' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <LoadingSpinner size={spinnerSizes[size]} className="text-current" />
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  );
}
