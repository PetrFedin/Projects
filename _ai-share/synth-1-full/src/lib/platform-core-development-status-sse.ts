import type { Workshop2DevelopmentStatus } from '@/lib/server/workshop2-development-status';

export type PlatformCoreDevelopmentStatusSseEvent =
  | { type: 'ping'; ts: string }
  | {
      type: 'development_update';
      ts: string;
      collectionIds: string[];
      fingerprint: string;
    };

export function formatPlatformCoreDevelopmentStatusSseData(
  event: PlatformCoreDevelopmentStatusSseEvent
): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export function fingerprintWorkshop2DevelopmentStatus(
  status: Pick<
    Workshop2DevelopmentStatus,
    'collectionId' | 'articleCount' | 'sampleQueueCount' | 'steps' | 'articleIds' | 'rangePlanner'
  >
): string {
  const steps = status.steps.map((s) => `${s.id}:${s.done ? 1 : 0}`).join('|');
  const rp = status.rangePlanner;
  const tierPart = rp
    ? [
        rp.dataSource,
        rp.articleCount,
        rp.unassignedSkuCount,
        rp.tiers
          .map(
            (t) =>
              `${t.id}:${t.pgSkuCount}:${t.budget ?? ''}:${t.targetMargin ?? ''}:${t.planSkuCount ?? ''}`
          )
          .join(','),
      ].join(':')
    : 'no-rp';
  const articleIds = [...status.articleIds].sort().join(',');
  return [
    status.collectionId,
    status.articleCount,
    status.sampleQueueCount,
    steps,
    articleIds,
    tierPart,
  ].join(';');
}
