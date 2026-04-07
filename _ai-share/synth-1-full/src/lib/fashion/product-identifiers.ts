import type { Product } from '@/lib/types';
import type { ProductIdentifierField } from './types';

const KEY_LABELS: Record<string, string> = {
  ean: 'EAN-13',
  gtin: 'GTIN',
  upc: 'UPC',
  hsCode: 'HS code',
  hs_code: 'HS code',
  tnved: 'ТН ВЭД',
  customsDescription: 'Таможенное описание',
};

/** Идентификаторы для маркетплейсов, ЧЗ, логистики — из PIM attributes. */
export function extractProductIdentifiers(product: Product): ProductIdentifierField[] {
  const a = product.attributes ?? {};
  const out: ProductIdentifierField[] = [];
  for (const key of Object.keys(KEY_LABELS)) {
    const v = a[key];
    if (v == null || v === '') continue;
    out.push({ key, label: KEY_LABELS[key] ?? key, value: String(v) });
  }
  if (a.barcode != null && String(a.barcode).trim()) {
    out.push({ key: 'barcode', label: 'Штрихкод', value: String(a.barcode) });
  }
  return out;
}
