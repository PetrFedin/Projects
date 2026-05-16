import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2ProductionPreflightSnapshot,
  type W2ProductionPreflightSnapshot,
} from '@/lib/production/workshop2-production-preflight';

export function Workshop2ProductionDiagnosticsPanel({
  dossier,
  snapshot: snapshotProp,
}: {
  dossier: Workshop2DossierPhase1;
  /** Если передан — не пересчитываем pre-flight (единый источник с родителем). */
  snapshot?: W2ProductionPreflightSnapshot;
}) {
  const snapshot = snapshotProp ?? buildWorkshop2ProductionPreflightSnapshot(dossier);

  return (
    <aside className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Готовность ТЗ</div>
          <div className="text-text-secondary text-xs mt-0.5">Производственный pre-flight</div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold">{snapshot.score}/100</div>
          <div className="text-xs text-text-secondary">
            {snapshot.canSendToFactory ? 'Готово' : 'Есть блокеры'}
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border-subtle bg-bg-surface p-3 text-center">
          <div className="font-bold text-red-600 text-lg leading-none mb-1">{snapshot.blockers.length}</div>
          <div className="text-text-secondary text-xs">Блокеров</div>
        </div>
        <div className="rounded-lg border border-border-subtle bg-bg-surface p-3 text-center">
          <div className="font-bold text-amber-600 text-lg leading-none mb-1">{snapshot.warnings.length}</div>
          <div className="text-text-secondary text-xs">Предупр.</div>
        </div>
      </div>

      {snapshot.issues.length > 0 && (
        <div className="space-y-2">
          {snapshot.issues.slice(0, 6).map((issue) => (
            <div
              key={issue.id}
              className={
                issue.severity === 'blocker'
                  ? 'rounded-md border border-red-200 bg-red-50 p-3 text-xs'
                  : 'rounded-md border border-amber-200 bg-amber-50 p-3 text-xs'
              }
            >
              <div className="font-semibold text-text-primary mb-1">{issue.label}</div>
              <div className="text-text-secondary">{issue.detail}</div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
