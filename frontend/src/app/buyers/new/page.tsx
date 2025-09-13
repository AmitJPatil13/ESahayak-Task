import BuyerForm from '../BuyerForm';
import BackButton from '@/components/BackButton';
import { UserPlus } from 'lucide-react';

export default function NewBuyerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton href="/buyers" label="Back to Buyers" />
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Add New Buyer</h1>
        </div>
        <p className="text-gray-600 text-lg">Create a new buyer lead entry with comprehensive details</p>
      </div>
      
      <div className="glass-card rounded-2xl shadow-xl">
        <div className="px-8 py-10">
          <BuyerForm />
        </div>
      </div>
    </div>
  );
}
