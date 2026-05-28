'use client';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabLossesBodyFilters({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setLossTypeFilter, lossTypeFilter, setLossCategoryFilter, lossCategoryFilter } = px;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <span className="text-text-muted self-center text-[9px] font-bold">Тип:</span>
      {['all', 'material', 'model'].map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setLossTypeFilter?.(f)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
            (lossTypeFilter || 'all') === f
              ? 'bg-rose-100 text-rose-600'
              : 'text-text-secondary hover:bg-bg-surface2'
          )}
        >
          {f === 'all' ? 'Все' : f === 'material' ? 'Материалы' : 'Модели'}
        </button>
      ))}
      <span className="text-text-muted ml-2 self-center text-[9px] font-bold">Категория:</span>
      {['all', 'defect', 'overrun', 'writeoff'].map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setLossCategoryFilter?.(f)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
            (lossCategoryFilter || 'all') === f
              ? 'bg-rose-100 text-rose-600'
              : 'text-text-secondary hover:bg-bg-surface2'
          )}
        >
          {f === 'all'
            ? 'Все'
            : f === 'defect'
              ? 'Брак'
              : f === 'overrun'
                ? 'Перерасход'
                : 'Списание'}
        </button>
      ))}
    </div>
  );
}
