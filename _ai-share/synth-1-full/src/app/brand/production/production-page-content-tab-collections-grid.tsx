'use client';

import { ProductionPageContentTabCollectionsGridItem } from '@/app/brand/production/production-page-content-tab-collections-grid-item';
import { cn } from '@/lib/utils';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCollectionsGrid({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { collections, filteredCollections } = px;

  const sorted = [
    ...(filteredCollections ?? collections ?? []).filter((c: any) => c.id !== 'ARCHIVE'),
  ].sort((a: any, b: any) => {
    const ord = px.collectionSortOrder || 'name';
    if (ord === 'name') return (a.name || '').localeCompare(b.name || '');
    if (ord === 'status') return (a.status || '').localeCompare(b.status || '');
    const ra = parseInt(String(a.readiness || '0').replace(/\D/g, ''), 10) || 0;
    const rb = parseInt(String(b.readiness || '0').replace(/\D/g, ''), 10) || 0;
    return ord === 'readiness' ? rb - ra : 0;
  });

  return (
    <div
      className={cn(
        'gap-5',
        (px.collectionViewMode || 'grid') === 'list'
          ? 'flex flex-col'
          : 'grid sm:grid-cols-1 lg:grid-cols-2'
      )}
    >
      {sorted.map((c: any) => (
        <ProductionPageContentTabCollectionsGridItem key={c.id} c={c} p={p} cn={cn} />
      ))}
    </div>
  );
}
