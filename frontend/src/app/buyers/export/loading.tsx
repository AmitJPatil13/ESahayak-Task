'use client';

import { Skeleton } from '@/components/Skeleton';

export default function LoadingExport() {
  return (
    <div className="space-y-8">
      <div>
        <div className="skeleton-title w-56" />
        <div className="skeleton-text w-80" />
      </div>

      {/* Filters area */}
      <div className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="skeleton h-10" />
          <div className="skeleton h-10" />
          <div className="skeleton h-10" />
          <div className="skeleton h-10" />
        </div>
        <div className="flex gap-3">
          <div className="skeleton-button" />
          <div className="skeleton-button" />
        </div>
      </div>

      {/* Preview table */}
      <div className="glass-card p-4">
        <div className="skeleton h-6 w-40 mb-4" />
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`head-${i}`} className="skeleton h-4" />
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, r) => (
            <div key={`row-${r}`} className="grid gap-3" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
              {Array.from({ length: 6 }).map((_, c) => (
                <div key={`${r}-${c}`} className="skeleton h-4" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3">
        <div className="skeleton-button" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}
