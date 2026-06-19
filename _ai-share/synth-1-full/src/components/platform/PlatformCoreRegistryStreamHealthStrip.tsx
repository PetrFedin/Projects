'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePlatformCoreB2bRegistryPoll } from '@/hooks/use-platform-core-b2b-registry-poll';
import {
  brandB2bOrdersCollectionRegistryHref,
  shopB2bOrdersCollectionRegistryHref,
} from '@/lib/routes';

type Props = {
  variant: 'brand' | 'shop';
  orderId?: string;
  testIdPrefix: string;
};

/** Registry SSE health + poll fallback honesty + manual refresh. */
export function PlatformCoreRegistryStreamHealthStrip({ variant, orderId, testIdPrefix }: Props) {
  const { refresh, sseConnected } = usePlatformCoreB2bRegistryPoll(true);
  const registryHref =
    variant === 'brand'
      ? brandB2bOrdersCollectionRegistryHref(orderId)
      : shopB2bOrdersCollectionRegistryHref(orderId);

  return (
    <div
      className="border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-bg-surface2/50 px-3 py-2 text-xs"
      data-testid={`${testIdPrefix}-registry-stream-health-strip`}
    >
      <Badge
        variant="outline"
        className={
          sseConnected
            ? 'border-emerald-500/40 text-[9px] text-emerald-800'
            : 'border-amber-500/40 text-[9px] text-amber-900'
        }
        data-testid={`${testIdPrefix}-registry-sse-${sseConnected ? 'live' : 'poll'}`}
      >
        Registry {sseConnected ? 'SSE live' : 'poll fallback'}
      </Badge>
      <span className="text-text-muted">
        {sseConnected
          ? 'Push refetch при новом заказе.'
          : 'Poll каждые 20–60с — нажмите refresh при необходимости.'}
      </span>
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-[10px]"
        type="button"
        onClick={refresh}
        data-testid={`${testIdPrefix}-registry-stream-refresh`}
      >
        Refresh registry
      </Button>
      <Button size="sm" variant="ghost" className="h-7 text-[10px]" asChild>
        <Link href={registryHref} data-testid={`${testIdPrefix}-registry-stream-link`}>
          Реестр
        </Link>
      </Button>
    </div>
  );
}
