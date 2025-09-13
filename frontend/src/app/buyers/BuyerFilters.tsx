'use client';

import { City, PropertyType, Status } from '@/lib/zod-schemas';

interface BuyerFiltersProps {
  filters: {
    status?: string;
    city?: string;
    propertyType?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function BuyerFilters({ filters, onFiltersChange }: BuyerFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={filters.city || ''}
        onChange={(e) => onFiltersChange({ city: e.target.value || undefined })}
        className="px-3 py-2 bg-surface border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">All Cities</option>
        {City.options.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      
      <select
        value={filters.status || ''}
        onChange={(e) => onFiltersChange({ status: e.target.value || undefined })}
        className="px-3 py-2 bg-surface border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">All Status</option>
        {Status.options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      
      <select
        value={filters.propertyType || ''}
        onChange={(e) => onFiltersChange({ propertyType: e.target.value || undefined })}
        className="px-3 py-2 bg-surface border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">All Property Types</option>
        {PropertyType.options.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      
      <button
        onClick={() => onFiltersChange({ status: undefined, city: undefined, propertyType: undefined })}
        className="px-4 py-2 text-secondary hover:text-primary transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
