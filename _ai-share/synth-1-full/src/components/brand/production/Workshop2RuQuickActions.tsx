'use client';

import Link from 'next/link';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2DossierLinkedPaths } from '@/lib/production/workshop2-dossier-linked-paths';
import { isWorkshop2RuMarket } from '@/lib/production/workshop2-market-profile';

type Props = {
  collectionId: string;
  articleId: string;
  articleUrlSegment?: string;
  dossier?: Workshop2DossierPhase1 | null;
  className?: string;
};

/** Wave 19: компактные deep links из linkedPaths (без доп. API). */
export function Workshop2RuQuickActions({
  collectionId,
  articleId,
  articleUrlSegment,
  dossier,
  className,
}: Props) {
  if (!isWorkshop2RuMarket()) return null;

  const paths = buildWorkshop2DossierLinkedPaths({
    collectionId,
    articleId,
    articleUrlSegment,
    dossier,
  });

  const items = [
    { label: 'Пакет РФ', href: paths.ruCompliancePack, testId: 'workshop2-ru-quick-compliance' },
    { label: 'Календарь', href: paths.calendar, testId: 'workshop2-ru-quick-calendar' },
    { label: 'Пол', href: paths.floor, testId: 'workshop2-ru-quick-floor' },
  ] as const;

  return (
    <nav
      className={className ?? 'flex flex-wrap items-center gap-1'}
      aria-label="Быстрые действия РФ"
      data-testid="workshop2-ru-quick-actions"
    >
      {items.map((item) => (
        <Link
          key={item.testId}
          href={item.href}
          className="text-accent-primary border-border-subtle/80 bg-bg-surface2/80 rounded-md border px-2 py-0.5 text-[10px] font-semibold hover:underline"
          data-testid={item.testId}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
