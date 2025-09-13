import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  circle?: boolean;
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
}

export function Skeleton({
  className = '',
  count = 1,
  circle = false,
  height = '1em',
  width = '100%',
  style: customStyle = {},
}: SkeletonProps) {
  const elements = [];
  for (let i = 0; i < count; i++) {
    const style: React.CSSProperties = {
      height,
      width: i === count - 1 ? width : '100%',
      borderRadius: circle ? '50%' : '0.25rem',
      marginBottom: i < count - 1 ? '0.5rem' : 0,
      ...customStyle,
    };

    elements.push(
      <span
        key={i}
        className={`skeleton ${className}`}
        style={style}
        aria-hidden="true"
      >
        &zwnj;
      </span>
    );
  }

  return <>{elements}</>;
}

export function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="grid gap-4" style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
        }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4" 
            style={{ 
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className="h-4 bg-gray-200 rounded"
                style={{
                  animationDelay: `${rowIndex * 0.1}s`,
                  animationDuration: '1.5s',
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
