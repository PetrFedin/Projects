'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'product' | 'stream' | 'brand' | 'program';
  className?: string;
}

export function SkeletonCard({ variant = 'product', className }: SkeletonCardProps) {
  if (variant === 'product') {
    return (
      <Card className={cn("overflow-hidden group", className)}>
        <div className="relative aspect-[3/4] bg-muted">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'stream') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative aspect-[21/10] bg-muted">
          <Skeleton className="absolute inset-0" />
          <div className="absolute top-3 right-3">
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'brand') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative aspect-square bg-muted">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </Card>
    );
  }

  if (variant === 'program') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative aspect-[21/10] bg-muted">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

export function SkeletonGrid({ 
  count = 6, 
  variant = 'product',
  className 
}: { 
  count?: number; 
  variant?: SkeletonCardProps['variant'];
  className?: string;
}) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}
