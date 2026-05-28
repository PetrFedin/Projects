'use client';

import {
  getW2ProductionPreflightScoreBand,
  type W2ProductionPreflightSnapshot,
} from '@/lib/production/workshop2-production-preflight';

export function Workshop2DossierProductionPreflightStrip({
  snapshot,
}: {
  snapshot: W2ProductionPreflightSnapshot;
}) {
  const band = getW2ProductionPreflightScoreBand(snapshot.score);
  return (
    <div className="border-border-default bg-bg-surface2/70 rounded-lg border px-3 py-2 text-[11px]">
      <div className="text-text-primary font-semibold">
        Готовность производства: {snapshot.score}/100 ·{' '}
        <span className={band.tone}>{band.label}</span>
      </div>
      <div className="text-text-secondary">
        Блокеры: {snapshot.blockers.length} · предупреждения: {snapshot.warnings.length}
      </div>
    </div>
  );
}
