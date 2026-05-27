/**
 * Сводка табеля мер (POM): productionModel.measurements + sampleBasePerSizeDimensions + подпись технолога.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import { workshop2TzSignoffMetaIsCommitted } from '@/lib/production/workshop2-tz-signoff-complete';

export type Workshop2PomTableStatus = {
  measurementRowCount: number;
  perSizeDimensionKeys: number;
  filledPerSizeCells: number;
  totalPerSizeCells: number;
  technologistSigned: boolean;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

function countPerSizeCells(
  dims: Workshop2DossierPhase1['sampleBasePerSizeDimensions'] | undefined
): { filled: number; total: number; keys: number } {
  const rows = dims ?? {};
  const sizeIds = Object.keys(rows);
  let filled = 0;
  let total = 0;
  for (const sizeId of sizeIds) {
    const row = rows[sizeId] ?? {};
    for (const v of Object.values(row)) {
      total += 1;
      if (String(v ?? '').trim()) filled += 1;
    }
  }
  return { filled, total, keys: sizeIds.length };
}

/** Честная сводка POM для баннера на конструкции и handoff warnings. */
export function summarizeWorkshop2PomTableStatus(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2PomTableStatus {
  const model = dossier ? ensureWorkshop2ProductionModel(dossier) : null;
  const measurementRowCount = model?.measurements?.length ?? 0;
  const { filled, total, keys } = countPerSizeCells(dossier?.sampleBasePerSizeDimensions);
  const technologistSigned = workshop2TzSignoffMetaIsCommitted(dossier?.technologistSignoff);

  const hasRows = measurementRowCount > 0;
  const hasPerSize = keys > 0 && filled > 0;

  let state: Workshop2PomTableStatus['state'] = 'empty';
  if (hasRows && hasPerSize) state = 'ready';
  else if (hasRows || hasPerSize) state = 'partial';

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu =
      'Табель пуст — подставьте шаблон POM из справочника или импортируйте мерки из Vault CAD.';
  } else if (state === 'partial') {
    if (!hasRows) {
      hintRu =
        'Заполнены размеры по сетке, но нет строк в productionModel.measurements — примените шаблон POM.';
    } else {
      hintRu = `Строк POM: ${measurementRowCount}, но мало значений по размерам (${filled}/${total || '—'}).`;
    }
  } else if (!technologistSigned) {
    hintRu = 'Табель заполнен — зафиксируйте подпись технолога на конструкции перед handoff.';
  }

  return {
    measurementRowCount,
    perSizeDimensionKeys: keys,
    filledPerSizeCells: filled,
    totalPerSizeCells: total,
    technologistSigned,
    state,
    hintRu,
  };
}
