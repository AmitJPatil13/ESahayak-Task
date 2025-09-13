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
          
          {/* Header Section with Glass Card */}
          <div className="glass-card rounded-2xl p-8 mb-8 border border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold gradient-text mb-3">Buyer Leads</h1>
                <p className="text-gray-300 text-lg">Manage and track all your buyer leads with powerful filtering and analytics</p>
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Real-time updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span>Advanced filtering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span>Export ready</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/buyers/import"
                  className="btn-outline flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Import CSV
                </Link>
                <Link
                  href="/buyers/export"
                  className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Export CSV
                </Link>
                <Link
                  href="/buyers/new"
                  className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add New Lead
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Leads</p>
                  <p className="text-2xl font-bold text-white mt-1">247</p>
                  <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +12% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Leads</p>
                  <p className="text-2xl font-bold text-white mt-1">89</p>
                  <p className="text-yellow-400 text-xs mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    36% of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Converted</p>
                  <p className="text-2xl font-bold text-white mt-1">34</p>
                  <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    13.8% rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg. Budget</p>
                  <p className="text-2xl font-bold text-white mt-1">₹85L</p>
                  <p className="text-purple-400 text-xs mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                    </svg>
                    Premium segment
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
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
