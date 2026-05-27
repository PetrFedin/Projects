'use client';

import { Workshop2ProductionDiagnosticsPanel } from '@/components/brand/production/Workshop2ProductionDiagnosticsPanel';
import { cn } from '@/lib/utils';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getW2ProductionPreflightScoreBand,
  type W2ProductionPreflightSnapshot,
} from '@/lib/production/workshop2-production-preflight';

export function Workshop2ConstructionPreflightDetails({
  dossier,
  snapshot,
}: {
  dossier: Workshop2DossierPhase1;
  snapshot: W2ProductionPreflightSnapshot;
}) {
  const band = getW2ProductionPreflightScoreBand(snapshot.score);
  return (
    <details className="group space-y-2">
      <summary className="border-border-default text-text-primary hover:bg-bg-surface2/40 flex cursor-pointer list-none items-start justify-between gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-sm font-semibold leading-tight">Pre-flight производства</div>
          <div className="text-text-secondary text-[11px] font-normal leading-snug">
            {snapshot.score}/100
            <span className={cn('font-semibold', band.tone)}> · {band.label}</span>
            {' · '}
            блокеров {snapshot.blockers.length}, предупр. {snapshot.warnings.length}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
          <span className="text-text-muted text-[11px] font-normal group-open:hidden">
            Показать детали
          </span>
          <span className="text-text-muted hidden text-[11px] font-normal group-open:inline">
            Скрыть
          </span>
        </div>
      </summary>
      <Workshop2ProductionDiagnosticsPanel dossier={dossier} snapshot={snapshot} />
    </details>
  );
}
