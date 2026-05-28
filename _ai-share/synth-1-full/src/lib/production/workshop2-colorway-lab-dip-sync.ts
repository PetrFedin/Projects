/**
 * Связка colorway ↔ colorLabDipStatuses по paletteCode (wave 17).
 */
import {
  buildColorwayRowsFromDossier,
  type Workshop2ColorwayRow,
} from '@/lib/production/workshop2-colorway-palette';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function resolveColorLabDipKeyForColorway(row: Workshop2ColorwayRow): string {
  return row.paletteCode.trim() || row.label.slice(0, 3).toUpperCase();
}

/** Добавляет pending-статусы для colorway без ключа в colorLabDipStatuses. */
export function syncColorLabDipStatusesFromColorways(dossier: Workshop2DossierPhase1): {
  dossier: Workshop2DossierPhase1;
  addedKeys: string[];
} {
  const rows = buildColorwayRowsFromDossier(dossier);
  const prev = { ...(dossier.colorLabDipStatuses ?? {}) };
  const addedKeys: string[] = [];
  for (const row of rows) {
    const key = resolveColorLabDipKeyForColorway(row);
    if (prev[key] != null) continue;
    prev[key] = 'pending';
    addedKeys.push(key);
  }
  if (addedKeys.length === 0) {
    return { dossier, addedKeys };
  }
  return {
    dossier: {
      ...dossier,
      colorLabDipStatuses: prev,
      colorLabDipSyncedAt: new Date().toISOString(),
    },
    addedKeys,
  };
}

export function countUnmappedColorLabDipKeys(dossier: Workshop2DossierPhase1): number {
  const rows = buildColorwayRowsFromDossier(dossier);
  const statuses = dossier.colorLabDipStatuses ?? {};
  return rows.filter((r) => statuses[resolveColorLabDipKeyForColorway(r)] == null).length;
}
