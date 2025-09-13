'use client';

import { Skeleton, SkeletonTable } from '@/components/Skeleton';

export default function LoadingBuyers() {
  return (
    <div className="space-y-6">
      {/* Toolbar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="skeleton h-10 w-full sm:w-80" />
        </div>
        <div className="flex gap-3">
          <div className="skeleton-button" />
          <div className="skeleton-button" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <SkeletonTable rows={6} columns={6} />
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-32" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div className="skeleton h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
