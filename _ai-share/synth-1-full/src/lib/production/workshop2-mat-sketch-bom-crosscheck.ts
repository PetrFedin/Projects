/**
 * Эвристика без API: сравнение linkedBomLineRef на скетче со строками mat из досье.
 * Совпадение — если ref или строка mat содержат друг друга (регистронезависимо).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function resolveMatSketchBomGapRefs(
  _dossier: Workshop2DossierPhase1,
  sketchRefs: string[],
  matLines: string[]
): string[] {
  return sketchBomRefsMissingFromMatLines(sketchRefs, matLines);
}

export function sketchBomRefsMissingFromMatLines(
  sketchRefs: string[],
  matLines: string[]
): string[] {
  const refs = sketchRefs.map((r) => r.trim()).filter(Boolean);
  if (refs.length === 0) return [];
  const hay = matLines.map((m) => m.trim()).filter(Boolean);
  if (hay.length === 0) return refs;
  const hayLc = hay.map((m) => m.toLowerCase());
  return refs.filter((ref) => {
    const r = ref.toLowerCase();
    return !hayLc.some((line) => line.includes(r) || r.includes(line));
  });
}
