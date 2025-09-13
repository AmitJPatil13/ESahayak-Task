'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockApi } from '@/lib/mockApi';
import { BuyerFiltersType } from '@/lib/zod-schemas';
import BackButton from '@/components/BackButton';
import { Download, FileText, Filter } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ExportPage() {
  const router = useRouter();
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
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
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

        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Export Buyer Data</h1>
            <p className="text-secondary">Download your buyer leads as CSV file</p>
          </div>

          <div className="space-y-6">
            {/* Export Options */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Export Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City Filter
                  </label>
                  <select
                    value={filters.city || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value || undefined }))}
                    className="premium-input"
                  >
                    <option value="">All Cities</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Mohali">Mohali</option>
                    <option value="Panchkula">Panchkula</option>
                    <option value="Zirakpur">Zirakpur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status Filter
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                    className="premium-input"
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
            <div className="text-center">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="btn-primary px-8 py-4 text-lg flex items-center gap-3 mx-auto"
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Export to CSV
                  </>
                )}
              </button>
            </div>

            {exportCount !== null && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <p className="text-green-400 font-medium">
                  ✅ Successfully exported {exportCount} buyer records
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
