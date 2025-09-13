'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { mockApi } from '@/lib/mockApi';
import BuyerDetails from './BuyerDetails';
import BackButton from '@/components/BackButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BuyerType, BuyerHistoryType } from '@/lib/zod-schemas';

export default function BuyerPage() {
  const params = useParams();
  const [buyerData, setBuyerData] = useState<{ buyer: BuyerType; history: BuyerHistoryType[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBuyer() {
      try {
        const id = params.id as string;
        if (!id) {
          setError(true);
          return;
        }

        const data = await mockApi.getBuyer(id);
        if (!data) {
          setError(true);
          return;
        }

        setBuyerData(data);
      } catch (err) {
        console.error('Error fetching buyer:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBuyer();
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary">Loading buyer details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !buyerData) {
    notFound();
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen transition-colors duration-300" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <BackButton href="/buyers" label="Back to Buyers" />
          </div>
          <BuyerDetails buyer={buyerData.buyer} history={buyerData.history} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
