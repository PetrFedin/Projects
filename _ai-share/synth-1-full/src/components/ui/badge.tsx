import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-1.5 py-0 h-4 text-[9px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-text-primary text-white hover:bg-text-primary/90 shadow-sm',
        secondary:
          'border-transparent bg-bg-surface2 text-text-primary hover:bg-bg-surface2 shadow-sm',
        destructive: 'border-transparent bg-rose-500 text-white hover:bg-rose-600 shadow-sm',
        outline: 'text-text-secondary border-border-default bg-white shadow-sm',
        success: 'border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm',
        warning: 'border-amber-100 bg-amber-50 text-amber-600 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
