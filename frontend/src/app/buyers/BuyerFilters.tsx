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
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              id="buyer-search"
              type="text"
              placeholder="Search buyers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="premium-input w-full"
              aria-label="Search buyers by name, phone, or email"
            />
          </div>
        </div>
        {/* Filters */}
        <div className="flex gap-2">
          <select
            id="city"
            value={searchParams.get('city') || ''}
            onChange={(e) => updateFilters({ city: e.target.value as any || undefined })}
            className="premium-select text-sm"
          >
            <option value="">City</option>
            {City.options.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          
          <select
            id="status"
            value={searchParams.get('status') || ''}
            onChange={(e) => updateFilters({ status: e.target.value as any || undefined })}
            className="premium-select text-sm"
          >
            <option value="">Status</option>
            {Status.options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          
          <select
            id="sort"
            value={`${searchParams.get('sort') || 'createdAt'}-${searchParams.get('order') || 'desc'}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              updateFilters({ sort: sort as any, order: order as any });
            }}
            className="premium-select text-sm"
          >
            <option value="updatedAt-desc">Latest</option>
            <option value="createdAt-desc">Newest</option>
            <option value="fullName-asc">A-Z</option>
            <option value="fullName-desc">Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
