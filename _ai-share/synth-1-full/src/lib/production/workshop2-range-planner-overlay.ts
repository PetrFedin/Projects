'use client';

import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { RangePlannerTier } from '@/lib/production/workshop2-range-planner-bridge';
import type {
  DevelopmentStatusRangePlannerPayload,
  RangePlannerPgSnapshot,
} from '@/lib/production/workshop2-range-planner-pg';

const STORAGE_KEY = 'synth.brand.workshop2RangePlannerOverlay.v1';

export type RangePlannerOverlayTier = {
  id: RangePlannerTier;
  budget: number;
  targetMargin: number;
  planSkuCount: number;
  pgSkuCount: number;
  budgetFromPg?: boolean;
};

export type RangePlannerOverlayDoc = {
  v: 1;
  collectionId: string;
  tiers: RangePlannerOverlayTier[];
  dataSource: RangePlannerPgSnapshot['dataSource'];
  tiersFromPg: boolean;
  budgetFromPg: boolean;
  articleCount: number;
  syncedFromPgAt: string;
};

export type RangePlannerOverlayMap = Record<string, RangePlannerOverlayDoc>;

function safeSegment(id: string): string {
  return id.replace(/:/g, '_');
}

export function workshop2RangePlannerOverlayKey(collectionId: string): string {
  return safeSegment(collectionId.trim());
}

export function loadWorkshop2RangePlannerOverlayMap(): RangePlannerOverlayMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as RangePlannerOverlayMap;
  } catch {
    return {};
  }
}

export function saveWorkshop2RangePlannerOverlayMap(map: RangePlannerOverlayMap): boolean {
  if (typeof window === 'undefined') return true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

export function overlayDocFromPgSnapshot(snapshot: RangePlannerPgSnapshot): RangePlannerOverlayDoc {
  return {
    v: 1,
    collectionId: snapshot.collectionId,
    tiers: snapshot.tiers.map((row) => ({
      id: row.id,
      budget: row.budget,
      targetMargin: row.targetMargin,
      planSkuCount: row.planSkuCount,
      pgSkuCount: row.pgSkuCount,
      ...(row.budgetFromPg ? { budgetFromPg: true } : {}),
    })),
    dataSource: snapshot.dataSource,
    tiersFromPg: snapshot.tiersFromPg,
    budgetFromPg: snapshot.budgetFromPg,
    articleCount: snapshot.articleCount,
    syncedFromPgAt: new Date().toISOString(),
  };
}

export function syncRangePlannerOverlayFromPgSnapshot(snapshot: RangePlannerPgSnapshot): boolean {
  const key = workshop2RangePlannerOverlayKey(snapshot.collectionId);
  const map = loadWorkshop2RangePlannerOverlayMap();
  map[key] = overlayDocFromPgSnapshot(snapshot);
  return saveWorkshop2RangePlannerOverlayMap(map);
}

export function getRangePlannerOverlayForCollection(
  collectionId: string
): RangePlannerOverlayDoc | undefined {
  const key = workshop2RangePlannerOverlayKey(collectionId);
  return loadWorkshop2RangePlannerOverlayMap()[key];
}

/** Подтягивает development-status и синхронизирует tier overlay в localStorage. */
export async function syncRangePlannerOverlayFromDevelopmentStatus(
  collectionId: string
): Promise<RangePlannerOverlayDoc | null> {
  const cid = collectionId.trim();
  if (!cid) return null;
  const res = await fetch(
    `/api/workshop2/collections/${encodeURIComponent(cid)}/development-status`,
    { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    status?: DevelopmentStatusRangePlannerPayload;
  };
  if (!res.ok || !json.ok || !json.status?.rangePlanner) return null;
  const doc = overlayDocFromPgSnapshot(json.status.rangePlanner);
  const key = workshop2RangePlannerOverlayKey(cid);
  const map = loadWorkshop2RangePlannerOverlayMap();
  map[key] = doc;
  saveWorkshop2RangePlannerOverlayMap(map);
  return doc;
}
