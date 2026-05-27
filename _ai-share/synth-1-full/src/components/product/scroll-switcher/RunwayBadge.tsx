'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Product, ScrollExperienceConfig } from '@/lib/types';
import { isProductRunwayAvailable } from '@/lib/runway/runway-brand-gate';

interface RunwayBadgeProps {
  product: Product;
  /** Ссылка на PDP runway; если false — только бейдж без ссылки. */
  asLink?: boolean;
  className?: string;
  /** Brand gate config (optional — skips gate when omitted). */
  scrollConfig?: Pick<ScrollExperienceConfig, 'brandRunwayEnabled'>;
  /** Shimmer-анимация (false в minimal config). */
  shimmer?: boolean;
}

/** Бейдж Runway — тот же Badge, что sale/new на карточках каталога. */
export function RunwayBadge({
  product,
  asLink = true,
  className,
  scrollConfig,
  shimmer = true,
}: RunwayBadgeProps) {
  if (!isProductRunwayAvailable(product, scrollConfig)) return null;

  const inner = (
    <Badge
      variant="secondary"
      className={cn(
        'relative gap-0.5 overflow-hidden border-border/60 bg-background/90 px-1.5 py-0 text-[8px] uppercase tracking-wider backdrop-blur-sm',
        shimmer && 'animate-runway-badge-shimmer',
        className
      )}
    >
      {shimmer ? (
        <span
          className="animate-runway-badge-shimmer-sweep pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/25 to-transparent"
          aria-hidden
        />
      ) : null}
      <Sparkles className="relative h-2 w-2" aria-hidden />
      <span className="relative">Runway</span>
    </Badge>
  );

  if (!asLink) return inner;

  return (
    <Link
      href={`/products/${product.slug}?view=runway`}
      className="pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Runway: ${product.name}`}
    >
      {inner}
    </Link>
  );
}
