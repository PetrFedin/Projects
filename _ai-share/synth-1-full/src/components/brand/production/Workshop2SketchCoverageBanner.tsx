'use client';

import type { Workshop2SketchCoverageSummary } from '@/lib/production/workshop2-sketch-coverage';

type Props = {
  summary: Workshop2SketchCoverageSummary | null;
};

export function Workshop2SketchCoverageBanner({ summary }: Props) {
  if (!summary?.hintRu) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs text-amber-950">
      <p className="font-medium">{summary.hintRu}</p>
      <p className="text-text-muted mt-1">
        Листов: {summary.sheetCount} (с изображением: {summary.sheetsWithImage}) · меток:{' '}
        {summary.sketchPinTotal} · BOM-ref: {summary.bomRefCount}
        {summary.hasRevisionSnapshot ? ' · ревизия зафиксирована' : ''}
      </p>
    </div>
  );
}
