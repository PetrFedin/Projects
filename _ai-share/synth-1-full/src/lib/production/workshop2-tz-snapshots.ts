import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import { stripDossierForPersistDiff } from './workshop2-dossier-activity-log';
import { summarizeWorkshop2PersistDiff } from './workshop2-dossier-activity-log';

export type Workshop2TzSnapshot = {
  snapshotId: string;
  label: string;
  at: string;
  by: string;
  dossier: Workshop2DossierPhase1;
};

function key(collectionId: string, articleId: string): string {
  return `w2-tz-snapshots:v1:${collectionId}:${articleId}`;
}

export function loadWorkshop2TzSnapshots(
  collectionId: string,
  articleId: string
): Workshop2TzSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key(collectionId, articleId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Workshop2TzSnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWorkshop2TzSnapshots(
  collectionId: string,
  articleId: string,
  rows: Workshop2TzSnapshot[]
): boolean {
  if (typeof window === 'undefined') return true;
  try {
    window.localStorage.setItem(key(collectionId, articleId), JSON.stringify(rows.slice(-24)));
    return true;
  } catch {
    return false;
  }
}

export function appendWorkshop2TzSnapshot(
  collectionId: string,
  articleId: string,
  payload: { label: string; by: string; dossier: Workshop2DossierPhase1 }
): { rows: Workshop2TzSnapshot[]; saved: boolean } {
  const prev = loadWorkshop2TzSnapshots(collectionId, articleId);
  const row: Workshop2TzSnapshot = {
    snapshotId:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `snap-${Date.now()}`,
    label: payload.label.trim() || 'Снимок ТЗ',
    at: new Date().toISOString(),
    by: payload.by.slice(0, 200),
    dossier: payload.dossier,
  };
  const next = [...prev, row];
  return { rows: next, saved: saveWorkshop2TzSnapshots(collectionId, articleId, next) };
}

export function diffWorkshop2TzSnapshots(
  left: Workshop2TzSnapshot | null | undefined,
  right: Workshop2TzSnapshot | null | undefined
): { changed: boolean; lines: string[] } {
  if (!left || !right) return { changed: false, lines: [] };
  const changed =
    JSON.stringify(stripDossierForPersistDiff(left.dossier)) !==
    JSON.stringify(stripDossierForPersistDiff(right.dossier));
  return {
    changed,
    lines: summarizeWorkshop2PersistDiff(left.dossier, right.dossier),
  };
}
