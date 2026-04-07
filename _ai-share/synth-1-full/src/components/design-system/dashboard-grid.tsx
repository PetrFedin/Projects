import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const dashboardGridVariants = cva('grid gap-4', {
  variants: {
    cols: {
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      auto: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    },
    dense: {
      true: 'gap-3',
      false: '',
    },
  },
  defaultVariants: {
    cols: 3,
    dense: false,
  },
});

export type DashboardGridProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dashboardGridVariants>;

export function DashboardGrid({ className, cols, dense, ...props }: DashboardGridProps) {
  return <div className={cn(dashboardGridVariants({ cols, dense }), className)} {...props} />;
}
