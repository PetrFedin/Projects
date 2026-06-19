import type { SupplierBomLineInput } from '@/lib/platform-core-supplier-materials-reference';

export type DossierEventPriceInput = {
  eventType: string;
  createdAt: string;
  eventPayload?: Record<string, unknown> | null;
};

export type SupplierMaterialPriceJournalEntry = {
  materialName: string;
  unitCostNet: number;
  currency: string;
  recordedAt: string;
  eventType: string;
  sourceLabelRu: string;
};

function asMaterialLines(raw: unknown): SupplierBomLineInput[] {
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;
  const direct = obj.materialLines;
  if (Array.isArray(direct)) return direct as SupplierBomLineInput[];
  const productionModel = obj.productionModel;
  if (productionModel && typeof productionModel === 'object') {
    const lines = (productionModel as { materialLines?: unknown }).materialLines;
    if (Array.isArray(lines)) return lines as SupplierBomLineInput[];
  }
  const dossier = obj.dossier;
  if (dossier && typeof dossier === 'object') {
    const pm = (dossier as { productionModel?: { materialLines?: unknown } }).productionModel;
    if (pm && Array.isArray(pm.materialLines)) return pm.materialLines as SupplierBomLineInput[];
  }
  return [];
}

/** Ценовые точки из PG dossier_events (честный журнал, без выдуманной истории). */
export function extractSupplierMaterialPriceJournalFromDossierEvents(
  events: readonly DossierEventPriceInput[]
): SupplierMaterialPriceJournalEntry[] {
  const rows: SupplierMaterialPriceJournalEntry[] = [];
  for (const ev of events) {
    const lines = asMaterialLines(ev.eventPayload ?? {});
    for (const line of lines) {
      const name = line.materialName?.trim();
      const cost = line.unitCostNet;
      if (!name || !Number.isFinite(cost) || (cost ?? 0) <= 0) continue;
      rows.push({
        materialName: name,
        unitCostNet: cost!,
        currency: line.currency?.trim() || 'RUB',
        recordedAt: ev.createdAt,
        eventType: ev.eventType,
        sourceLabelRu: 'Журнал dossier_events',
      });
    }
  }
  return rows.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}
