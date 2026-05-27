/** Строки с полем `collection` для фильтра по выбранным / архивным коллекциям (демо production-main). */
export type CollectionKeyedRow = { collection?: string };

/**
 * Без выбранных коллекций — показываем строки не из архива.
 * При выборе — только строки выбранных коллекций.
 */
export function filterRowsByCollectionSelection<T extends CollectionKeyedRow>(
  rows: readonly T[],
  selectedCollectionIds: readonly string[],
  archivedCollectionIds: readonly string[]
): T[] {
  if (selectedCollectionIds.length === 0) {
    return rows.filter((row) => {
      const c = row.collection ?? '';
      return !archivedCollectionIds.includes(c);
    });
  }
  return rows.filter((row) => selectedCollectionIds.includes(row.collection ?? ''));
}

export function computeProductionKpisDemo(activeIds: string[]) {
  const inProduction = activeIds.length * 415;
  const inTransit = activeIds.length * 116;
  const qcCount = activeIds.length + 1;
  const toPay = activeIds.length * 160;
  const riskScore = activeIds.length > 0 ? (Math.random() * 15 + 5).toFixed(1) : '0.0';
  const efficiency = activeIds.length > 0 ? (85 + Math.random() * 10).toFixed(1) : '0.0';

  return {
    production: `${inProduction.toLocaleString()} ед.`,
    cargo: `${inTransit.toLocaleString()} ед.`,
    qc: `${qcCount} артикула`,
    finance: `${toPay}k ₽`,
    risk: `${riskScore}%`,
    efficiency: `${efficiency}%`,
  };
}

function parseProductionLossCost(cost: unknown): number {
  if (typeof cost !== 'string') return 0;
  return parseInt(
    String(cost)
      .replace(/[\s\u00a0₽]/g, '')
      .replace(/,/g, '') || '0',
    10
  );
}

export function buildProductionLossesSummary(
  filteredLosses: readonly { type?: string; cost?: unknown }[]
): { totalCost: number; byType: Record<string, number> } {
  const totalCost = filteredLosses.reduce((sum, l) => sum + parseProductionLossCost(l.cost), 0);
  const byType = filteredLosses.reduce(
    (acc, l) => {
      const k = l.type || 'other';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  return { totalCost, byType };
}

export type CollectionListRow = {
  id: string;
  name?: string;
  status?: string;
  priority?: string;
  responsible?: string;
};

export function filterListedProductionCollections<T extends CollectionListRow>(
  collections: readonly T[],
  archivedCollectionIds: readonly string[],
  collectionFilter: { search?: string; status?: string; priority?: string }
): T[] {
  let list = collections.filter((c) => c.id !== 'ARCHIVE' && !archivedCollectionIds.includes(c.id));
  if (collectionFilter.search) {
    const q = collectionFilter.search.toLowerCase();
    list = list.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.id || '').toLowerCase().includes(q) ||
        (c.responsible || '').toLowerCase().includes(q)
    );
  }
  if (collectionFilter.status) list = list.filter((c) => c.status === collectionFilter.status);
  if (collectionFilter.priority)
    list = list.filter((c) => c.priority === collectionFilter.priority);
  return list;
}

export type AuditLogRow = { id: number; collection?: string; action?: string };

export function filterProductionAuditLog<T extends AuditLogRow>(
  auditLog: readonly T[],
  selectedCollectionIds: readonly string[],
  auditFilter: 'all' | 'bom' | 'sample' | 'po' | 'status'
): T[] {
  let list = auditLog.filter(
    (a) => selectedCollectionIds.length === 0 || selectedCollectionIds.includes(a.collection ?? '')
  );
  if (auditFilter !== 'all') list = list.filter((a) => a.action === auditFilter);
  return [...list].sort((a, b) => b.id - a.id);
}

export function filterSlaSamplesByOverdue<T extends { slaOverdue?: boolean }>(
  samples: readonly T[],
  slaFilterOverdue: boolean
): T[] {
  if (!slaFilterOverdue) return samples as T[];
  return samples.filter((s) => s.slaOverdue);
}

export function countSlaOverdueSamples(samples: readonly { slaOverdue?: boolean }[]): number {
  return samples.filter((s) => s.slaOverdue).length;
}

export function countSamplesPendingReview(samples: readonly { status?: string }[]): number {
  return samples.filter((s) => s.status === 'in_review' || s.status === 'waiting').length;
}

export function computeContextBarBudgetRemainder(
  collectionBudgets: readonly { collectionId?: string; totalPlan: number; totalFact: number }[],
  selectedCollectionIds: readonly string[]
): number {
  const budgets =
    selectedCollectionIds.length === 0
      ? []
      : collectionBudgets.filter((b) => selectedCollectionIds.includes(b.collectionId ?? ''));
  return budgets.reduce((sum, b) => sum + (b.totalPlan - b.totalFact), 0);
}

/** Поиск по нескольким строковым полям без учёта регистра; пустой query — исходный массив. */
export function filterRowsByCaseInsensitiveSubstring<T>(
  rows: readonly T[],
  query: string,
  pickStrings: (row: T) => readonly (string | number | undefined | null)[]
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows as T[];
  return rows.filter((row) =>
    pickStrings(row).some((v) => {
      if (v === undefined || v === null) return false;
      return String(v).toLowerCase().includes(q);
    })
  );
}
