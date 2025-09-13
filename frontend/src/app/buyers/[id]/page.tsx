import { notFound } from 'next/navigation';
import { mockApi } from '@/lib/mockApi';
import BuyerDetails from './BuyerDetails';
import BackButton from '@/components/BackButton';

interface BuyerPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuyerPage({ params }: BuyerPageProps) {
  try {
    const { id } = await params;
    const buyer = await mockApi.getBuyer(id);
    const history: any[] = [];
    
    if (!buyer) {
      notFound();
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton href="/buyers" label="Back to Buyers" />
        </div>
        <BuyerDetails buyer={buyer} history={history} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
