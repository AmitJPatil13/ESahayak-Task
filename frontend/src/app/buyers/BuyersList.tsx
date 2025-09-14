import { apiClient } from '@/lib/api';
import { BuyerFiltersType } from '@/lib/zod-schemas';
import BuyersTableClient from './BuyersTableClient';
import Pagination from './Pagination';
import EmptyState from '@/components/EmptyState';

interface BuyersListProps {
  filters: BuyerFiltersType;
}

export default async function BuyersList({ filters }: BuyersListProps) {
  const response = await apiClient.getBuyers(filters);

  if (response.items.length === 0) {
    return (
      <EmptyState
        title="No buyer leads found"
        description="Get started by creating your first buyer lead or adjust your search filters."
        action={{
          label: "Add New Lead",
          href: "/buyers/new"
        }}
        icon={
          <svg
            className="mx-auto h-12 w-12 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <BuyersTableClient buyers={response.items} />
      
      <div className="flex justify-center">
        <Pagination
          currentPage={response.page}
          pageSize={response.pageSize}
          total={response.total}
        />
      </div>
    </div>
  );
}
