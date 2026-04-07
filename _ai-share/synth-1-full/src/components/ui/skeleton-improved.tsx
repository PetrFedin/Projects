import { cn } from "@/lib/utils";

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  rows?: number; // For text variant
}

export function Skeleton({ 
  variant = 'rectangular', 
  width, 
  height, 
  className,
  rows = 1
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    card: 'rounded-2xl h-48'
  };

  if (variant === 'text' && rows > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "skeleton",
              variants.text,
              i === rows - 1 && "w-3/4" // Last row is shorter
            )}
            style={{
              width: width,
              height: height || '1rem'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "skeleton",
        variants[variant],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? '1rem' : '100%')
      }}
    />
  );
}

// Card skeleton component
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white p-4 rounded-2xl border border-slate-100", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="40%" className="mb-2" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={120} className="mb-4" />
      <Skeleton variant="text" rows={3} />
    </div>
  );
}

// Table skeleton component
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height={16} className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height={20} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Usage examples:
// <Skeleton variant="text" width="200px" />
// <Skeleton variant="circular" width={40} height={40} />
// <Skeleton variant="card" />
// <CardSkeleton />
// <TableSkeleton rows={5} columns={4} />
