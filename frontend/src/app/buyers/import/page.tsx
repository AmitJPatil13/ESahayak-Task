'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { mockApi } from '@/lib/mockApi';
import { useToast } from '@/contexts/ToastContext';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ImportResult {
  inserted: number;
  errors: Array<{ row: number; message: string }>;
}

export default function ImportPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      showError('Invalid File', 'Please select a CSV file');
      return;
    }

    setIsImporting(true);
    setResult(null);
    try {
      const csvContent = await file.text();
      const importResult = await mockApi.importBuyers(csvContent);
      setResult(importResult);
      if (importResult.inserted > 0) {
        showSuccess('Import Successful', `Successfully imported ${importResult.inserted} buyers`);
      }
    } catch (error: any) {
      showError('Import Failed', error.message || 'Import failed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const downloadTemplate = () => {
    const template = `fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
John Doe,john@example.com,9876543210,Chandigarh,Apartment,3,Buy,5000000,7000000,0-3m,Website,Looking for 3BHK,urgent;family,New
Jane Smith,jane@example.com,9876543211,Mohali,Villa,4,Buy,8000000,12000000,3-6m,Referral,Independent villa preferred,premium;villa,Qualified`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buyers-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-colors duration-300" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="glass-card rounded-2xl p-8 mb-8 border border-border/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-3">Import Buyer Data</h1>
              <p className="text-secondary text-lg">Upload CSV file to import buyer leads (max 200 rows)</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Template Download */}
            <div className="glass-card rounded-2xl p-6 border border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-primary font-semibold text-lg">Need a template?</h3>
                    <p className="text-secondary">Download our CSV template with sample data and proper formatting</p>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="btn-secondary flex items-center gap-2 px-6 py-3"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="glass-card rounded-2xl p-8 border border-border/20">
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary/50 bg-primary/5 scale-105' 
                    : 'border-border/40 hover:border-white/30 hover:bg-surface/20'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Drop your CSV file here
                </h3>
                <p className="text-secondary mb-2">
                  or click to browse and select from your computer
                </p>
                <p className="text-muted text-sm mb-8">
                  Supports CSV files up to 200 rows • Maximum file size: 5MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="btn-primary px-8 py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5" />
                      Select CSV File
                    </div>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>

            {/* Import Results */}
            {result && (
              <div className="space-y-6">
                {result.inserted > 0 && (
                  <div className="glass-card rounded-2xl p-6 border border-green-400/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-green-400 font-semibold text-lg">Import Successful</h3>
                        <p className="text-green-300">
                          {result.inserted} buyer records imported successfully
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div className="glass-card rounded-2xl p-6 border border-red-400/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-red-400 font-semibold text-lg mb-3">
                          {result.errors.length} Errors Found
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {result.errors.map((error, index) => (
                            <div key={index} className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                              <p className="text-red-300 text-sm font-medium">
                                Row {error.row}: {error.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => router.push('/buyers')}
                    className="btn-primary px-8 py-4 text-lg font-medium"
                  >
                    View Imported Buyers
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
