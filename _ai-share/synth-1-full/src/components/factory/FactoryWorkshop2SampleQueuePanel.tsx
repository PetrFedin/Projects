'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Shirt, AlertTriangle, ExternalLink, PackageCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { usePlatformCoreDevelopmentStatusPoll } from '@/hooks/use-platform-core-development-status-poll';
import { sortWorkshop2FactorySampleQueueItems } from '@/lib/production/workshop2-factory-sample-queue-utils';
import { MfrDevSampleQueueHandoffPeerStrip } from '@/components/factory/MfrDevSampleQueueHandoffPeerStrip';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';

type QueueItem = {
  orderId: string;
  collectionId: string;
  articleId: string;
  status: string;
  quantity: number;
  dueDate?: string;
  articleLabelRu?: string;
  qcStatusBadgeRu?: string;
  qcStatusTone?: 'emerald' | 'amber' | 'rose' | 'slate';
  dueOverdue?: boolean;
  workspaceFitQcHref: string;
};

type Props = {
  factoryId?: string;
  className?: string;
};

/** Очередь образцов W2 → factory portal (не static MOCK). */
export function FactoryWorkshop2SampleQueuePanel({ factoryId = 'fact-1', className }: Props) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('');
  const [ackingId, setAckingId] = useState<string | null>(null);
  const { tick: devPollTick, sseConnected } = usePlatformCoreDevelopmentStatusPoll(
    true,
    ['SS27', 'FW27'],
    factoryId
  );

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/workshop2/factory/sample-queue?factoryId=${encodeURIComponent(factoryId)}&status=draft,sent,in_progress`,
        { headers: buildWorkshop2ApiRequestHeaders() }
      );
      const json = (await res.json()) as {
        ok?: boolean;
        items?: QueueItem[];
        source?: string;
      };
      if (json.ok && Array.isArray(json.items)) {
        setItems(sortWorkshop2FactorySampleQueueItems(json.items).slice(0, 6));
        setSource(json.source ?? '');
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [factoryId]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue, devPollTick]);

  const acknowledgeSample = async (item: QueueItem) => {
    setAckingId(item.orderId);
    try {
      const res = await fetch(
        `/api/workshop2/factory/sample-queue/${encodeURIComponent(item.orderId)}/acknowledge`,
        {
          method: 'POST',
          headers: {
            ...buildWorkshop2ApiRequestHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collectionId: item.collectionId,
            articleId: item.articleId,
            toStatus: 'received',
          }),
        }
      );
      if (res.ok) {
        await loadQueue();
      }
    } finally {
      setAckingId(null);
    }
  };

  return (
    <Card
      data-testid="factory-w2-sample-queue"
      className={cn('border-border-subtle scroll-mt-24 rounded-xl shadow-sm', className)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Shirt className="text-accent-primary h-4 w-4" />
              <span className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
                Workshop2 · образцы
              </span>
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">
              Очередь образцов
            </CardTitle>
            <CardDescription className="text-xs">
              Из W2 sample-order · {source ? `источник: ${source}` : 'загрузка…'}
              {sseConnected ? ' · SSE live' : ' · poll 15s'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[8px] font-black uppercase">
            {loading ? '…' : `${items.length} в очереди`}
          </Badge>
        </div>
      </CardHeader>
      <div className="px-4 pb-2">
        <MfrDevSampleQueueHandoffPeerStrip
          factoryId={factoryId}
          collectionId={items[0]?.collectionId ?? PLATFORM_CORE_DEMO.collectionId}
          articleId={items[0]?.articleId}
          orderId={items[0]?.orderId}
        />
      </div>
      <CardContent className="space-y-2 p-4 pt-0">
        {loading ? (
          <p className="text-text-muted text-xs">Загрузка очереди…</p>
        ) : items.length === 0 ? (
          <p className="text-text-muted text-xs">Нет активных заказов образцов для цеха.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.orderId}
              className="border-border-subtle flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">
                  {item.articleLabelRu ?? item.articleId}
                </p>
                <p className="text-text-muted font-mono text-[10px]">
                  {item.collectionId} · {item.orderId} · ×{item.quantity}
                </p>
                {item.dueDate ? (
                  <p
                    className={cn(
                      'text-[10px] font-bold',
                      item.dueOverdue ? 'text-rose-600' : 'text-text-secondary'
                    )}
                  >
                    {item.dueOverdue ? (
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Просрочено: {item.dueDate}
                      </span>
                    ) : (
                      `Срок: ${item.dueDate}`
                    )}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {item.qcStatusBadgeRu ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[8px] font-black uppercase',
                      item.qcStatusTone === 'emerald' && 'border-emerald-200 text-emerald-700',
                      item.qcStatusTone === 'amber' && 'border-amber-200 text-amber-700',
                      item.qcStatusTone === 'rose' && 'border-rose-200 text-rose-700'
                    )}
                  >
                    {item.qcStatusBadgeRu}
                  </Badge>
                ) : null}
                <Badge variant="secondary" className="text-[8px] font-black uppercase">
                  {item.status}
                </Badge>
                {item.status === 'sent' || item.status === 'in_progress' ? (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-7 text-[9px] font-black"
                    disabled={ackingId === item.orderId}
                    data-testid="factory-sample-ack-button"
                    onClick={() => void acknowledgeSample(item)}
                  >
                    <PackageCheck className="mr-1 h-3 w-3" aria-hidden />
                    {ackingId === item.orderId ? '…' : 'Принять'}
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" className="h-7 text-[9px] font-black" asChild>
                  <Link href={item.workspaceFitQcHref}>
                    QC <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
