'use client';

import { Card } from '@/components/ui/card';

export function ProductionPageContentTabPlmSampleStrip({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    selectedSkuId,
    displaySampleStatuses,
    filteredSampleStatuses,
    setActiveTab,
    STAGE_LABELS = {},
  } = px;

  if (!selectedSkuId) return null;

  const samples = (displaySampleStatuses || filteredSampleStatuses || []).filter(
    (s: any) => s.skuId === selectedSkuId
  );
  const hasSamples = samples.length > 0;

  return (
    <Card className="border-border-subtle rounded-xl border p-3 shadow-sm">
      <p className="text-text-secondary mb-2 text-[9px] font-black uppercase">Артикул → Сэмплы</p>
      <div className="flex flex-wrap gap-2">
        {samples.map((s: any, idx: number) => (
          <button
            key={`${s.skuId}-${s.stage ?? idx}`}
            type="button"
            onClick={() => setActiveTab?.('samples')}
            className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 hover:bg-accent-primary/15 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-colors"
          >
            {STAGE_LABELS[s.stage] || s.stageLabel} ·{' '}
            {s.status === 'approved' ? 'Утверждён' : 'На проверке'}
          </button>
        ))}
        {!hasSamples && (
          <span className="text-text-muted text-[10px]">
            Нет сэмплов. Перейти в{' '}
            <button
              type="button"
              onClick={() => setActiveTab?.('samples')}
              className="text-accent-primary font-bold underline"
            >
              Сэмплы
            </button>
          </span>
        )}
      </div>
    </Card>
  );
}
