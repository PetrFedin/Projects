'use client';

import { ProductionPageContentShellHeaderActions } from '@/app/brand/production/production-page-content-shell-header-actions';
import { ProductionPageContentShellHeaderTitle } from '@/app/brand/production/production-page-content-shell-header-title';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentShellHeader({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
      <ProductionPageContentShellHeaderTitle p={p} />
      <ProductionPageContentShellHeaderActions p={p} cn={cn} />
    </header>
  );
}
