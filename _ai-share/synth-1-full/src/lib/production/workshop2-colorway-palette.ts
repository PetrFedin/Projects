/**
 * Colorway-строки досье ↔ коды Color Master для BOM и экспорта ТЗ.
 */
import { resolveColorWithStaticFallback } from '@/lib/production/workshop2-color-master';
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';

export type Workshop2ColorwayRow = {
  label: string;
  paletteCode: string;
  hex?: string;
  pantone?: string;
};

function colorLabelsFromAssignment(dossier: Workshop2DossierPhase1, attributeId: string): string[] {
  const assign = dossier.assignments?.find(
    (a) => a.kind === 'canonical' && a.attributeId === attributeId
  );
  if (!assign?.values?.length) return [];
  const out: string[] = [];
  for (const v of assign.values) {
    const label = (v.displayLabel ?? v.text ?? '').trim();
    if (label) out.push(label);
  }
  return out;
}

/** Уникальные подписи цветомоделей из color / primaryColorFamilyOptions. */
export function collectColorwayLabelsFromDossier(dossier: Workshop2DossierPhase1): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const id of ['color', 'primaryColorFamilyOptions'] as const) {
    for (const label of colorLabelsFromAssignment(dossier, id)) {
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      labels.push(label);
    }
  }
  return labels;
}

export function resolveColorwayRow(label: string): Workshop2ColorwayRow {
  const entry = resolveColorWithStaticFallback(label);
  return {
    label,
    paletteCode:
      entry?.code ??
      label
        .slice(0, 3)
        .toUpperCase()
        .replace(/[^A-ZА-ЯЁ0-9]/g, 'X'),
    hex: entry?.hex,
    pantone: entry?.pantone,
  };
}

export function buildColorwayRowsFromDossier(
  dossier: Workshop2DossierPhase1
): Workshop2ColorwayRow[] {
  return collectColorwayLabelsFromDossier(dossier).map(resolveColorwayRow);
}

/** Код палитры для подписи colorway / строки BOM (fallback — усечённый label). */
export function resolvePaletteCodeForColorLabel(label: string): string {
  return resolveColorwayRow(label).paletteCode;
}
