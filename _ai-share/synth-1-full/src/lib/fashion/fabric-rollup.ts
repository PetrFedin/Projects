import type { Product } from '@/lib/types';
import { compositionToPlainText, parseComposition } from './parse-composition';
import { resolveCareSymbolIds } from './care-symbols';
import type { FabricRollupRow } from './types';

export function buildFabricRollupRows(products: Product[]): FabricRollupRow[] {
  return products.map((p) => ({
    sku: p.sku,
    name: p.name.replace(/"/g, '""'),
    color: p.color,
    season: p.season,
    compositionText: compositionToPlainText(parseComposition(p)).replace(/"/g, '""'),
    careIds: resolveCareSymbolIds(p).join('|'),
  }));
}

export function fabricRollupToCsv(rows: FabricRollupRow[]): string {
  const header = ['sku', 'name', 'color', 'season', 'composition', 'care_symbol_ids'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.sku,
        `"${r.name}"`,
        `"${r.color}"`,
        `"${r.season}"`,
        `"${r.compositionText}"`,
        `"${r.careIds}"`,
      ].join(',')
    );
  }
  return lines.join('\n');
}
