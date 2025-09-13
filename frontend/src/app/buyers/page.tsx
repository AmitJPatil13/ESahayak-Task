import { Suspense } from 'react';
import { mockApi } from '@/lib/mockApi';
import { BuyerFiltersType } from '@/lib/zod-schemas';
import BuyerFilters from './BuyerFilters';
import BuyersList from './BuyersList';
import ErrorBoundary from '@/components/ErrorBoundary';
import BackButton from '@/components/BackButton';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SearchParams {
  page?: string;
  search?: string;
  status?: string;
  sort?: string;
  order?: string;
}

interface BuyersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  // Convert search params to filters
  const filters: BuyerFiltersType = {
    page: parseInt((await searchParams).page || '1'),
    search: (await searchParams).search,
    status: (await searchParams).status as any,
    sort: (await searchParams).sort as any,
    order: (await searchParams).order as any,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <KeyboardShortcuts searchInputId="buyer-search" newEntityHref="/buyers/new" />
          <div className="mb-6">
            <BackButton href="/" label="Back to Home" />
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-3">Buyer Leads</h1>
              <p className="text-secondary text-lg">Manage and track all your buyer leads with advanced filtering and analytics</p>
            </div>
            <div className="mt-6 lg:mt-0 flex gap-4">
              <Link
                href="/buyers/import"
                className="btn-outline flex items-center gap-2 px-6 py-3"
              >
                Import CSV
              </Link>
              <Link
                href="/buyers/export"
                className="btn-secondary flex items-center gap-2 px-6 py-3"
              >
                Export Data
              </Link>
              <Link
                href="/buyers/new"
                className="btn-primary flex items-center gap-2 px-6 py-3"
              >
                <Plus className="w-5 h-5" />
                Add New Buyer
              </Link>
            </div>
          </div>

          <ErrorBoundary>
            <Suspense fallback={
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 animate-spin"></div>
                  <div className="text-white text-lg">Loading buyer leads...</div>
                  <div className="text-secondary mt-2">Please wait while we fetch your data</div>
                </div>
              </div>
            }>
              <div className="space-y-8">
                <BuyerFilters />
                <BuyersList filters={filters} />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function BuyersListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
