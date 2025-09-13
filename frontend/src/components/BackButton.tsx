'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  href, 
  label = 'Back', 
  className = '' 
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`btn-secondary ${className}`}
      type="button"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
