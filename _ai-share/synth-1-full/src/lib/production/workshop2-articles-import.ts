/**
 * Парсинг CSV и сборка строк импорта артикулов Workshop2.
 */
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  assembleWorkshop2ArticleFromTaxonomy,
  type Workshop2ArticleAssemblyResult,
} from '@/lib/production/workshop2-article-assembler';

export const WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS = 50;

export type Workshop2ArticleImportInputRow = {
  sku: string;
  name?: string;
  audience?: string;
  audienceId?: string;
  leafId: string;
};

export type Workshop2ArticleImportRowResult =
  | {
      ok: true;
      rowIndex: number;
      sku: string;
      name?: string;
      audienceId: string;
      leafId: string;
      assembly: Workshop2ArticleAssemblyResult;
    }
  | {
      ok: false;
      rowIndex: number;
      sku: string;
      error: string;
    };

const AUDIENCE_ALIASES: Record<string, string> = {
  women: 'women',
  men: 'men',
  kids: 'kids',
  unisex: 'women',
  женщины: 'women',
  мужчины: 'men',
  дети: 'kids',
  унисекс: 'women',
  w: 'women',
  m: 'men',
  k: 'kids',
};

export function normalizeWorkshop2ImportAudienceId(raw: string | undefined): string {
  const q = (raw ?? 'women').trim().toLowerCase();
  return AUDIENCE_ALIASES[q] ?? 'women';
}

/** CSV: sku,name,audience,leafId (заголовок опционален). */
export function parseWorkshop2ArticlesImportCsv(text: string): Workshop2ArticleImportInputRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return [];
  const first = lines[0]!.toLowerCase();
  const startIdx =
    first.includes('sku') && (first.includes('leaf') || first.includes('leafid')) ? 1 : 0;
  const out: Workshop2ArticleImportInputRow[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i]!.split(/[,;]/).map((p) => p.trim());
    if (parts.length < 2) continue;
    const [sku, name, audience, leafId] = parts;
    if (!sku?.trim()) continue;
    const lid = (leafId ?? parts[parts.length - 1] ?? '').trim();
    if (!lid) continue;
    out.push({
      sku: sku.trim(),
      ...(name?.trim() ? { name: name.trim() } : {}),
      ...(audience?.trim() ? { audience: audience.trim() } : {}),
      leafId: lid,
    });
  }
  return out;
}

export function assembleWorkshop2ArticleImportRows(
  rows: Workshop2ArticleImportInputRow[],
  opts?: { updatedBy?: string }
): Workshop2ArticleImportRowResult[] {
  const limited = rows.slice(0, WORKSHOP2_ARTICLES_IMPORT_MAX_ROWS);
  return limited.map((row, rowIndex) => {
    const sku = row.sku.trim();
    const leafId = row.leafId.trim();
    if (!sku) {
      return { ok: false, rowIndex, sku: '', error: 'Пустой SKU' };
    }
    if (!findHandbookLeafById(leafId)) {
      return { ok: false, rowIndex, sku, error: `Неизвестный leafId: ${leafId}` };
    }
    const audienceId = normalizeWorkshop2ImportAudienceId(row.audienceId ?? row.audience);
    try {
      const assembly = assembleWorkshop2ArticleFromTaxonomy({
        categoryLeafId: leafId,
        audienceId,
        sku,
        ...(row.name?.trim() ? { name: row.name.trim() } : {}),
        updatedBy: opts?.updatedBy,
      });
      if (!assembly) {
        return { ok: false, rowIndex, sku, error: 'Сборка вернула пустой результат' };
      }
      return {
        ok: true,
        rowIndex,
        sku,
        ...(row.name?.trim() ? { name: row.name.trim() } : {}),
        audienceId,
        leafId,
        assembly,
      };
    } catch {
      return { ok: false, rowIndex, sku, error: 'Ошибка сборки артикула' };
    }
  });
}
