'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { BuyerFiltersType, City, PropertyType, Status, Timeline } from '@/lib/zod-schemas';

interface BuyerFiltersProps {
  initialFilters: BuyerFiltersType;
}

export default function BuyerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateFilters = useCallback((newFilters: Partial<BuyerFiltersType>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      params.set('page', '1');
    }

    router.push(`/buyers?${params.toString()}`);
  }, [router, searchParams]);

  // Debounced search
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      updateFilters({ search: search || undefined });
    }, 300);

    setDebounceTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [search, updateFilters]);

  const clearFilters = () => {
    setSearch('');
    router.push('/buyers');
  };

  return (
    <div className="glass-card rounded-2xl p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Filter & Search</h2>
        <p className="text-secondary">Refine your buyer leads with advanced filtering options</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {/* Search */}
        <div className="xl:col-span-2">
          <label htmlFor="search" className="block text-sm font-semibold text-white mb-3">
            Search Buyers
          </label>
          <input
            type="text"
            id="buyer-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="premium-input w-full"
            aria-label="Search buyers (Press / to focus)"
          />
        </div>

        {/* City Filter */}
        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-white mb-3">
            City
          </label>
          <select
            id="city"
            value={searchParams.get('city') || ''}
            onChange={(e) => updateFilters({ city: e.target.value as any || undefined })}
            className="premium-select w-full"
          >
            <option value="">All Cities</option>
            {City.options.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Filter */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-semibold text-white mb-3">
            Property Type
          </label>
          <select
            id="propertyType"
            value={searchParams.get('propertyType') || ''}
            onChange={(e) => updateFilters({ propertyType: e.target.value as any || undefined })}
            className="premium-select w-full"
          >
            <option value="">All Types</option>
            {PropertyType.options.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-white mb-3">
            Status
          </label>
          <select
            id="status"
            value={searchParams.get('status') || ''}
            onChange={(e) => updateFilters({ status: e.target.value as any || undefined })}
            className="premium-select w-full"
          >
            <option value="">All Status</option>
            {Status.options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline Filter */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-semibold text-white mb-3">
            Timeline
          </label>
          <select
            id="timeline"
            value={searchParams.get('timeline') || ''}
            onChange={(e) => updateFilters({ timeline: e.target.value as any || undefined })}
            className="premium-select w-full"
          >
            <option value="">All Timelines</option>
            {Timeline.options.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" className="block text-sm font-semibold text-white mb-3">
            Sort By
          </label>
          <select
            id="sort"
            value={`${searchParams.get('sort') || 'createdAt'}-${searchParams.get('order') || 'desc'}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              updateFilters({ sort: sort as any, order: order as any });
            }}
            className="premium-select w-full"
          >
            <option value="updatedAt-desc">Latest Updated</option>
            <option value="createdAt-desc">Latest Created</option>
            <option value="fullName-asc">Name A-Z</option>
            <option value="fullName-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="btn-secondary px-6 py-3"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
