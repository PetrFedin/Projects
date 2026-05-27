'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { summarizeWorkshop2RuStatusStrip } from '@/lib/production/workshop2-ru-status-strip-summary';
import { isWorkshop2RuMarket } from '@/lib/production/workshop2-market-profile';
import { cn } from '@/lib/utils';

type Props = {
  dossier: Workshop2DossierPhase1 | null;
  collectionId?: string;
  articleId?: string;
  articleUrlSegment?: string;
  className?: string;
};

function StripLink({
  href,
  title,
  children,
  className,
}: {
  href?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!href) {
    return (
      <span className={className} title={title}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={cn('hover:underline focus-visible:underline', className)}
      title={title}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
}

/** Wave 11/13: компактная полоса ₽ · ЭДО · ЧЗ · gates с click targets. */
export function Workshop2RuStatusStrip({
  dossier,
  collectionId,
  articleId,
  articleUrlSegment,
  className,
}: Props) {
  const strip = useMemo(
    () =>
      summarizeWorkshop2RuStatusStrip(dossier, {
        collectionId: collectionId ?? '',
        articleId: articleId ?? '',
        articleUrlSegment,
      }),
    [dossier, collectionId, articleId, articleUrlSegment]
  );

  if (!isWorkshop2RuMarket() || !strip) return null;

  return (
    <div
      className={cn(
        'border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-emerald-50/60 px-2 py-1 text-[10px] text-emerald-950',
        className
      )}
      data-testid="workshop2-ru-status-strip"
      title={strip.hintRu}
    >
      <StripLink
        href={strip.supplyHref}
        title="Снабжение и ₽"
        className="font-semibold tabular-nums"
      >
        {strip.totalRubLabel ?? '₽ —'}
      </StripLink>
      <span aria-hidden>·</span>
      <StripLink href={strip.edoHref} title="ЭДО и задание">
        {strip.edoLabelRu}
      </StripLink>
      <span aria-hidden>·</span>
      <StripLink href={strip.markingHref} title="ТЗ · compliance · маркировка">
        {strip.markingLabelRu}
      </StripLink>
      <span aria-hidden>·</span>
      <span className={strip.gateBlockerCount > 0 ? 'font-semibold text-amber-900' : ''}>
        gates {strip.gateBlockerCount}
      </span>
    </div>
  );
}
