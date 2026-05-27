'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { resolveScrollSwitcherSections } from '@/lib/product-scroll-switcher';
import { isProductRunwayAvailable } from '@/lib/runway/runway-brand-gate';
import { useScrollExperienceConfig } from '@/hooks/useScrollExperienceConfig';
import { t } from '@/lib/runway/runway-i18n';

interface RunwaySearchHoverPreviewProps {
  product: Product;
  className?: string;
}

/**
 * Три цветовые точки на hover в сетке поиска — переход на runway PDP.
 * Opt-in: scroll-experience.json → enableSearchHoverPreview.
 */
export function RunwaySearchHoverPreview({ product, className }: RunwaySearchHoverPreviewProps) {
  const config = useScrollExperienceConfig();

  const sections = useMemo(() => {
    if (!config.enableSearchHoverPreview || !isProductRunwayAvailable(product, config)) {
      return [];
    }
    return resolveScrollSwitcherSections(product, config).slice(0, 3);
  }, [config, product]);

  if (sections.length < 2) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto absolute bottom-2 left-2 z-20 flex items-center gap-1.5 rounded-full border border-white/30 bg-black/55 px-2 py-1 backdrop-blur-sm',
        className
      )}
      role="group"
      aria-label={t('runway.aria.hoverPreview')}
    >
      {sections.map((section, index) => (
        <Link
          key={section.id}
          href={`/products/${product.slug}?view=runway&section=${index}`}
          className="group/dot flex flex-col items-center gap-0.5"
          title={section.label}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="h-3.5 w-3.5 rounded-full border border-white/50 shadow-sm transition-transform group-hover/dot:scale-110"
            style={{ backgroundColor: section.color }}
            aria-hidden
          />
          <span className="sr-only">{section.label}</span>
        </Link>
      ))}
      <span className="ml-0.5 text-[9px] font-medium uppercase tracking-wider text-white/90">
        {t('runway.runwayTab')}
      </span>
    </div>
  );
}
