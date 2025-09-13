'use client';

import { useState } from 'react';
import { mockApi } from '@/lib/mockApi';
import { useToast } from '@/contexts/ToastContext';
import { BuyerFiltersType } from '@/lib/zod-schemas';
import { Download, FileText, Filter } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import BackButton from '@/components/BackButton';

export default function ExportPage() {
  const { showSuccess, showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<BuyerFiltersType>({});
  const [exportCount, setExportCount] = useState<number | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csvData = await mockApi.exportBuyers(filters);
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buyers-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Get count for feedback
      const result = await mockApi.getBuyers(filters);
      setExportCount(result.total);
      showSuccess('Export Successful', `Successfully exported ${result.total} buyers to CSV file.`);
      
    } catch (error) {
      console.error('Export failed:', error);
      showError('Export Failed', 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <BackButton href="/buyers" label="Back to Buyers" />
          </div>

          {/* Header Section */}
          <div className="glass-card rounded-2xl p-8 mb-8 border border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-3">Export Buyer Data</h1>
              <p className="text-gray-300 text-lg">Download your buyer leads as CSV file with advanced filtering options</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Export Options */}
            <div className="glass-card rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-400" />
                </div>
                Export Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    City Filter
                  </label>
                  <select
                    value={filters.city || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: (e.target.value || undefined) as any }))}
                    className="premium-select"
                  >
                    <option value="">All Cities</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Mohali">Mohali</option>
                    <option value="Panchkula">Panchkula</option>
                    <option value="Zirakpur">Zirakpur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Status Filter
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: (e.target.value || undefined) as any }))}
                    className="premium-select"
                  >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Visited">Visited</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="glass-card rounded-2xl p-8 border border-white/10">
              <div className="text-center">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="btn-primary px-12 py-4 text-lg font-medium flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing Export...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Export to CSV
                    </>
                  )}
                </button>
                <p className="text-gray-400 text-sm mt-4">
                  Export will include all buyer data matching your selected filters
                </p>
              </div>
            </div>

            {exportCount !== null && (
              <div className="glass-card rounded-2xl p-6 border border-green-400/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-green-400 font-semibold text-lg">Export Completed</h3>
                    <p className="text-green-300">
                      Successfully exported {exportCount} buyer records to CSV file
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
