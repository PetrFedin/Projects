import type { Product } from '@/lib/types';
import type { PackRuleRow } from './types';

function num(a: unknown): number | null {
  if (typeof a === 'number' && !Number.isNaN(a)) return a;
  if (typeof a === 'string' && a.trim() && !Number.isNaN(Number(a))) return Number(a);
  return null;
}

/** B2B-правила из PIM: MOQ, короб, срок, Incoterms. */
export function buildPackRuleRow(product: Product): PackRuleRow {
  const a = product.attributes ?? {};
  const moq = num(a.moq) ?? num(a.minOrderQty) ?? num(a.moqUnits);
  const casePack = num(a.casePack) ?? num(a.packSize) ?? num(a.unitsPerCarton);
  const leadWeeks = num(a.leadTimeWeeks) ?? num(a.productionLeadWeeks);
  return {
    sku: product.sku,
    slug: product.slug,
    moq,
    casePack,
    leadWeeks,
    incoterm: typeof a.incoterm === 'string' ? a.incoterm : '',
    shipFrom:
      typeof a.shipFrom === 'string' ? a.shipFrom : typeof a.origin === 'string' ? a.origin : '',
  };
}

export function packRulesToCsv(rows: PackRuleRow[]): string {
  const h = ['sku', 'slug', 'moq', 'case_pack', 'lead_weeks', 'incoterm', 'ship_from'];
  const lines = [h.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.sku,
        r.slug,
        r.moq ?? '',
        r.casePack ?? '',
        r.leadWeeks ?? '',
        `"${r.incoterm.replace(/"/g, '""')}"`,
        `"${r.shipFrom.replace(/"/g, '""')}"`,
      ].join(',')
    );
  }
  return lines.join('\n');
}
