'use client';

import type { TechPackDraftV1 } from './port';

const PREFIX = 'brand_tech_pack_draft_v1__';

export function techPackDraftStorageKey(styleId: string): string {
  return `${PREFIX}${styleId?.trim() || 'new'}`;
}

export function loadTechPackDraft(styleId: string): TechPackDraftV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(techPackDraftStorageKey(styleId));
    if (!raw) return null;
    const p = JSON.parse(raw) as TechPackDraftV1;
    if (!p || p.v !== 1 || !Array.isArray(p.bomData)) return null;
    return p;
  } catch {
    return null;
  }
}

export function saveTechPackDraft(draft: TechPackDraftV1): void {
  if (typeof window === 'undefined') return;
  const payload: TechPackDraftV1 = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(techPackDraftStorageKey(draft.styleId), JSON.stringify(payload));
}
