'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  Home,
  Target,
  Clock,
  Tag,
  User,
  Building
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { BuyerType, BuyerHistoryType } from '@/lib/zod-schemas';
import BuyerForm from '../BuyerForm';
import { useWebSocket } from '@/hooks/useWebSocket';

interface BuyerDetailsProps {
  buyer: BuyerType;
  history: BuyerHistoryType[];
}

export default function BuyerDetails({ buyer, history }: BuyerDetailsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { notifyBuyerUpdate, notifyBuyerDelete } = useWebSocket();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      New: 'bg-blue-100 text-blue-800',
      Qualified: 'bg-green-100 text-green-800',
      Contacted: 'bg-yellow-100 text-yellow-800',
      Visited: 'bg-purple-100 text-purple-800',
      Negotiation: 'bg-orange-100 text-orange-800',
      Converted: 'bg-emerald-100 text-emerald-800',
      Dropped: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusColors[status] || 'bg-gray-100 text-primary'
        }`}
      >
        {status}
      </span>
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log('Deleting buyer with ID:', buyer.id);
      await apiClient.deleteBuyer(buyer.id);
      notifyBuyerDelete('buyer-deleted');
      router.push('/buyers');
    } catch (error) {
      console.error('Error deleting buyer:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderHistoryDiff = (diff: Record<string, any>) => {
    if (diff.created) {
      return <span className="text-green-600">Lead created</span>;
    }

    return (
      <div className="space-y-1">
        {Object.entries(diff).map(([field, change]: [string, any]) => (
          <div key={field} className="text-sm">
            <span className="font-medium">{field}:</span>{' '}
            <span className="text-red-600">{change.from || 'empty'}</span> →{' '}
            <span className="text-green-600">{change.to || 'empty'}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Buyers
          </button>
        </div>

        {/* Header */}
        <div className="glass-card rounded-2xl p-8 mb-8 border border-border/20">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold gradient-text">
                    {buyer.fullName}
                  </h2>
                  <p className="text-secondary text-lg">{getStatusBadge(buyer.status)}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-6">
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span className="text-primary font-medium">{buyer.phone}</span>
                </div>
                {buyer.email && (
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span className="text-primary font-medium">{buyer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span className="text-primary font-medium">{buyer.city}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 lg:mt-0 flex gap-3">
              <Link
                href={`/buyers/${buyer.id}/edit`}
                className="btn-secondary flex items-center gap-2 px-6 py-3"
              >
                <Edit className="w-4 h-4" />
                Edit Lead
              </Link>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-outline border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 flex items-center gap-2 px-6 py-3"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Buyer Details */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8 border border-border/20">
              <h3 className="text-xl font-semibold text-primary mb-6">Lead Details</h3>
              <div className="space-y-6">
                <dl className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Status</dt>
                    <dd className="text-sm text-primary">
                      {getStatusBadge(buyer.status)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Location</dt>
                    <dd className="text-sm text-primary font-medium">{buyer.city}</dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Property Type</dt>
                    <dd className="text-sm text-primary font-medium">
                      {buyer.propertyType}
                      {buyer.bhk && ` - ${buyer.bhk} BHK`}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Purpose</dt>
                    <dd className="text-sm text-primary font-medium capitalize">{buyer.purpose}</dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Budget Range</dt>
                    <dd className="text-sm text-primary font-medium">
                      {buyer.budgetMin || buyer.budgetMax ? (
                        <>
                          {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                        </>
                      ) : (
                        'Not specified'
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Timeline</dt>
                    <dd className="text-sm text-primary font-medium">{buyer.timeline}</dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Source</dt>
                    <dd className="text-sm text-primary font-medium">{buyer.source}</dd>
                  </div>
                  {buyer.tags && Array.isArray(buyer.tags) && buyer.tags.length > 0 && (
                    <div className="flex justify-between items-start py-3 border-b border-border/20">
                      <dt className="text-sm font-medium text-secondary">Tags</dt>
                      <dd className="text-sm">
                        <div className="flex flex-wrap gap-2">
                          {buyer.tags?.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-400/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                  {buyer.notes && (
                    <div className="flex justify-between items-start py-3 border-b border-border/20">
                      <dt className="text-sm font-medium text-secondary">Notes</dt>
                      <dd className="text-sm text-primary font-medium max-w-md">{buyer.notes}</dd>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <dt className="text-sm font-medium text-secondary">Created</dt>
                    <dd className="text-sm text-primary font-medium">
                      {formatDate(buyer.createdAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <dt className="text-sm font-medium text-secondary">Last Updated</dt>
                    <dd className="text-sm text-primary font-medium">
                      {formatDate(buyer.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <div className="glass-card rounded-2xl p-8 border border-border/20">
            <h3 className="text-xl font-semibold text-primary mb-6">Recent Activity</h3>
            <div className="mt-5">
              {history && Array.isArray(history) && history.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {history?.map((entry, entryIdx) => (
                      <li key={entry.id}>
                        <div className="relative pb-8">
                          {entryIdx !== (history?.length || 0) - 1 ? (
                            <span
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <div className="text-sm text-muted">
                                  {renderHistoryDiff(entry.diff)}
                                </div>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-muted">
                                {formatDate(entry.changedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted">No activity recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-50">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-2xl glass-card border border-border/20 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-semibold text-primary">Delete Lead</h3>
                      <div className="mt-2">
                        <p className="text-sm text-secondary">
                          Are you sure you want to delete this lead? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex gap-3 justify-end border-t border-border/20">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-outline px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-500 text-primary px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
