'use client';

import { Skeleton } from '@/components/Skeleton';

export default function LoadingImport() {
  return (
    <div className="space-y-8">
      <div>
        <div className="skeleton-title w-56" />
        <div className="skeleton-text w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-40 w-full" />
          <div className="flex gap-3">
            <div className="skeleton-button" />
            <div className="skeleton-button" />
            <div className="skeleton-button" />
          </div>
        </div>

        <div className="glass-card p-6 space-y-3">
          <div className="skeleton-title w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
