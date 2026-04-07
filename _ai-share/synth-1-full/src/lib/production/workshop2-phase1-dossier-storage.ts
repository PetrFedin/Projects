/**
 * Досье фазы 1 в localStorage: один объект на пару (collectionId, articleId).
 * Ключ хранилища фиксирован; внутри — map storageKey → Workshop2DossierPhase1.
 */
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';

const STORAGE_KEY = 'synth.brand.workshop2Phase1Dossier.v1';

export type Workshop2Phase1DossierMap = Record<string, Workshop2DossierPhase1>;

function safeSegment(id: string): string {
  return id.replace(/:/g, '_');
}

/** Стабильный ключ записи в map (не URI — только для объекта в JSON). */
export function workshop2Phase1DossierStorageKey(collectionId: string, articleId: string): string {
  return `${safeSegment(collectionId)}::${safeSegment(articleId)}`;
}

export function emptyWorkshop2DossierPhase1(): Workshop2DossierPhase1 {
  return { schemaVersion: 1, assignments: [] };
}

export function loadWorkshop2Phase1DossierMap(): Workshop2Phase1DossierMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Workshop2Phase1DossierMap;
  } catch {
    return {};
  }
}

/** @returns false при переполнении quota / приватном режиме */
export function saveWorkshop2Phase1DossierMap(map: Workshop2Phase1DossierMap): boolean {
  if (typeof window === 'undefined') return true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

export function getWorkshop2Phase1Dossier(
  collectionId: string,
  articleId: string
): Workshop2DossierPhase1 | undefined {
  const key = workshop2Phase1DossierStorageKey(collectionId, articleId);
  return loadWorkshop2Phase1DossierMap()[key];
}

/** @returns false если запись в localStorage не удалась (quota и т.п.) */
export function setWorkshop2Phase1Dossier(
  collectionId: string,
  articleId: string,
  dossier: Workshop2DossierPhase1
): boolean {
  const key = workshop2Phase1DossierStorageKey(collectionId, articleId);
  const map = loadWorkshop2Phase1DossierMap();
  map[key] = dossier;
  return saveWorkshop2Phase1DossierMap(map);
}

export function removeWorkshop2Phase1Dossier(collectionId: string, articleId: string): void {
  const key = workshop2Phase1DossierStorageKey(collectionId, articleId);
  const map = loadWorkshop2Phase1DossierMap();
  if (!(key in map)) return;
  delete map[key];
  saveWorkshop2Phase1DossierMap(map);
}
