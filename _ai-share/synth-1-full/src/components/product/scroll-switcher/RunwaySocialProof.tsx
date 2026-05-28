'use client';

import { Eye, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RunwaySocialProofViewModel } from '@/lib/product-scroll-switcher';

interface RunwaySocialProofProps {
  proof: RunwaySocialProofViewModel;
  /** inline — приглушённый текст под ценой (minimal layout). */
  variant?: 'badge' | 'inline';
  className?: string;
}

/** Social proof из реальных analytics — скрыт если proof null. */
export function RunwaySocialProof({ proof, variant = 'badge', className }: RunwaySocialProofProps) {
  if (variant === 'inline') {
    return (
      <p className={cn('text-[11px] text-muted-foreground', className)} data-runway-social-proof>
        {proof.label}
      </p>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        'pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 gap-1 bg-background/90 text-[10px] backdrop-blur-sm',
        className
      )}
    >
      {proof.isPopular ? (
        <Sparkles className="h-3 w-3 text-primary" aria-hidden />
      ) : (
        <Eye className="h-3 w-3 text-muted-foreground" aria-hidden />
      )}
      {proof.label}
    </Badge>
  );
}
