'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
}

export default function Pagination({ currentPage, pageSize, total }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/buyers?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-outline px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-outline px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">
            Showing <span className="font-semibold text-white">{startItem}</span> to{' '}
            <span className="font-semibold text-white">{endItem}</span> of{' '}
            <span className="font-semibold text-primary">{total}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-lg backdrop-blur-sm" aria-label="Pagination">
            <button
              onClick={() => updatePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            
            {getPageNumbers().map((page, index) => (
              <span key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 focus:outline-offset-0">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => updatePage(page as number)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border border-white/10 hover:bg-white/10 focus:z-20 focus:outline-offset-0 transition-all duration-200 ${
                      currentPage === page
                        ? 'z-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-300 bg-white/5'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </span>
            ))}
            
            <button
              onClick={() => updatePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
