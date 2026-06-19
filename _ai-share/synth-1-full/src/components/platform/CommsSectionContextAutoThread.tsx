'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { isCoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { markPgSectionVisited } from '@/lib/communications/pg-contextual-section-read-state';
import { isPlatformCorePgB2bOrder } from '@/lib/platform-core-demo-order';

type Props = {
  /** Если не передан — берётся из ?order= в URL (messages/calendar deep-link). */
  orderId?: string;
  disabled?: boolean;
  readerId?: string;
};

/** При ?pillar=&section= на comms — idempotent ensure PG thread + section anchor. */
export function CommsSectionContextAutoThread({
  orderId: orderIdProp,
  disabled,
  readerId,
}: Props) {
  const searchParams = useSearchParams();
  const ensuredRef = useRef<string>('');

  const pillarRaw = searchParams.get('pillar')?.trim() ?? '';
  const sectionId = searchParams.get('section')?.trim() ?? '';
  const orderFromUrl = searchParams.get('order')?.trim() ?? '';
  const pillarId = pillarRaw && isCoreHubPillarId(pillarRaw) ? pillarRaw : null;
  const oid = (orderIdProp?.trim() || orderFromUrl).trim();

  useEffect(() => {
    if (disabled || !oid || !isPlatformCorePgB2bOrder(oid) || !pillarId || !sectionId) return;

    const key = `${oid}:${pillarId}:${sectionId}`;
    if (ensuredRef.current === key) return;
    ensuredRef.current = key;

    void fetch('/api/messages/contextual/ensure-b2b-order', {
      method: 'POST',
      headers: {
        ...buildWorkshop2ApiRequestHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: oid,
        pillarId,
        sectionId,
        source: 'api',
      }),
    })
      .then((res) => {
        if (res.ok) markPgSectionVisited(oid, pillarId, sectionId, readerId);
      })
      .catch(() => {
        ensuredRef.current = '';
      });
  }, [disabled, oid, pillarId, sectionId, readerId]);

  if (disabled || !pillarId || !sectionId) return null;

  return (
    <p
      className="text-text-muted rounded-md border border-sky-200/50 bg-sky-50/40 px-2 py-1 text-[10px]"
      data-testid="comms-section-context-auto-thread"
      data-pillar-id={pillarId}
      data-section-id={sectionId}
    >
      Контекст раздела: <span className="text-text-primary font-semibold">{sectionId}</span>
    </p>
  );
}
