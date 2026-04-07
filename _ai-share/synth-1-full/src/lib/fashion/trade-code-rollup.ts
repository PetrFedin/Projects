import type { Product } from '@/lib/types';
import type { TradeCodeRow } from './types';

function strAttr(a: Record<string, unknown> | undefined, keys: string[]): string {
  if (!a) return '';
  for (const k of keys) {
    const v = a[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  }
  return '';
}

function completeness(hs: string, eac: string): TradeCodeRow['completeness'] {
  if (hs && eac) return 'full';
  if (hs || eac) return 'partial';
  return 'empty';
}

/** ТН ВЭД / маркировка / происхождение из PIM для compliance и выгрузок. */
export function buildTradeCodeRows(products: Product[]): TradeCodeRow[] {
  return products.map((p) => {
    const a = (p.attributes ?? {}) as Record<string, unknown>;
    const hsCode = strAttr(a, ['hsCode', 'hs', 'customsTariffCode', 'tnved', 'ТНВЭД']);
    const eacMark = strAttr(a, ['eac', 'eacMark', 'eacCertificate', 'ЕАС']);
    const origin = strAttr(a, ['countryOfOrigin', 'originCountry', 'madeIn', 'country']);
    return {
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      hsCode,
      eacMark,
      origin,
      completeness: completeness(hsCode, eacMark),
    };
  });
}

export function tradeCodeRowsToCsv(rows: TradeCodeRow[]): string {
  const h = ['sku', 'slug', 'name', 'hs_code', 'eac', 'origin', 'completeness'];
  const lines = [h.join(',')];
  for (const r of rows) {
    const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
    lines.push(
      [
        esc(r.sku),
        esc(r.slug),
        esc(r.name),
        esc(r.hsCode),
        esc(r.eacMark),
        esc(r.origin),
        r.completeness,
      ].join(','),
    );
  }
  return lines.join('\n');
}
