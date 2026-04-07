import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** ISO-время последней простановки глобальной подписи ТЗ (любая роль), или null. */
export function getLatestTzGlobalSignoffSetAt(dossier: Workshop2DossierPhase1): string | null {
  let best: string | null = null;
  for (const e of dossier.tzActionLog ?? []) {
    if (e.action.type === 'tz_global_signoff' && e.action.set) {
      if (!best || e.at > best) best = e.at;
    }
  }
  return best;
}

export function dossierUpdatedAfterLatestTzSignoff(dossier: Workshop2DossierPhase1): boolean {
  const last = getLatestTzGlobalSignoffSetAt(dossier);
  const u = dossier.updatedAt?.trim();
  if (!last || !u) return false;
  return u > last;
}
