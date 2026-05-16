import { partitionHandbookAndFree } from '@/lib/production/workshop2-phase1-attribute-partition';
import { normalizeRuColorMatch } from '@/lib/production/workshop2-passport-color-normalize';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Токены для сужения списка палитры по подписи основной группы и референса. */
export function collectColorBundlePaletteNeedles(dossier: Workshop2DossierPhase1): string[] {
  const out: string[] = [];
  const pushTokens = (raw: string) => {
    for (const w of raw.split(/[\s,/·|()[\]#]+/)) {
      const t = normalizeRuColorMatch(w.trim());
      if (t.length >= 3 && !/^pantone$/i.test(t)) out.push(t);
    }
  };
  for (const aid of ['primaryColorFamilyOptions', 'colorReferenceSystemOptions'] as const) {
    const assign = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === aid);
    const { hbs } = partitionHandbookAndFree(assign);
    for (const v of hbs) {
      if (v.displayLabel) pushTokens(v.displayLabel);
    }
  }
  return [...new Set(out)].slice(0, 14);
}
