'use client';

import { cn } from '@/lib/utils';
import { resolveSectionNarrative } from '@/lib/runway/runway-i18n';
import type { ProductScrollSwitcherSection } from '@/lib/types';

export interface RunwaySectionNarrativeProps {
  productSlug: string;
  section: ProductScrollSwitcherSection;
  sectionIndex: number;
  prefersReducedMotion?: boolean;
  className?: string;
}

/**
 * Заголовок и однострочное описание активной секции — typography hierarchy для minimal layout.
 */
export function RunwaySectionNarrative({
  productSlug,
  section,
  sectionIndex,
  prefersReducedMotion = false,
  className,
}: RunwaySectionNarrativeProps) {
  const title = resolveSectionNarrative(productSlug, sectionIndex, 'title', section.sectionTitle);
  const description = resolveSectionNarrative(
    productSlug,
    sectionIndex,
    'description',
    section.sectionDescription
  );

  if (!title && !description) return null;

  return (
    <div
      className={cn(
        'space-y-1 px-1',
        !prefersReducedMotion && 'animate-runway-section-enter',
        className
      )}
      data-runway-section-narrative
      aria-live="polite"
    >
      {title ? (
        <h3 className="font-headline text-base font-semibold leading-snug tracking-tight text-foreground md:text-lg">
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
