interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
