'use client';

import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

const inflight = new Set<string>();

/** Прогрев pillar-snapshot BFF (hover/focus в hub/cabinet). */
export function prefetchPillarSnapshot(input: {
  collectionId: string;
  pillarId: CoreHubPillarId;
  roleId: CoreChainRoleId;
  factoryId?: string;
  articleId?: string;
}): void {
  const cid = input.collectionId.trim();
  if (!cid) return;
  const key = `${cid}:${input.pillarId}:${input.roleId}:${input.articleId ?? ''}`;
  if (inflight.has(key)) return;
  inflight.add(key);
  const sp = new URLSearchParams({
    collectionId: cid,
    pillarId: input.pillarId,
    roleId: input.roleId,
  });
  if (input.factoryId) sp.set('factoryId', input.factoryId);
  if (input.articleId) sp.set('articleId', input.articleId);
  void fetch(`/api/workshop2/platform-core/pillar-snapshot?${sp}`, {
    headers: buildWorkshop2ApiRequestHeaders(),
    cache: 'no-store',
  })
    .catch(() => {})
    .finally(() => {
      inflight.delete(key);
    });
}
