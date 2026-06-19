'use client';

import { useEffect, useState } from 'react';
import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import type { PlatformCorePillarSnapshotPayload } from '@/lib/platform-core-pillar-snapshot.types';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

type Options = {
  collectionId: string;
  pillarId: CoreHubPillarId;
  roleId?: CoreChainRoleId;
  wholesaleOrderId?: string;
  articleId?: string;
  factoryId?: string;
  pillarVariant?: 'brand' | 'shop' | 'manufacturer';
  enabled?: boolean;
  reloadNonce?: number;
};

const snapshotCache = new Map<string, { at: number; snap: PlatformCorePillarSnapshotPayload | null }>();
const inflightRequests = new Map<string, Promise<PlatformCorePillarSnapshotPayload | null>>();

const SNAPSHOT_TTL_MS =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development'
    ? 5 * 60_000
    : 120_000;

function snapshotCacheKey(options: Options): string {
  const sp = new URLSearchParams({ collectionId: options.collectionId, pillarId: options.pillarId });
  if (options.roleId) sp.set('roleId', options.roleId);
  if (options.wholesaleOrderId) sp.set('orderId', options.wholesaleOrderId);
  if (options.articleId) sp.set('articleId', options.articleId);
  if (options.factoryId) sp.set('factoryId', options.factoryId);
  if (options.pillarVariant) sp.set('pillarVariant', options.pillarVariant);
  return sp.toString();
}

async function fetchPillarSnapshot(options: Options): Promise<PlatformCorePillarSnapshotPayload | null> {
  const key = snapshotCacheKey(options);
  const cached = snapshotCache.get(key);
  if (cached && Date.now() - cached.at < SNAPSHOT_TTL_MS) {
    return cached.snap;
  }
  if (snapshotCache.has(key) && cached && Date.now() - cached.at >= SNAPSHOT_TTL_MS) {
    // stale — revalidate below, return stale meanwhile if inflight
    const stale = cached.snap;
    if (!inflightRequests.has(key)) {
      void fetchPillarSnapshotFresh(options, key).then((snap) => {
        snapshotCache.set(key, { at: Date.now(), snap });
      });
    }
    return stale;
  }
  return fetchPillarSnapshotFresh(options, key);
}

async function fetchPillarSnapshotFresh(
  options: Options,
  key: string
): Promise<PlatformCorePillarSnapshotPayload | null> {
  let promise = inflightRequests.get(key);
  if (!promise) {
    promise = (async () => {
      try {
        const sp = new URLSearchParams({ collectionId: options.collectionId, pillarId: options.pillarId });
        if (options.roleId) sp.set('roleId', options.roleId);
        if (options.wholesaleOrderId) sp.set('orderId', options.wholesaleOrderId);
        if (options.articleId) sp.set('articleId', options.articleId);
        if (options.factoryId) sp.set('factoryId', options.factoryId);
        if (options.pillarVariant) sp.set('pillarVariant', options.pillarVariant);
        const res = await fetch(`/api/workshop2/platform-core/pillar-snapshot?${sp}`, {
          headers: buildWorkshop2ApiRequestHeaders(),
          cache: 'no-store',
        });
        const json = (await res.json()) as {
          ok?: boolean;
          snapshot?: PlatformCorePillarSnapshotPayload;
        };
        const snap = json.ok && json.snapshot ? json.snapshot : null;
        snapshotCache.set(key, { at: Date.now(), snap });
        return snap;
      } catch {
        snapshotCache.set(key, { at: Date.now(), snap: null });
        return null;
      } finally {
        inflightRequests.delete(key);
      }
    })();
    inflightRequests.set(key, promise);
  }
  return promise;
}

export function usePillarSnapshot({
  collectionId,
  pillarId,
  roleId,
  wholesaleOrderId,
  articleId,
  factoryId,
  pillarVariant,
  enabled = true,
  reloadNonce = 0,
}: Options) {
  const [snapshot, setSnapshot] = useState<PlatformCorePillarSnapshotPayload | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled || !collectionId) {
      setLoading(false);
      return;
    }
    if (reloadNonce > 0) {
      snapshotCache.delete(snapshotCacheKey({
        collectionId,
        pillarId,
        roleId,
        wholesaleOrderId,
        articleId,
        factoryId,
        pillarVariant,
        enabled,
        reloadNonce,
      }));
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    void fetchPillarSnapshot({
      collectionId,
      pillarId,
      roleId,
      wholesaleOrderId,
      articleId,
      factoryId,
      pillarVariant,
      enabled,
      reloadNonce,
    }).then((snap) => {
      if (!cancelled) {
        setSnapshot(snap);
        setError(!snap);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [collectionId, pillarId, roleId, wholesaleOrderId, articleId, factoryId, pillarVariant, enabled, reloadNonce]);

  return { snapshot, loading, error };
}
