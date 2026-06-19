/**
 * Сводка панели снабжения: строки bundle vs BOM досье, PO qty.
 */
import type { SupplySnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

export type Workshop2SupplyBundleStatus = {
  lineCount: number;
  linesWithQty: number;
  bomMaterialLineCount: number;
  bomTrimLineCount: number;
  unlinkedLineCount: number;
  plannedPoQty: number;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

function normalizeLabel(s: string): string {
  return s.trim().toLowerCase();
}

export function summarizeWorkshop2SupplyBundleStatus(input: {
  supply?: SupplySnapshot | null;
  dossier?: Workshop2DossierPhase1 | null;
  plannedPoQty?: number;
}): Workshop2SupplyBundleStatus {
  const lines = input.supply?.lines ?? [];
  const lineCount = lines.length;
  const linesWithQty = lines.filter((l) => Number(l.qty) > 0).length;
  const plannedPoQty = Number(input.plannedPoQty ?? 0);

  const model = input.dossier ? ensureWorkshop2ProductionModel(input.dossier) : null;
  const bomMaterialLineCount = model?.materialLines?.length ?? 0;
  const bomTrimLineCount = model?.trimLines?.length ?? 0;
  const bomLabels = new Set(
    [...(model?.materialLines ?? []), ...(model?.trimLines ?? [])].map((l) =>
      normalizeLabel('materialName' in l ? l.materialName : l.name)
    )
  );

  let unlinkedLineCount = 0;
  for (const line of lines) {
    const label = normalizeLabel(line.label);
    if (!label) {
      unlinkedLineCount += 1;
      continue;
    }
    const matched = [...bomLabels].some((b) => b.includes(label) || label.includes(b));
    if (!matched) unlinkedLineCount += 1;
  }

  let state: Workshop2SupplyBundleStatus['state'] = 'empty';
  if (lineCount > 0 && linesWithQty === lineCount && unlinkedLineCount === 0) state = 'ready';
  else if (lineCount > 0) state = 'partial';

  let hintRu: string | undefined;
  if (lineCount === 0) {
    hintRu = 'Строк снабжения нет — синхронизируйте из BOM или добавьте вручную.';
  } else if (linesWithQty < lineCount) {
    hintRu = `${lineCount - linesWithQty} строк без количества — укажите qty перед PO.`;
  } else if (unlinkedLineCount > 0) {
    hintRu = `${unlinkedLineCount} строк не сопоставлены с BOM досье — проверьте названия материалов.`;
  } else if (plannedPoQty <= 0) {
    hintRu = 'Снабжение заполнено — задайте объём в плане заказа (PO) для закупки.';
  }

  return {
    lineCount,
    linesWithQty,
    bomMaterialLineCount,
    bomTrimLineCount,
    unlinkedLineCount,
    plannedPoQty,
    state,
    hintRu,
  };
}
