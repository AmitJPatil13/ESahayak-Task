'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import BuyersTable from './BuyersTable';
import BuyerFilters from './BuyerFilters';
import { apiClient } from '@/lib/api';
import { BuyerType, BuyerFiltersType } from '@/lib/zod-schemas';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function BuyersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buyers, setBuyers] = useState<BuyerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Real-time WebSocket connection
  const { isConnected, notifyBuyerUpdate, notifyBuyerCreate, notifyBuyerDelete } = useWebSocket();

  // URL-synced state
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const cityFilter = searchParams.get('city') || '';
  const propertyTypeFilter = searchParams.get('propertyType') || '';
  const sortBy = searchParams.get('sortBy') || 'updatedAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  // Update URL with new parameters
  const updateURL = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });

    // Reset to page 1 when filters change (except when changing page itself)
    if (!params.page && Object.keys(params).length > 0) {
      newParams.set('page', '1');
    }

    router.push(`/buyers?${newParams.toString()}`);
  };

  // Load buyers data
  const loadBuyers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: BuyerFiltersType = {
        page: currentPage,
        pageSize: 10,
        search: searchQuery || undefined,
        status: statusFilter as any || undefined,
        city: cityFilter as any || undefined,
        propertyType: propertyTypeFilter as any || undefined,
        sort: sortBy as any,
        order: sortOrder as any,
      };

      const response = await apiClient.getBuyers(filters);
      setBuyers(response.items);
      setTotalBuyers(response.total);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (err) {
      setError('Failed to load buyers');
      console.error('Error loading buyers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data when URL parameters change
  useEffect(() => {
    loadBuyers();
  }, [currentPage, searchQuery, statusFilter, cityFilter, propertyTypeFilter, sortBy, sortOrder]);

  // Listen for real-time updates
  useEffect(() => {
    const handleBuyerRefresh = () => {
      console.log('🔄 Real-time update received, refreshing buyers data...');
      loadBuyers();
    };

    window.addEventListener('buyer:refresh', handleBuyerRefresh);
    
    return () => {
      window.removeEventListener('buyer:refresh', handleBuyerRefresh);
    };
  }, []);

  // Debounced search
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle search with debouncing
  const handleSearch = (query: string) => {
    setSearchInput(query);
    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      updateURL({ search: query });
    }, 300);

    setDebounceTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // Handle filter changes
  const handleFilterChange = (filters: Partial<BuyerFiltersType>) => {
    updateURL({
      status: filters.status || '',
      city: filters.city || '',
      propertyType: filters.propertyType || '',
    });
  };

  // Handle sort changes
  const handleSort = (sort: string, order: string) => {
    updateURL({ sortBy: sort, sortOrder: order });
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  // Handle buyer deletion
  const handleBuyerDeleted = () => {
    loadBuyers();
    // Notify other connected users about the deletion
    notifyBuyerDelete('buyer-deleted');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-colors duration-300" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Navbar />
          
          {/* Header Section with Glass Card */}
          <div className="glass-card p-6 mb-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Buyer Leads</h1>
                <p className="text-secondary">Manage and track your buyer leads</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-secondary">
                  <span>Total: {totalBuyers}</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/buyers/import"
                  className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </Link>
                <Link
                  href="/buyers/export"
                  className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Link>
                <Link
                  href="/buyers/new"
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add Buyer
                </Link>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="glass-card p-8 rounded-2xl text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-secondary">Loading buyers...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="glass-card p-6 rounded-2xl border-red-200 bg-red-50/10">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={loadBuyers}
                className="mt-2 btn-secondary px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="glass-card p-6 mb-6 rounded-2xl">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <input
                  id="buyer-search"
                  type="text"
                  placeholder="Search buyers by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary placeholder-secondary transition-all duration-200"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  showFilters 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-surface border-border text-primary hover:bg-surface/80'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <BuyerFilters
                  filters={{
                    status: statusFilter as any,
                    city: cityFilter as any,
                    propertyType: propertyTypeFilter as any,
                  }}
                  onFiltersChange={handleFilterChange}
                />
              </div>
            )}
          </div>

          {/* Buyers Table */}
          {!loading && !error && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-primary">All Buyers</h2>
                    {isConnected && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-medium">Live</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-secondary">
                    Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalBuyers)} of {totalBuyers} results
                  </div>
                </div>
                
                <BuyersTable 
                  buyers={buyers}
                  onBuyerDeleted={handleBuyerDeleted}
                />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-border text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface/80 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            page === currentPage
                              ? 'bg-primary text-white border-primary'
                              : 'border-border text-primary hover:bg-surface/80'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-border text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface/80 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
