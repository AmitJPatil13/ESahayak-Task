import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api';
import BuyerForm from '../../BuyerForm';
import BackButton from '@/components/BackButton';
import { Edit3 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface EditBuyerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBuyerPage({ params }: EditBuyerPageProps) {
  try {
    const { id } = await params;
    const buyer = await apiClient.getBuyer(id);
    
    if (!buyer) {
      notFound();
    }

    return (
      <ProtectedRoute>
        <div className="min-h-screen transition-colors duration-300" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <BackButton href={`/buyers/${id}`} label="Back to Details" />
            </div>
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold gradient-text">Edit Buyer</h1>
              </div>
              <p className="text-muted text-lg">Update buyer lead information and details</p>
            </div>
            
            <div className="glass-card rounded-2xl shadow-xl">
              <div className="px-8 py-10">
                <BuyerForm buyer={buyer} />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  } catch (error) {
    notFound();
  }
}
