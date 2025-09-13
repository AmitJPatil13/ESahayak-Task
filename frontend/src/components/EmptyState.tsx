import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  const defaultIcon = (
    <svg
      className="mx-auto h-12 w-12 text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
  );

  return (
    <div className="text-center py-12">
      {icon || defaultIcon}
      <h3 className="mt-2 text-sm font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
