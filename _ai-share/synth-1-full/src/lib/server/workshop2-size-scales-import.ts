import 'server-only';
import {
  PRODUCTION_PARAMS_BY_CATEGORY,
  getProductionParamsByCategory,
} from '@/lib/data/production-params';

export type Workshop2SizeScaleCsvRow = {
  line: number;
  catL1Id: string;
  scaleId: string;
  label?: string;
  sizes?: string[];
};

export type Workshop2SizeScaleImportRowResult =
  | { ok: true; row: Workshop2SizeScaleCsvRow; matchedLabel: string; sizeCount: number }
  | { ok: false; row: Workshop2SizeScaleCsvRow; reason: string };

export type Workshop2SizeScaleImportReport = {
  totalLines: number;
  valid: number;
  invalid: number;
  knownCatL1Ids: string[];
  results: Workshop2SizeScaleImportRowResult[];
};

/** Парсинг CSV: catL1Id,scaleId[,label][,sizes pipe-separated]. Первая строка-заголовок — опционально. */
export function parseWorkshop2SizeScaleCsv(text: string): Workshop2SizeScaleCsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return [];

  const first = lines[0]!.toLowerCase();
  const startIdx =
    first.includes('catl1') || (first.includes('cat') && first.includes('scale')) ? 1 : 0;

  const out: Workshop2SizeScaleCsvRow[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i]!.split(/[,;]/).map((p) => p.trim());
    if (parts.length < 2) continue;
    const [catL1Id, scaleId, label, sizesRaw] = parts;
    if (!catL1Id || !scaleId) continue;
    const sizes =
      sizesRaw && sizesRaw.length > 0
        ? sizesRaw
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;
    out.push({
      line: i + 1,
      catL1Id,
      scaleId,
      ...(label ? { label } : {}),
      ...(sizes?.length ? { sizes } : {}),
    });
  }
  return out;
}

/** Валидация строк против ключей `production-params` (catL1Id + scale id). */
export function validateWorkshop2SizeScaleRows(
  rows: Workshop2SizeScaleCsvRow[]
): Workshop2SizeScaleImportReport {
  const knownCatL1Ids = PRODUCTION_PARAMS_BY_CATEGORY.map((p) => p.catL1Id);
  const results: Workshop2SizeScaleImportRowResult[] = [];

  for (const row of rows) {
    const params = getProductionParamsByCategory(row.catL1Id);
    if (!params) {
      results.push({
        ok: false,
        row,
        reason: `Неизвестный catL1Id «${row.catL1Id}». Допустимо: ${knownCatL1Ids.slice(0, 5).join(', ')}…`,
      });
      continue;
    }
    const scale = params.sizeScales.find((s) => s.id === row.scaleId);
    if (!scale) {
      const ids = params.sizeScales.map((s) => s.id).join(', ');
      results.push({
        ok: false,
        row,
        reason: `Шкала «${row.scaleId}» не найдена для ${row.catL1Id}. Допустимо: ${ids}`,
      });
      continue;
    }
    if (row.sizes?.length) {
      const unknown = row.sizes.filter((sz) => !scale.sizes.includes(sz));
      if (unknown.length) {
        results.push({
          ok: false,
          row,
          reason: `Размеры не в шкале: ${unknown.join(', ')}`,
        });
        continue;
      }
    }
    results.push({
      ok: true,
      row,
      matchedLabel: row.label?.trim() || scale.label,
      sizeCount: row.sizes?.length ?? scale.sizes.length,
    });
  }

  const valid = results.filter((r) => r.ok).length;
  return {
    totalLines: rows.length,
    valid,
    invalid: results.length - valid,
    knownCatL1Ids,
    results,
  };
}

export function validateWorkshop2SizeScaleCsv(text: string): Workshop2SizeScaleImportReport {
  const rows = parseWorkshop2SizeScaleCsv(text);
  if (!rows.length) {
    return {
      totalLines: 0,
      valid: 0,
      invalid: 0,
      knownCatL1Ids: PRODUCTION_PARAMS_BY_CATEGORY.map((p) => p.catL1Id),
      results: [],
    };
  }
  return validateWorkshop2SizeScaleRows(rows);
}

/** Ключ строки в PG: catL1Id + scaleId (уникальная пара). */
export function workshop2SizeScalePgKey(catL1Id: string, scaleId: string): string {
  return `${catL1Id.trim()}::${scaleId.trim()}`;
}

export type Workshop2SizeScalePgRow = {
  scaleKey: string;
  label: string;
  rows: string[];
  catL1: string;
  audience?: string;
};

/** Строки, прошедшие валидацию, в формат upsert для workshop2_size_scales. */
export function buildWorkshop2SizeScalePgRowsFromReport(
  report: Workshop2SizeScaleImportReport
): Workshop2SizeScalePgRow[] {
  const out: Workshop2SizeScalePgRow[] = [];
  for (const r of report.results) {
    if (!r.ok) continue;
    const { catL1Id, scaleId, label, sizes } = r.row;
    const params = getProductionParamsByCategory(catL1Id);
    const scale = params?.sizeScales.find((s) => s.id === scaleId);
    const sizeList = sizes?.length && sizes.length > 0 ? sizes : (scale?.sizes ?? []);
    out.push({
      scaleKey: workshop2SizeScalePgKey(catL1Id, scaleId),
      label: r.matchedLabel,
      rows: sizeList,
      catL1: catL1Id,
    });
  }
  return out;
}
