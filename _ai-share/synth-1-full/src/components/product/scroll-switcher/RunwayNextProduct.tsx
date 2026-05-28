'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RunwayAdjacentProducts } from '@/lib/product-scroll-switcher';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayNextProductProps {
  adjacent: RunwayAdjacentProducts;
  className?: string;
}

/** Навигация prev/next между scroll-video SKU одного бренда на PDP. */
export function RunwayNextProduct({ adjacent, className }: RunwayNextProductProps) {
  const router = useRouter();

  if (!adjacent.prev && !adjacent.next) return null;

  const prefetch = (slug: string) => {
    router.prefetch(`/products/${slug}?view=runway`);
  };

  return (
    <div
      className={cn(
        'pointer-events-auto absolute bottom-[5.5rem] right-3 z-20 flex flex-col gap-1.5 md:bottom-auto md:right-4 md:top-24',
        className
      )}
    >
      {adjacent.prev ? (
        <Link
          href={`/products/${adjacent.prev.slug}?view=runway`}
          onMouseEnter={() => prefetch(adjacent.prev!.slug)}
          onFocus={() => prefetch(adjacent.prev!.slug)}
          className="group flex items-center gap-1 rounded-full border border-border bg-background/90 px-2.5 py-1.5 text-[10px] font-medium shadow-sm backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary"
          title={adjacent.prev.name}
        >
          <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="max-w-[120px] truncate">{t('runway.next.prev')}</span>
        </Link>
      ) : null}
      {adjacent.next ? (
        <Link
          href={`/products/${adjacent.next.slug}?view=runway`}
          onMouseEnter={() => prefetch(adjacent.next!.slug)}
          onFocus={() => prefetch(adjacent.next!.slug)}
          className="group flex items-center gap-1 rounded-full border border-border bg-background/90 px-2.5 py-1.5 text-[10px] font-medium shadow-sm backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary"
          title={adjacent.next.name}
        >
          <span className="max-w-[120px] truncate">{t('runway.next.next')}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
