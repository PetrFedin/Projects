/**
 * Сводка lab dip по colorway досье (без mock-списка).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildColorwayRowsFromDossier } from '@/lib/production/workshop2-colorway-palette';

export type Workshop2LabDipStatusSummary = {
  colorwayCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  unmappedCount: number;
  state: 'empty' | 'partial' | 'ready' | 'blocked';
  hintRu?: string;
};

export function summarizeWorkshop2LabDipStatus(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2LabDipStatusSummary | null {
  if (!dossier) return null;
  const rows = buildColorwayRowsFromDossier(dossier);
  const statuses = dossier.colorLabDipStatuses ?? {};

  if (rows.length === 0) {
    return {
      colorwayCount: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      unmappedCount: 0,
      state: 'empty',
      hintRu: 'Нет colorway в досье — заполните цвет/палитру на паспорте перед lab dip.',
    };
  }

  let pendingCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;
  let unmappedCount = 0;

  for (const row of rows) {
    const st = statuses[row.paletteCode] ?? statuses[row.label];
    if (!st) {
      unmappedCount += 1;
      pendingCount += 1;
      continue;
    }
    if (st === 'approved') approvedCount += 1;
    else if (st === 'rejected') rejectedCount += 1;
    else pendingCount += 1;
  }

  let state: Workshop2LabDipStatusSummary['state'] = 'partial';
  if (rejectedCount > 0) state = 'blocked';
  else if (approvedCount === rows.length) state = 'ready';
  else if (pendingCount === rows.length) state = 'partial';

  let hintRu: string | undefined;
  if (state === 'blocked') {
    hintRu = `${rejectedCount} colorway отклонены — согласуйте новый lab dip до заказа ткани.`;
  } else if (approvedCount < rows.length) {
    hintRu = `Одобрено ${approvedCount}/${rows.length} colorway — остальные в pending.`;
  } else if (unmappedCount > 0) {
    hintRu = `${unmappedCount} colorway без статуса в colorLabDipStatuses — обновите на панели lab dip.`;
  }

  return {
    colorwayCount: rows.length,
    pendingCount,
    approvedCount,
    rejectedCount,
    unmappedCount,
    state,
    hintRu,
  };
}
