'use client';

import { useState } from 'react';
import { BuyerType } from '@/lib/zod-schemas';
import { mockApi } from '@/lib/mockApi';
import { useToast } from '@/contexts/ToastContext';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BuyersTableClientProps {
  buyers: BuyerType[];
}

export default function BuyersTableClient({ buyers }: BuyersTableClientProps) {
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{buyerId: string, buyerName: string} | null>(null);
  const [localBuyers, setLocalBuyers] = useState(buyers);
  const isCompact = density === 'compact';
  const tableTextClass = isCompact ? 'text-sm' : 'text-base';
  const router = useRouter();

  const { showSuccess, showError } = useToast();

  const handleDeleteClick = (buyerId: string, buyerName: string) => {
    setShowDeleteConfirm({buyerId, buyerName});
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    
    const {buyerId, buyerName} = showDeleteConfirm;
    setDeletingId(buyerId);
    try {
      await mockApi.deleteBuyer(buyerId);
      showSuccess('Buyer Deleted', `${buyerName} has been successfully deleted.`);
      
      // Update local state immediately for instant UI feedback
      setLocalBuyers(prev => prev.filter(buyer => buyer.id !== buyerId));
      setShowDeleteConfirm(null);
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error('Error deleting buyer:', error);
      showError('Delete Failed', 'Failed to delete buyer. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'contacted':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'qualified':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'visited':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'negotiation':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'converted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'lost':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500',
      'bg-gradient-to-br from-pink-500 to-rose-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Buyer Leads</h3>
          <p className="text-sm text-gray-400 mt-1">{localBuyers.length} leads found</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setDensity('comfortable')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                density === 'comfortable'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Comfortable
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                density === 'compact'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className={`${isCompact ? 'px-4 py-2' : 'px-6 py-3'} text-left text-xs font-medium text-gray-300 uppercase tracking-wider`}>
                Buyer
              </th>
              <th className={`${isCompact ? 'px-4 py-2' : 'px-6 py-3'} text-left text-xs font-medium text-gray-300 uppercase tracking-wider`}>
                Contact
              </th>
              <th className={`${isCompact ? 'px-4 py-2' : 'px-6 py-3'} text-left text-xs font-medium text-gray-300 uppercase tracking-wider`}>
                Property
              </th>
              <th className={`${isCompact ? 'px-4 py-2' : 'px-6 py-3'} text-left text-xs font-medium text-gray-300 uppercase tracking-wider`}>
                Budget
              </th>
              <th className={`${isCompact ? 'px-4 py-2' : 'px-6 py-3'} text-left text-xs font-medium text-gray-300 uppercase tracking-wider`}>
                Status
              </th>
              <th className={`${isCompact ? 'px-4 py-2' : 'px-6 py-3'} text-right text-xs font-medium text-gray-300 uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {localBuyers.map((buyer) => (
              <tr key={buyer.id} className="group hover:bg-white/5 transition-all duration-200">
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="flex items-center">
                    <div className={`${isCompact ? 'h-8 w-8' : 'h-10 w-10'} ${getAvatarColor(buyer.fullName)} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
                      {getInitials(buyer.fullName)}
                    </div>
                    <div className="ml-4">
                      <div className={`font-medium text-white ${tableTextClass} group-hover:text-blue-300 transition-colors duration-200`}>
                        {buyer.fullName}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {buyer.city}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="space-y-1">
                    <div className={`text-gray-300 ${tableTextClass}`}>{buyer.phone}</div>
                    {buyer.email && (
                      <div className="text-gray-400 text-sm">{buyer.email}</div>
                    )}
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="space-y-1">
                    <div className={`text-gray-300 ${tableTextClass}`}>
                      {buyer.bhk} BHK {buyer.propertyType}
                    </div>
                    <div className="text-gray-400 text-sm">{buyer.purpose}</div>
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="space-y-1">
                    <div className={`text-gray-300 font-medium ${tableTextClass}`}>
                      {formatCurrency(buyer.budgetMin)} - {formatCurrency(buyer.budgetMax)}
                    </div>
                    <div className="text-gray-400 text-sm">{buyer.timeline}</div>
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(buyer.status)}`}>
                      {buyer.status}
                    </span>
                  </div>
                </td>
                <td className={`text-right ${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className={`inline-flex items-center gap-2 ${isCompact ? 'px-3 py-1.5' : 'px-4 py-2'} bg-gradient-to-r from-indigo-500/10 to-blue-500/10 text-indigo-400 hover:from-indigo-500/20 hover:to-blue-500/20 hover:text-indigo-300 rounded-xl transition-all duration-200 font-medium text-xs border border-indigo-500/20 hover:border-indigo-400/40 shadow-sm hover:shadow-md hover:scale-105`}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      {!isCompact && 'View'}
                    </Link>
                    <Link
                      href={`/buyers/${buyer.id}/edit`}
                      className={`inline-flex items-center gap-2 ${isCompact ? 'px-3 py-1.5' : 'px-4 py-2'} bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 hover:text-emerald-300 rounded-xl transition-all duration-200 font-medium text-xs border border-emerald-500/20 hover:border-emerald-400/40 shadow-sm hover:shadow-md hover:scale-105`}
                      title="Edit Buyer"
                    >
                      <Edit className="w-4 h-4" />
                      {!isCompact && 'Edit'}
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(buyer.id, buyer.fullName)}
                      disabled={deletingId === buyer.id}
                      className={`inline-flex items-center gap-2 ${isCompact ? 'px-3 py-1.5' : 'px-4 py-2'} bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-400 hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-300 rounded-xl transition-all duration-200 font-medium text-xs border border-red-500/20 hover:border-red-400/40 shadow-sm hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Delete Buyer"
                    >
                      <Trash2 className="w-4 h-4" />
                      {!isCompact && (deletingId === buyer.id ? 'Deleting...' : 'Delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-50">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-2xl glass-card border border-white/10 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-semibold text-white">Delete Lead</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          Are you sure you want to delete <span className="font-medium text-white">{showDeleteConfirm.buyerName}</span>? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex gap-3 justify-end border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(null)}
                    className="btn-outline px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deletingId === showDeleteConfirm.buyerId}
                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {deletingId === showDeleteConfirm.buyerId ? 'Deleting...' : 'Delete'}
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
