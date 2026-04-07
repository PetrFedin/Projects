/**
 * Zedonk: сводные заказы агента — один драфт с позициями по разным брендам.
 * MOV/MOQ проверяются по каждому бренду отдельно.
 */

import { runPreflightCheck, getOrderRulesForBrand } from '@/lib/b2b/order-rules';
import { getMoqForProduct } from '@/lib/b2b/joor-constants';
import type { PreflightCheckItem } from '@/lib/b2b/order-rules';

export interface ConsolidatedOrderLine {
  id: string;
  brandId: string;
  brandName: string;
  productId: string;
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  /** Сумма строки */
  lineTotal: number;
}

export interface ConsolidatedDraft {
  id: string;
  createdAt: string;
  lines: ConsolidatedOrderLine[];
}

const STORAGE_KEY = 'b2b_agent_consolidated_draft';

function load(): ConsolidatedDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(draft: ConsolidatedDraft | null) {
  if (typeof window === 'undefined') return;
  if (draft) localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  else localStorage.removeItem(STORAGE_KEY);
}

export function getConsolidatedDraft(): ConsolidatedDraft | null {
  return load();
}

/** Итого по брендам: { brandId: { amount, units, cartByProductId } } */
export function getTotalsByBrand(lines: ConsolidatedOrderLine[]): Record<string, { amount: number; units: number; cartByProductId: Record<string, number> }> {
  const byBrand: Record<string, { amount: number; units: number; cartByProductId: Record<string, number> }> = {};
  lines.forEach((line) => {
    const key = line.brandId;
    if (!byBrand[key]) {
      byBrand[key] = { amount: 0, units: 0, cartByProductId: {} };
    }
    byBrand[key].amount += line.lineTotal;
    byBrand[key].units += line.qty;
    byBrand[key].cartByProductId[line.productId] = (byBrand[key].cartByProductId[line.productId] ?? 0) + line.qty;
  });
  return byBrand;
}

/** Pre-flight по каждому бренду: MOV, MOQ, кредит, территория. */
export function runPreflightPerBrand(
  lines: ConsolidatedOrderLine[],
  territory?: string
): Record<string, PreflightCheckItem[]> {
  const byBrand = getTotalsByBrand(lines);
  const result: Record<string, PreflightCheckItem[]> = {};
  Object.entries(byBrand).forEach(([brandId, { amount, units, cartByProductId }]) => {
    const brandName = lines.find((l) => l.brandId === brandId)?.brandName ?? brandId;
    const items = runPreflightCheck({
      orderTotalAmount: amount,
      orderTotalUnits: units,
      brandName,
      territory,
      cartByProductId,
    });
    result[brandId] = items;
  });
  return result;
}

export function saveConsolidatedDraft(draft: ConsolidatedDraft): void {
  save(draft);
}

export function addLineToConsolidatedDraft(line: Omit<ConsolidatedOrderLine, 'id' | 'lineTotal'>): ConsolidatedDraft {
  const draft = load();
  const lineTotal = line.qty * line.unitPrice;
  const newLine: ConsolidatedOrderLine = {
    ...line,
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    lineTotal,
  };
  const lines = draft ? [...draft.lines, newLine] : [newLine];
  const newDraft: ConsolidatedDraft = {
    id: draft?.id ?? `draft-${Date.now()}`,
    createdAt: draft?.createdAt ?? new Date().toISOString(),
    lines,
  };
  save(newDraft);
  return newDraft;
}

export function updateLineQty(lineId: string, qty: number): ConsolidatedDraft | null {
  const draft = load();
  if (!draft) return null;
  const lines = draft.lines.map((l) => {
    if (l.id !== lineId) return l;
    const lineTotal = qty * l.unitPrice;
    return { ...l, qty, lineTotal };
  }).filter((l) => l.qty > 0);
  const newDraft = { ...draft, lines };
  save(newDraft);
  return newDraft;
}

export function removeLineFromConsolidatedDraft(lineId: string): ConsolidatedDraft | null {
  const draft = load();
  if (!draft) return null;
  const lines = draft.lines.filter((l) => l.id !== lineId);
  const newDraft = { ...draft, lines };
  save(newDraft);
  return newDraft;
}

export function clearConsolidatedDraft(): void {
  save(null);
}
