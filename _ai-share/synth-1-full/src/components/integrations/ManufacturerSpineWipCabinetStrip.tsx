'use client';

import { useEffect, useState } from 'react';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import {
  formatWholesaleOrderDisplayId,
  isIntegrationImportedWholesaleOrderId,
  wholesaleOrderKindLabelRu,
} from '@/lib/integrations/spine/integration-ui-utils';
import { IntegrationProductionWipStrip } from '@/components/integrations/IntegrationProductionWipStrip';

type HandoffItem = {
  b2bOrderId: string;
  productionOrderId: string;
};

type Props = {
  factoryId: string;
};

/** Wave H · manufacturer cabinet pillar 4 — WIP advance for INT-* in handoff queue. */
export function ManufacturerSpineWipCabinetStrip({ factoryId }: Props) {
  const [intItem, setIntItem] = useState<HandoffItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/factory/production-handoff-queue?factoryId=${encodeURIComponent(factoryId)}`,
          { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
        );
        const json = (await res.json()) as { ok?: boolean; items?: HandoffItem[] };
        const hit = (json.items ?? []).find((i) =>
          isIntegrationImportedWholesaleOrderId(i.b2bOrderId)
        );
        if (!cancelled) setIntItem(hit ?? null);
      } catch {
        if (!cancelled) setIntItem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [factoryId]);

  if (loading || !intItem) return null;

  return (
    <div
      className="space-y-1 rounded-md border border-amber-200/70 bg-amber-50/30 px-2 py-1.5"
      data-testid="mfr-spine-wip-cabinet-strip"
    >
      <p className="text-[10px] font-medium text-amber-950">
        {wholesaleOrderKindLabelRu(intItem.b2bOrderId)} ·{' '}
        {formatWholesaleOrderDisplayId(intItem.b2bOrderId)}
      </p>
      <IntegrationProductionWipStrip
        wholesaleOrderId={intItem.b2bOrderId}
        productionOrderId={intItem.productionOrderId}
        variant="factory"
        allowAdvance
      />
    </div>
  );
}
