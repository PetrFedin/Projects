'use client';

import { useEffect, useState } from 'react';
import { Layers, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Workshop2SampleOrderDto } from '@/lib/production/workshop2-sample-api-client';
import { patchWorkshop2SampleOrderApi } from '@/lib/production/workshop2-sample-api-client';
import { fetchWorkshop2LiveIntegrationProbes } from '@/lib/production/workshop2-live-integration-probes-client';
import { patchWorkshop2NestingRequest } from '@/lib/production/workshop2-nesting-request';
import { useToast } from '@/hooks/use-toast';

type Props = {
  collectionId: string;
  articleUrlSegment: string;
  activeOrder: Workshop2SampleOrderDto | null;
  onOrderUpdated?: (order: Workshop2SampleOrderDto) => void;
};

/**
 * M12: кнопка nesting_request на вкладке «Маршрут» (supply/route).
 * Fail-closed chip как у ERP/TMS — без WORKSHOP2_NESTING_API_URL только journal/gray.
 */
export function Workshop2ReleaseRouteNestingChip({
  collectionId,
  articleUrlSegment,
  activeOrder,
  onOrderUpdated,
}: Props) {
  const { toast } = useToast();
  const [nestingLive, setNestingLive] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetchWorkshop2LiveIntegrationProbes().then((p) => {
      if (p?.probes) setNestingLive(Boolean(p.probes.nesting));
    });
  }, []);

  const handleSubmitNestingRequest = async () => {
    if (!activeOrder) return;
    setBusy(true);
    try {
      const nextNesting = patchWorkshop2NestingRequest(activeOrder.nestingRequest, {
        updatedBy: 'release-route',
        notes: 'Заявка из вкладки Маршрут (release/route)',
      });
      const res = await patchWorkshop2SampleOrderApi({
        collectionId,
        articleId: articleUrlSegment,
        orderId: activeOrder.id,
        patch: { nestingRequest: nextNesting },
      });
      if (res.ok && res.order) {
        onOrderUpdated?.(res.order);
        toast({
          title: 'Nesting request',
          description: nestingLive
            ? 'Заявка сохранена — доступен external nesting API.'
            : 'Заявка сохранена (journal). Задайте WORKSHOP2_NESTING_API_URL для live.',
        });
      } else {
        toast({
          title: 'Nesting request',
          description: res.messageRu ?? 'Не удалось сохранить заявку.',
          variant: 'destructive',
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
      data-testid="workshop2-release-route-nesting-chip"
    >
      <span className="text-text-muted text-[9px] font-semibold uppercase tracking-wide">
        Nesting
      </span>
      <Badge
        variant="outline"
        className={
          nestingLive
            ? 'border-emerald-300 text-[9px] text-emerald-800'
            : 'text-[9px] text-slate-600'
        }
        data-testid="workshop2-release-route-nesting-probe"
      >
        {nestingLive ? 'NESTING API live' : 'NESTING journal'}
      </Badge>
      {activeOrder ? (
        <>
          <Badge variant="secondary" className="text-[9px]">
            заказ {activeOrder.id.slice(0, 8)}…
          </Badge>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            disabled={busy}
            onClick={() => void handleSubmitNestingRequest()}
            data-testid="workshop2-release-route-nesting-request-btn"
          >
            <Send className="mr-1 h-3 w-3" />
            {busy ? 'Сохранение…' : 'nesting_request'}
          </Button>
        </>
      ) : (
        <span className="text-text-muted flex items-center gap-1 text-[10px]">
          <Layers className="h-3 w-3" />
          Нет активного заказа образца
        </span>
      )}
    </div>
  );
}
