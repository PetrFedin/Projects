/**
 * Lab dip строки из colorway досье (общий модуль для API и UI).
 */
import type { LabDip } from '@/lib/types/material-engineering';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildColorwayRowsFromDossier } from '@/lib/production/workshop2-colorway-palette';

export function buildWorkshop2LabDipsFromDossier(
  dossier: Workshop2DossierPhase1,
  opts?: { materialId?: string; updatedAtIso?: string }
): LabDip[] {
  const rows = buildColorwayRowsFromDossier(dossier);
  const statuses = dossier.colorLabDipStatuses ?? {};
  const submittedAt = opts?.updatedAtIso ?? dossier.updatedAt ?? new Date().toISOString();
  const dips: LabDip[] = rows.map((row, idx) => ({
    id: `ld-${row.paletteCode}-${idx}`,
    materialId: opts?.materialId ?? row.paletteCode,
    type: 'lab-dip' as const,
    status: statuses[row.paletteCode] ?? statuses[row.label] ?? 'pending',
    submittedAt,
    notes: `${row.label} · ${row.paletteCode}`,
  }));
  const materialId = opts?.materialId?.trim();
  if (!materialId) return dips;
  return dips.filter((d) => d.materialId === materialId || d.notes?.includes(materialId));
}
