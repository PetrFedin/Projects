/**
 * Плотность макета ТЗ (full vs dense) — отдельно от ролевого w2view.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2DossierLayoutMode = 'full' | 'dense';

const VALID = new Set<string>(['full', 'dense']);

export const WORKSHOP2_DOSSIER_LAYOUT_PARAM = 'w2layout';
export const W2_DOSSIER_LAYOUT_PREF_LS_KEY = 'w2-dossier-layout-pref-v1';

export function parseWorkshop2DossierLayoutParam(
  raw: string | null | undefined
): Workshop2DossierLayoutMode {
  const s = (raw ?? '').trim().toLowerCase();
  if (s === 'dense') return 'dense';
  return 'full';
}

export function readPersistedWorkshop2DossierLayout(): Workshop2DossierLayoutMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(W2_DOSSIER_LAYOUT_PREF_LS_KEY)?.trim().toLowerCase();
    if (!raw || !VALID.has(raw)) return null;
    return raw as Workshop2DossierLayoutMode;
  } catch {
    return null;
  }
}

export function persistWorkshop2DossierLayoutPreference(mode: Workshop2DossierLayoutMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(W2_DOSSIER_LAYOUT_PREF_LS_KEY, mode);
  } catch {
    /* ignore */
  }
}

export function workshop2DossierLayoutQueryValue(mode: Workshop2DossierLayoutMode): string | null {
  return mode === 'dense' ? 'dense' : null;
}

export function resolveWorkshop2DossierLayoutFromWorkspaceUrl(
  urlParamRaw: string | null | undefined
): Workshop2DossierLayoutMode {
  return resolveWorkshop2DossierLayoutPreference({ urlParam: urlParamRaw });
}

/** Wave 19 #25: приоритет URL → досье PG → localStorage. */
export function resolveWorkshop2DossierLayoutPreference(input: {
  urlParam?: string | null;
  dossier?: Workshop2DossierPhase1 | null;
}): Workshop2DossierLayoutMode {
  if (input.urlParam != null && input.urlParam.trim() !== '') {
    return parseWorkshop2DossierLayoutParam(input.urlParam);
  }
  const fromDossier = input.dossier?.dossierLayoutPreference;
  if (fromDossier === 'dense' || fromDossier === 'full') return fromDossier;
  return readPersistedWorkshop2DossierLayout() ?? 'full';
}

export function persistWorkshop2DossierLayoutToDossier(
  dossier: Workshop2DossierPhase1,
  mode: Workshop2DossierLayoutMode
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    dossierLayoutPreference: mode,
    dossierLayoutPersistedAt: new Date().toISOString(),
  };
}

/** Dense: только dense-nav + основная колонка (без боковых aside). */
export function workshop2DossierLayoutShowsSideAsides(mode: Workshop2DossierLayoutMode): boolean {
  return mode === 'full';
}
