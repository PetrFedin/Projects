'use client';

import { Input } from '@/components/ui/input';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

const STAGE_FILTERS = [
  'all',
  'Proto1',
  'Proto2',
  'PP',
  'SizeSet',
  'in_review',
  'approved',
] as const;

export function ProductionPageContentTabSamplesBodyFilters({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { sampleSearchQuery, setSampleSearchQuery, sampleStageFilter, setSampleStageFilter } =
    px;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <Input
        placeholder="Поиск по артикулу или названию..."
        value={sampleSearchQuery || ''}
        onChange={(e) => setSampleSearchQuery?.(e.target.value)}
        className="h-8 max-w-xs text-[10px]"
      />
      {STAGE_FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setSampleStageFilter?.(f)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
            (sampleStageFilter || 'all') === f
              ? 'bg-accent-primary/15 text-accent-primary'
              : 'text-text-secondary hover:bg-bg-surface2'
          )}
        >
          {f === 'all'
            ? 'Все'
            : f === 'in_review'
              ? 'На проверке'
              : f === 'approved'
                ? 'Утверждены'
                : f}
        </button>
      ))}
    </div>
  );
}
