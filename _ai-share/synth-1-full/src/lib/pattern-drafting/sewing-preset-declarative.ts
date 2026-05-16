import { z } from 'zod';
import type { SewingCategoryPreset } from '@/lib/pattern-drafting/sewing-category-preset.types';
import type { SewingPatternGarmentBlock } from '@/lib/pattern-drafting/sewing-pattern.types';

const garmentBlockZ = z.enum([
  'bodice_front',
  'bodice_back',
  'skirt_front',
  'skirt_back',
  'sleeve',
]);

const declarativeRuleV1Z = z.object({
  id: z.string().min(1),
  when: z
    .object({
      l2Contains: z.string().optional(),
      leafContains: z.string().optional(),
    })
    .refine((w) => Boolean(w.l2Contains?.trim() || w.leafContains?.trim()), {
      message: 'when: укажите непустой l2Contains и/или leafContains',
    }),
  patch: z
    .object({
      summary: z.string().optional(),
      primary: garmentBlockZ.optional(),
      alternates: z.array(garmentBlockZ).min(1).optional(),
      ease: z
        .object({
          bust: z.number().optional(),
          waist: z.number().optional(),
          hip: z.number().optional(),
        })
        .optional(),
      darts: z
        .object({
          shoulderDart: z.boolean().optional(),
          bustSideDart: z.boolean().optional(),
          waistDart: z.boolean().optional(),
        })
        .optional(),
      skirtLenCm: z.number().optional(),
      neckDropCm: z.number().optional(),
      forBrandNote: z.string().optional(),
    })
    .default({}),
});

const declarativeFileV1Z = z.object({
  v: z.literal(1),
  rules: z.array(declarativeRuleV1Z),
});

export type SewingPresetDeclarativeRuleV1 = z.infer<typeof declarativeRuleV1Z>;
export type SewingPresetDeclarativeFileV1 = z.infer<typeof declarativeFileV1Z>;

const LS_KEY = 'synth.sewing.presetRules.declarative.v1';

export const SEWING_PRESET_RULES_CHANGED_EVENT = 'synth:sewing-preset-rules-updated';

export function parseSewingPresetDeclarativeJson(raw: string): SewingPresetDeclarativeFileV1 {
  const parsed = JSON.parse(raw) as unknown;
  return declarativeFileV1Z.parse(parsed);
}

export function readDeclarativeRulesFromLocalStorage(): SewingPresetDeclarativeRuleV1[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw?.trim()) return [];
    return parseSewingPresetDeclarativeJson(raw).rules;
  } catch {
    return [];
  }
}

export function writeDeclarativeRulesToLocalStorage(data: SewingPresetDeclarativeFileV1): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(data, null, 2));
  window.dispatchEvent(new CustomEvent(SEWING_PRESET_RULES_CHANGED_EVENT));
}

export function defaultDeclarativeRulesFile(): SewingPresetDeclarativeFileV1 {
  return {
    v: 1,
    rules: [
      {
        id: 'example-maxi-dress',
        when: { l2Contains: 'Плать', leafContains: 'макси' },
        patch: { skirtLenCm: 120, forBrandNote: 'Оверрайд: макси (JSON-редактор).' },
      },
    ],
  };
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

function whenMatches(l2: string, leafName: string, when: SewingPresetDeclarativeRuleV1['when']): boolean {
  const t2 = norm(l2);
  const tl = norm(leafName);
  const k2 = when.l2Contains?.trim() ? norm(when.l2Contains) : '';
  const kf = when.leafContains?.trim() ? norm(when.leafContains) : '';
  if (!k2 && !kf) return false;
  if (k2 && !t2.includes(k2)) return false;
  if (kf && !tl.includes(kf)) return false;
  return true;
}

function mergePatch(base: SewingCategoryPreset, patch: SewingPresetDeclarativeRuleV1['patch']): SewingCategoryPreset {
  const p = patch;
  return {
    ...base,
    ...(p.summary != null ? { summary: p.summary } : {}),
    ...(p.primary != null ? { primary: p.primary as SewingPatternGarmentBlock } : {}),
    ...(p.alternates != null ? { alternates: p.alternates as SewingCategoryPreset['alternates'] } : {}),
    ease: {
      ...base.ease,
      ...(p.ease ?? {}),
    },
    darts: {
      ...base.darts,
      ...(p.darts ?? {}),
    },
    ...(p.skirtLenCm != null ? { skirtLenCm: p.skirtLenCm } : {}),
    ...(p.neckDropCm != null ? { neckDropCm: p.neckDropCm } : {}),
    ...(p.forBrandNote != null ? { forBrandNote: p.forBrandNote } : {}),
  };
}

/**
 * Правила из JSON-редактора (localStorage) накладываются после эвристики и `SEWING_PRESET_USER_RULES`.
 */
export function applyDeclarativePresetPatches(
  l2: string,
  leafName: string,
  preset: SewingCategoryPreset,
  rules: SewingPresetDeclarativeRuleV1[]
): SewingCategoryPreset {
  let out = preset;
  for (const rule of rules) {
    if (whenMatches(l2, leafName, rule.when)) {
      out = mergePatch(out, rule.patch);
    }
  }
  return out;
}
