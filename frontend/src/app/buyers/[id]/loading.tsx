'use client';

import { Skeleton } from '@/components/Skeleton';

export default function LoadingBuyerDetails() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="skeleton-avatar" />
          <div>
            <div className="skeleton-title w-48" />
            <div className="skeleton-text w-32" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="skeleton-button" />
          <div className="skeleton-button" />
        </div>
      </div>

      {/* Info grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="skeleton-text w-24" />
            <div className="skeleton h-6 w-40" />
          </div>
        ))}
      </div>

      {/* Notes/history skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4 space-y-3">
          <div className="skeleton-title w-36" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-full" />
          ))}
        </div>
        <div className="glass-card p-4 space-y-3">
          <div className="skeleton-title w-36" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
