import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';

export type MatPctRow = { parameterId: string; label: string; pct: number };

export function parseMatRowsFromDossier(
  dossier: Workshop2DossierPhase1,
  paramLabelById: Map<string, string>
): MatPctRow[] {
  const a = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'mat');
  const hbs = a?.values.filter((v) => v.valueSource === 'handbook_parameter') ?? [];
  const fromMat: MatPctRow[] = [];
  for (const v of hbs) {
    if (!v.parameterId) continue;
    const label =
      paramLabelById.get(v.parameterId) ?? v.displayLabel.replace(/\s+\d{1,3}%$/, '').trim();
    const m = v.displayLabel.match(/\s(\d{1,3})%$/);
    const pct = m ? parseInt(m[1]!, 10) : 0;
    fromMat.push({ parameterId: v.parameterId, label, pct });
  }
  if (fromMat.length) return fromMat;
  const ca = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === 'composition'
  );
  const ft = ca?.values.find((x) => x.valueSource === 'free_text');
  const text = ft?.text?.trim();
  if (!text) return [];
  const out: MatPctRow[] = [];
  for (const part of text.split(',')) {
    const seg = part.trim();
    if (!seg) continue;
    const m = seg.match(/^(.+?)\s+(\d{1,3})%$/);
    if (!m) continue;
    const name = m[1]!.trim();
    const pct = parseInt(m[2]!, 10);
    for (const [pid, lab] of paramLabelById) {
      if (lab === name || lab.startsWith(name) || name.startsWith(lab)) {
        out.push({ parameterId: pid, label: lab, pct });
        break;
      }
    }
  }
  return out;
}

/** Сумма долей mat/composition при связанном составе (для подсветки до сохранения). */
export function matCompositionPctState(
  dossier: Workshop2DossierPhase1,
  matAttribute: Pick<AttributeCatalogAttribute, 'parameters'>,
  linkedComposition: boolean
): { sum: number; rowCount: number; invalid: boolean } {
  if (!linkedComposition) {
    return { sum: 0, rowCount: 0, invalid: false };
  }
  const paramLabelById = new Map<string, string>();
  for (const p of matAttribute.parameters) {
    paramLabelById.set(p.parameterId, p.label);
  }
  const rows = parseMatRowsFromDossier(dossier, paramLabelById);
  const sum = rows.reduce((s, r) => s + r.pct, 0);
  return {
    sum,
    rowCount: rows.length,
    invalid: rows.length > 0 && sum !== 100,
  };
}
