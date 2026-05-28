'use client';

import type { Workshop2TechPackVisualGateSummary } from '@/lib/production/workshop2-tech-pack-visual-gate-summary';

type Props = {
  summary: Workshop2TechPackVisualGateSummary | null;
};

export function Workshop2TechPackVisualGateBanner({ summary }: Props) {
  if (!summary?.hintRu) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs text-amber-950">
      <p className="font-medium">{summary.hintRu}</p>
      <p className="text-text-muted mt-1">
        Вложений: {summary.attachmentCount} · ZIP-ready: {summary.attachmentsWithZipBytes} ·
        verified S3: {summary.verifiedCanonicalCount} · visual gate: {summary.openVisualGateCount}
      </p>
    </div>
  );
}
