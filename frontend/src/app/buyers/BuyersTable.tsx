'use client';

import { useState } from 'react';
import { BuyerType } from '@/lib/zod-schemas';
import Link from 'next/link';
import { Eye, Edit3 } from 'lucide-react';

interface BuyersTableProps {
  buyers: BuyerType[];
}

export default function BuyersTable({ buyers }: BuyersTableProps) {
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const isCompact = density === 'compact';
  const tableTextClass = isCompact ? 'text-sm' : 'text-base';

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
    <div className="glass-card overflow-hidden">
      {/* Table toolbar */}
      <div className="flex items-center justify-end px-4 pt-4">
        <button
          type="button"
          onClick={() => setDensity(isCompact ? 'comfortable' : 'compact')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-secondary hover:text-white hover:bg-white/10 transition"
          aria-label="Toggle density"
        >
          <span className="hidden sm:inline">{isCompact ? 'Comfortable' : 'Compact'} view</span>
          <span className="sm:hidden">{isCompact ? 'Comfort' : 'Compact'}</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className={`premium-table ${tableTextClass}`}>
          <thead className="sticky top-0 z-10 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50">
            <tr>
              <th>Buyer Details</th>
              <th>Contact Information</th>
              <th>Property Requirements</th>
              <th>Budget Range</th>
              <th>Status</th>
              <th>Created Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => (
              <tr key={buyer.id} className="group odd:bg-white/0 even:bg-white/[0.02]">
                <td>
                  <div className="flex items-center gap-4">
                    <div className={`${isCompact ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'} bg-gradient-to-br ${getInitialsColor(buyer.fullName)} rounded-2xl flex items-center justify-center font-bold shadow-lg`}>
                      {buyer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={`font-semibold text-white ${isCompact ? 'text-base' : 'text-lg'}`}>{buyer.fullName}</div>
                      <div className="text-secondary font-medium">{buyer.city}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="space-y-1">
                    <div className="text-white font-medium">{buyer.phone}</div>
                    {buyer.email && (
                      <div className="text-secondary text-sm">{buyer.email}</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="space-y-1">
                    <div className="text-white font-medium">{buyer.propertyType}</div>
                    <div className="text-secondary text-sm">
                      {buyer.bhk ? `${buyer.bhk} BHK` : 'Any BHK'} • {buyer.purpose}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-white font-medium">
                    {buyer.budgetMin && buyer.budgetMax ? 
                      `${formatCurrency(buyer.budgetMin)} - ${formatCurrency(buyer.budgetMax)}` : 
                      formatCurrency(buyer.budgetMin || buyer.budgetMax)
                    }
                  </div>
                </td>
                <td>
                  <span className={`inline-flex items-center ${isCompact ? 'px-2.5 py-1' : 'px-3 py-1.5'} rounded-full text-xs font-semibold border ${getStatusColor(buyer.status)}`}>
                    <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
                    {buyer.status}
                  </span>
                </td>
                <td>
                  <div className="text-secondary font-medium">{formatDate(buyer.createdAt)}</div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className={`inline-flex items-center gap-2 ${isCompact ? 'px-3 py-2' : 'px-4 py-2.5'} bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all duration-200 font-medium text-sm border border-primary/20 hover:border-primary/40 hover:scale-105`}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/buyers/${buyer.id}/edit`}
                      className={`inline-flex items-center gap-2 ${isCompact ? 'px-3 py-2' : 'px-4 py-2.5'} bg-success/10 text-success hover:bg-success/20 rounded-xl transition-all duration-200 font-medium text-sm border border-success/20 hover:border-success/40 hover:scale-105`}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Link>
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
