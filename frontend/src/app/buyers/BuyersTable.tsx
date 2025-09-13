'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BuyerType } from '@/lib/zod-schemas';
import { mockApi } from '@/lib/mockApi';
import { useToast } from '@/contexts/ToastContext';
import { Trash2, Eye, Edit } from 'lucide-react';

interface BuyersTableProps {
  buyers: BuyerType[];
  onBuyerDeleted?: () => void;
}

export default function BuyersTable({ buyers, onBuyerDeleted }: BuyersTableProps) {
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isCompact = density === 'compact';
  const tableTextClass = isCompact ? 'text-sm' : 'text-base';

  const { showSuccess, showError } = useToast();

  const handleDelete = async (buyerId: string, buyerName: string) => {
    if (!confirm(`Are you sure you want to delete ${buyerName}?`)) {
      return;
    }

    setDeletingId(buyerId);
    try {
      await mockApi.deleteBuyer(buyerId);
      showSuccess('Buyer Deleted', `${buyerName} has been successfully deleted.`);
      onBuyerDeleted?.();
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
      case 'closed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'lost':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      'from-indigo-500/20 to-purple-500/20 text-primary',
      'from-emerald-500/20 to-teal-500/20 text-success',
      'from-cyan-500/20 to-blue-500/20 text-accent',
      'from-amber-500/20 to-orange-500/20 text-warning',
      'from-pink-500/20 to-rose-500/20 text-error',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="glass-card overflow-hidden rounded-2xl border border-white/10">
      {/* Table toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-slate-800/30 to-slate-700/30">
        <div className="text-sm text-gray-300 font-medium">
          <span className="text-white font-semibold">{buyers.length}</span> {buyers.length === 1 ? 'buyer' : 'buyers'}
        </div>
        <button
          type="button"
          onClick={() => setDensity(isCompact ? 'comfortable' : 'compact')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-200 text-xs font-medium shadow-sm"
          aria-label="Toggle density"
        >
          <div className="w-2 h-2 rounded-full bg-current"></div>
          {isCompact ? 'Comfortable' : 'Compact'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full ${tableTextClass}`}>
          <thead className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm">
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 font-semibold text-gray-200 text-xs uppercase tracking-wider">Buyer</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-200 text-xs uppercase tracking-wider">Contact</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-200 text-xs uppercase tracking-wider">Property</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-200 text-xs uppercase tracking-wider">Budget</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-200 text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-200 text-xs uppercase tracking-wider">Date</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-200 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => (
              <tr key={buyer.id} className="group hover:bg-gradient-to-r hover:from-white/5 hover:to-indigo-500/5 border-b border-white/5 transition-all duration-300 hover:shadow-sm">
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="flex items-center gap-4">
                    <div className={`${isCompact ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base'} bg-gradient-to-br ${getInitialsColor(buyer.fullName)} rounded-xl flex items-center justify-center font-bold shadow-lg flex-shrink-0 ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300`}>
                      {buyer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold text-white truncate group-hover:text-indigo-100 transition-colors duration-200 ${isCompact ? 'text-sm' : 'text-base'}`}>{buyer.fullName}</div>
                      <div className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors duration-200">{buyer.city}</div>
                    </div>
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="space-y-1">
                    <div className={`text-white font-medium group-hover:text-indigo-100 transition-colors duration-200 ${isCompact ? 'text-sm' : 'text-base'}`}>{buyer.phone}</div>
                    {buyer.email && (
                      <div className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors duration-200">{buyer.email}</div>
                    )}
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className="space-y-1">
                    <div className={`text-white font-medium truncate group-hover:text-indigo-100 transition-colors duration-200 ${isCompact ? 'text-sm' : 'text-base'}`}>{buyer.propertyType}</div>
                    <div className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors duration-200">
                      {buyer.bhk ? `${buyer.bhk} BHK` : 'Any'} • {buyer.purpose}
                    </div>
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className={`text-white font-medium group-hover:text-indigo-100 transition-colors duration-200 ${isCompact ? 'text-sm' : 'text-base'}`}>
                    {buyer.budgetMin && buyer.budgetMax ? 
                      `${formatCurrency(buyer.budgetMin).replace(',00,000', 'L')} - ${formatCurrency(buyer.budgetMax).replace(',00,000', 'L')}` : 
                      formatCurrency(buyer.budgetMin || buyer.budgetMax)?.replace(',00,000', 'L')
                    }
                  </div>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <span className={`inline-flex items-center ${isCompact ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-full text-xs font-semibold border shadow-sm group-hover:shadow-md transition-all duration-200 ${getStatusColor(buyer.status)}`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
                    {buyer.status}
                  </span>
                </td>
                <td className={`${isCompact ? 'py-3' : 'py-4'} px-6`}>
                  <div className={`text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-200 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                    {formatDate(buyer.createdAt).split(' ').map((part, i) => (
                      <div key={i}>{part}</div>
                    ))}
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
                      onClick={() => handleDelete(buyer.id, buyer.fullName)}
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
    </div>
  );
}
