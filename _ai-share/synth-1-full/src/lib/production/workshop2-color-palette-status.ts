/**
 * Colorway / палитра из досье (без PIM push).
 */
import {
  buildColorwayRowsFromDossier,
  collectColorwayLabelsFromDossier,
} from '@/lib/production/workshop2-colorway-palette';
import { resolveColorLabDipKeyForColorway } from '@/lib/production/workshop2-colorway-lab-dip-sync';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2ColorPaletteStatus = {
  colorwayCount: number;
  unmappedCount: number;
  labDipTrackedCount: number;
  labDipApprovedCount: number;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2ColorPaletteStatus(
  dossier: Workshop2DossierPhase1
): Workshop2ColorPaletteStatus {
  const labels = collectColorwayLabelsFromDossier(dossier);
  const rows = buildColorwayRowsFromDossier(dossier);
  const colorwayCount = labels.length;
  const unmappedCount = rows.filter((r) => !r.hex && !r.pantone).length;

  const statuses = dossier.colorLabDipStatuses ?? {};
  let labDipTrackedCount = 0;
  let labDipApprovedCount = 0;
  for (const row of rows) {
    const key = resolveColorLabDipKeyForColorway(row);
    const st = statuses[key];
    if (st) {
      labDipTrackedCount += 1;
      if (st === 'approved') labDipApprovedCount += 1;
    }
  }

  let state: Workshop2ColorPaletteStatus['state'] = 'empty';
  if (colorwayCount > 0) {
    state = unmappedCount === 0 && labDipApprovedCount === colorwayCount ? 'ready' : 'partial';
  }

  let hintRu: string | undefined;
  if (colorwayCount === 0) {
    hintRu = 'Палитра пуста — добавьте colorway в паспорте (атрибут color).';
  } else if (unmappedCount > 0) {
    hintRu = `${unmappedCount} цвет(ов) без Pantone/hex в Color Master — уточните коды перед lab dip.`;
  } else if (labDipTrackedCount < colorwayCount) {
    hintRu = `Lab dip: ${labDipTrackedCount}/${colorwayCount} colorway со статусом — заполните в снабжении.`;
  } else if (labDipApprovedCount < colorwayCount) {
    hintRu = `Одобрено lab dip: ${labDipApprovedCount}/${colorwayCount} — согласуйте цвета перед образцом.`;
  }

  return {
    colorwayCount,
    unmappedCount,
    labDipTrackedCount,
    labDipApprovedCount,
    state,
    hintRu,
  };
}
