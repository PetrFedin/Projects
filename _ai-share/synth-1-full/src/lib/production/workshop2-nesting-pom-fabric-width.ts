/**
 * Wave 41 #63: импорт ширины полотна из POM/досье для nesting (без CAD engine).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';

export type Workshop2NestingFabricWidthSuggestion = {
  fabricWidthCm?: number;
  source: 'pom_measurement' | 'pom_heuristic' | 'dossier_snapshot' | 'none';
  hintRu?: string;
};

const FABRIC_POINT_RE = /полотн|fabric|roll|width|ширин|usable|расклад/i;

function parseNumeric(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v) && v > 0) return v;
  const s = String(v ?? '')
    .replace(',', '.')
    .trim();
  const n = Number.parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Предлагает ширину полотна из POM measurements или эвристики по груди/бёдрам. */
export function suggestWorkshop2NestingFabricWidthFromDossier(
  dossier: Workshop2DossierPhase1
): Workshop2NestingFabricWidthSuggestion {
  if (dossier.nestingRequestSnapshot?.fabricWidthCm != null) {
    return {
      fabricWidthCm: dossier.nestingRequestSnapshot.fabricWidthCm,
      source: 'dossier_snapshot',
      hintRu: 'Ширина уже в nesting snapshot досье.',
    };
  }

  const model = ensureWorkshop2ProductionModel(dossier);
  for (const m of model.measurements ?? []) {
    const name = String(m.label ?? m.code ?? '').trim();
    if (!FABRIC_POINT_RE.test(name)) continue;
    const val = parseNumeric(m.valueCm);
    if (val != null) {
      return {
        fabricWidthCm: val,
        source: 'pom_measurement',
        hintRu: `Из POM «${name}»: ${val} см.`,
      };
    }
  }

  const dims = dossier.sampleBasePerSizeDimensions ?? {};
  const firstSize = Object.values(dims)[0] as Record<string, string> | undefined;
  if (firstSize) {
    for (const [key, raw] of Object.entries(firstSize)) {
      if (!FABRIC_POINT_RE.test(key)) continue;
      const val = parseNumeric(raw);
      if (val != null) {
        return {
          fabricWidthCm: val,
          source: 'pom_measurement',
          hintRu: `Из размерной сетки (${key}): ${val} см.`,
        };
      }
    }
    const chest = parseNumeric(firstSize.chest ?? firstSize['Грудь']);
    const hips = parseNumeric(firstSize.hips ?? firstSize['Бёдра']);
    if (chest != null || hips != null) {
      const heuristic = Math.max(chest ?? 0, hips ?? 0) + 50;
      return {
        fabricWidthCm: Math.round(heuristic),
        source: 'pom_heuristic',
        hintRu: `Эвристика по груди/бёдрам → ~${Math.round(heuristic)} см (не CAD).`,
      };
    }
  }

  return {
    source: 'none',
    hintRu: 'Нет POM-мерки полотна — укажите ширину вручную на раскладке.',
  };
}

export function applyWorkshop2NestingFabricWidthFromPom(input: {
  current: { fabricWidthCm?: number };
  dossier: Workshop2DossierPhase1;
}): {
  fabricWidthCm?: number;
  applied: boolean;
  suggestion: Workshop2NestingFabricWidthSuggestion;
} {
  const suggestion = suggestWorkshop2NestingFabricWidthFromDossier(input.dossier);
  if (input.current.fabricWidthCm != null && input.current.fabricWidthCm > 0) {
    return { fabricWidthCm: input.current.fabricWidthCm, applied: false, suggestion };
  }
  if (suggestion.fabricWidthCm != null) {
    return { fabricWidthCm: suggestion.fabricWidthCm, applied: true, suggestion };
  }
  return { fabricWidthCm: undefined, applied: false, suggestion };
}
