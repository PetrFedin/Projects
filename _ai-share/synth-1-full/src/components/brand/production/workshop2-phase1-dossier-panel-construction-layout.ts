import type { ResolvedPhase1AttributeRow } from '@/lib/production/attribute-catalog';

/** Драпировка слева, узор справа — подряд в сетке каталога (конструкция). */
export function w2ConstructionRowsDrapeThenPattern(rows: ResolvedPhase1AttributeRow[]): ResolvedPhase1AttributeRow[] {
  const hasD = rows.some((r) => r.attribute.attributeId === 'draperyOptionsByCategory');
  const hasP = rows.some((r) => r.attribute.attributeId === 'patternOptionsByCategory');
  if (!hasD || !hasP) return rows;
  const d = rows.find((r) => r.attribute.attributeId === 'draperyOptionsByCategory')!;
  const p = rows.find((r) => r.attribute.attributeId === 'patternOptionsByCategory')!;
  const out: ResolvedPhase1AttributeRow[] = [];
  for (const r of rows) {
    if (r.attribute.attributeId === 'patternOptionsByCategory') continue;
    if (r.attribute.attributeId === 'draperyOptionsByCategory') {
      out.push(d, p);
      continue;
    }
    out.push(r);
  }
  return out;
}

/** Техпак / лекала / вложения — в правой колонке «Техпак / лекала», не в сетке полей каталога. */
export function w2ConstructionOmitTechPackForAside(rows: ResolvedPhase1AttributeRow[]): ResolvedPhase1AttributeRow[] {
  return rows.filter((r) => r.attribute.attributeId !== 'techPackRef');
}
