import { partitionHandbookAndFree } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import {
  upsertCanonicalDual,
  upsertCanonicalHandbookValues,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { MatPctRow } from '@/lib/production/workshop2-material-mat-rows';

const PRIMARY_FAMILY_TO_PALETTE_KEYWORDS: [RegExp, string[]][] = [
  [/черн|black/i, ['черн', 'black']],
  [/бел|white|молочн|кремов/i, ['бел', 'white', 'молочн', 'кремов']],
  [/син|navy|индиго|ультрамарин/i, ['син', 'navy', 'индиго', 'ультрамарин']],
  [/красн|бордо|burgundy|малин/i, ['красн', 'бордо', 'red', 'малин']],
  [/зел|olive|хаки|khaki/i, ['зел', 'olive', 'хаки']],
  [/розов|fuchsia|фукс/i, ['розов', 'fuchsia']],
  [/сер|grey|gray/i, ['сер', 'grey', 'gray']],
  [/беж|camel|песочн/i, ['беж', 'camel', 'песочн']],
  [/коричн|brown|шоколад/i, ['коричн', 'brown', 'шоколад']],
  [/оранж|terracotta|терракот/i, ['оранж', 'terracotta']],
  [/жёлт|yellow|горчич/i, ['жёлт', 'yellow', 'горчич']],
  [/фиолет|purple|лилов/i, ['фиолет', 'purple', 'лилов']],
  [/золот|gold|серебр|silver|металлик/i, ['золот', 'gold', 'серебр', 'silver', 'металлик']],
];

/** Ё→е: иначе «чёрный» не попадает в /черн/ и не матчится с подписями палитры. */
export function normalizeRuColorMatch(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е');
}

/** Тот же порядок семейств, что у PRIMARY_FAMILY_TO_PALETTE_KEYWORDS — fallback hex для «Свой оттенок». */
const PRIMARY_FAMILY_FALLBACK_HEX: [RegExp, string][] = [
  [/черн|black/i, '#0f172a'],
  [/бел|white|молочн|кремов/i, '#f8fafc'],
  [/син|navy|индиго|ультрамарин/i, '#1e3a8a'],
  [/красн|бордо|burgundy|малин/i, '#7f1d1d'],
  [/зел|olive|хаки|khaki/i, '#14532d'],
  [/розов|fuchsia|фукс/i, '#be185d'],
  [/сер|grey|gray/i, '#475569'],
  [/беж|camel|песочн/i, '#d6c4b0'],
  [/коричн|brown|шоколад/i, '#422006'],
  [/оранж|terracotta|терракот/i, '#c2410c'],
  [/жёлт|yellow|горчич/i, '#ca8a04'],
  [/фиолет|purple|лилов/i, '#5b21b6'],
  [/золот|gold|серебр|silver|металлик/i, '#b45309'],
];

export function suggestPaletteFromPrimaryLabels(
  primaryLabels: string[],
  colorParams: { parameterId: string; label: string }[]
): { parameterId: string; displayLabel: string } | null {
  const blob = normalizeRuColorMatch(primaryLabels.join(' '));
  for (const [re, needles] of PRIMARY_FAMILY_TO_PALETTE_KEYWORDS) {
    if (re.test(blob)) {
      for (const n of needles) {
        const nn = normalizeRuColorMatch(n);
        const hit = colorParams.find((p) => normalizeRuColorMatch(p.label).includes(nn));
        if (hit) return { parameterId: hit.parameterId, displayLabel: hit.label };
      }
    }
  }
  return null;
}

export function suggestHexFromPrimaryLabels(primaryLabels: string[]): string | null {
  const blob = normalizeRuColorMatch(primaryLabels.join(' '));
  for (const [re, hex] of PRIMARY_FAMILY_FALLBACK_HEX) {
    if (re.test(blob)) return hex;
  }
  return null;
}

const PALETTE_TO_PRIMARY: [RegExp, RegExp][] = [
  [/черн|black/i, /черн/i],
  [/бел|white|молочн|кремов|слонов/i, /бел|молочн|крем|слонов/i],
  [/син|navy|индиго|ультрамарин|джинс/i, /син|navy|индиго/i],
  [/красн|red|бордо|burgundy|малин/i, /красн|бордо|малин/i],
  [/зел|olive|хаки|khaki|мят/i, /зел|olive|хаки|мят/i],
  [/розов|fuchsia|фукс|коралл/i, /розов|фукс|коралл/i],
  [/сер|grey|gray|графит/i, /сер|графит|steel/i],
  [/беж|camel|песочн|пудр/i, /беж|camel|песочн|пудр/i],
  [/коричн|brown|шоколад|кофе/i, /коричн|шоколад|кофе/i],
  [/оранж|terracotta|терракот|морков/i, /оранж|терракот/i],
  [/жёлт|yellow|горчич|лимон/i, /жёлт|горчич|лимон/i],
  [/фиолет|purple|лилав|сиренев/i, /фиолет|лилав|сиренев/i],
];

export function suggestPrimaryFamilyFromPaletteLabel(
  paletteLabel: string,
  primaryParams: { parameterId: string; label: string }[]
): { parameterId: string; displayLabel: string } | null {
  const normPal = normalizeRuColorMatch(paletteLabel);
  for (const [palRe, primRe] of PALETTE_TO_PRIMARY) {
    if (palRe.test(normPal)) {
      const hit = primaryParams.find((p) => primRe.test(normalizeRuColorMatch(p.label)));
      if (hit) return { parameterId: hit.parameterId, displayLabel: hit.label };
    }
  }
  return null;
}

export function normalizeCatalogHex(hex: string | undefined): string | undefined {
  if (!hex?.trim()) return undefined;
  const h = hex.trim().replace(/^#/, '').toLowerCase();
  if (h.length !== 6 || !/^[0-9a-f]+$/.test(h)) return undefined;
  return `#${h}`;
}

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

export function split100(n: number): number[] {
  if (n <= 0) return [];
  const base = Math.floor(100 / n);
  const arr = Array.from({ length: n }, () => base);
  let rem = 100 - base * n;
  for (let i = 0; i < rem; i++) arr[i % n] += 1;
  return arr;
}

export function applyMatComposition(
  dossier: Workshop2DossierPhase1,
  rows: MatPctRow[],
  syncComposition: boolean
): Workshop2DossierPhase1 {
  const handbookParts = rows.map((r) => ({
    parameterId: r.parameterId,
    displayLabel: `${r.label} ${r.pct}%`,
  }));
  const compText = rows.map((r) => `${r.label} ${r.pct}%`).join(', ');
  let next = upsertCanonicalHandbookValues(dossier, 'mat', handbookParts);
  if (syncComposition) next = upsertCanonicalDual(next, 'composition', null, compText);
  return next;
}

export function extractHex6(s: string): string | undefined {
  const m = s.match(/#([0-9A-Fa-f]{6})\b/);
  return m ? `#${m[1]!.toLowerCase()}` : undefined;
}

export function extractTwoHexesFromCss(s: string): { a: string; b: string } | null {
  const matches = [...s.matchAll(/#([0-9A-Fa-f]{6})\b/gi)];
  if (matches.length >= 2) {
    return { a: `#${matches[0]![1]!.toLowerCase()}`, b: `#${matches[1]![1]!.toLowerCase()}` };
  }
  if (matches.length === 1) {
    const h = `#${matches[0]![1]!.toLowerCase()}`;
    return { a: h, b: h };
  }
  return null;
}
