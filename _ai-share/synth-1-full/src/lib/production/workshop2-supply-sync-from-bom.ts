/**
 * Синхронизация строк снабжения (bundle.supply) из BOM досье.
 */
import type { SupplySnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

function uid(): string {
  return `sup-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export type Workshop2SupplySyncFromBomResult = {
  supply: SupplySnapshot;
  addedCount: number;
  updatedCount: number;
  supplyBomSyncAt: string;
};

/** Добавляет строки из materialLines/trimLines; существующие по label не дублирует. */
export function syncWorkshop2SupplyLinesFromDossierBom(input: {
  dossier: Workshop2DossierPhase1;
  supply?: SupplySnapshot | null;
}): Workshop2SupplySyncFromBomResult {
  const model = ensureWorkshop2ProductionModel(input.dossier);
  const existing = [...(input.supply?.lines ?? [])];
  const labels = new Set(existing.map((l) => l.label.trim().toLowerCase()).filter(Boolean));

  let addedCount = 0;
  let updatedCount = 0;

  const pushLine = (label: string, qty?: number, unit?: string, sourceNote?: string) => {
    const key = label.trim().toLowerCase();
    if (!key) return;
    if (labels.has(key)) {
      const idx = existing.findIndex((l) => l.label.trim().toLowerCase() === key);
      if (idx >= 0 && qty != null && existing[idx]!.qty !== qty) {
        existing[idx] = { ...existing[idx]!, qty, unit: unit ?? existing[idx]!.unit };
        updatedCount += 1;
      }
      return;
    }
    labels.add(key);
    existing.push({
      id: uid(),
      label: label.trim(),
      qty,
      unit,
      status: 'draft',
      sourceNote,
    });
    addedCount += 1;
  };

  for (const m of model.materialLines ?? []) {
    pushLine(
      m.materialName || 'Материал',
      m.yieldPerUnit,
      m.yieldUnit || 'ед.',
      [m.supplier, m.article].filter(Boolean).join(' ').trim() || undefined
    );
  }
  for (const t of model.trimLines ?? []) {
    pushLine(
      t.name || 'Фурнитура',
      t.quantity,
      'шт',
      [t.supplier, t.article].filter(Boolean).join(' ').trim() || undefined
    );
  }

  const supplyBomSyncAt = new Date().toISOString();
  return {
    supply: {
      ...(input.supply ?? { lines: [] }),
      lines: existing,
    },
    addedCount,
    updatedCount,
    supplyBomSyncAt,
  };
}
