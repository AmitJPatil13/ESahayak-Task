'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { mockApi } from '@/lib/mockApi';
import BackButton from '@/components/BackButton';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ImportResult {
  inserted: number;
  errors: Array<{ row: number; message: string }>;
}

export default function ImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const csvContent = await file.text();
      const importResult = await mockApi.importBuyers(csvContent);
      setResult(importResult);
    } catch (error: any) {
      alert(error.message || 'Import failed. Please try again.');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <BackButton href="/buyers" label="Back to Buyers" />
            <h1 className="text-3xl font-bold text-white mb-2">Import Buyer Data</h1>
            <p className="text-secondary">Upload CSV file to import buyer leads (max 200 rows)</p>
          </div>

          <div className="space-y-6">
            {/* Template Download */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-400 font-medium">Need a template?</h3>
                  <p className="text-blue-300 text-sm">Download our CSV template with sample data</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Download Template
                </button>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                Drop your CSV file here or click to browse
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Supports CSV files up to 200 rows
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="btn-primary px-6 py-2"
              >
                {isImporting ? 'Importing...' : 'Select File'}
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

            {/* Import Results */}
            {result && (
              <div className="space-y-4">
                {result.inserted > 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <h3 className="text-green-400 font-medium">Import Successful</h3>
                        <p className="text-green-300 text-sm">
                          {result.inserted} buyer records imported successfully
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-red-400 font-medium mb-2">
                          {result.errors.length} Errors Found
                        </h3>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {result.errors.map((error, index) => (
                            <p key={index} className="text-red-300 text-sm">
                              Row {error.row}: {error.message}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => router.push('/buyers')}
                    className="btn-primary px-6 py-2"
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
