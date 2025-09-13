'use client';

import { BuyerType } from '@/lib/zod-schemas';
import Link from 'next/link';
import { Eye, Edit3 } from 'lucide-react';

interface BuyersTableProps {
  buyers: BuyerType[];
}

export default function BuyersTable({ buyers }: BuyersTableProps) {
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
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      case 'converted':
        return 'status-converted';
      default:
        return 'status-inactive';
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
      <div className="overflow-x-auto">
        <table className="premium-table">
          <thead>
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
              <tr key={buyer.id} className="group">
                <td>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getInitialsColor(buyer.fullName)} rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg`}>
                      {buyer.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{buyer.fullName}</div>
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
                  <span className={`status-badge ${getStatusColor(buyer.status)}`}>
                    {buyer.status}
                  </span>
                </td>
                <td>
                  <div className="text-secondary font-medium">{formatDate(buyer.createdAt)}</div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/buyers/${buyer.id}/edit`}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-success/10 text-success hover:bg-success/20 rounded-lg transition-colors font-medium text-sm"
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
