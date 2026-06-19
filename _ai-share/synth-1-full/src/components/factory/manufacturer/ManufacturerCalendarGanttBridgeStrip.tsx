'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Milestone Gantt peer — brand production view with PO/collection context. */
export function ManufacturerCalendarGanttBridgeStrip({ collectionId, orderId }: Props) {
  const qs = new URLSearchParams();
  if (orderId?.trim()) qs.set('po', orderId.trim());
  qs.set('collection', collectionId);
  const href = `${ROUTES.brand.productionGantt}?${qs.toString()}`;

  return (
    <div
      className="border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-bg-surface2/60 px-3 py-2 text-xs"
      data-testid="mfr-cm-calendar-gantt-bridge-strip"
    >
      <Badge variant="outline" className="text-[9px] uppercase">
        Gantt
      </Badge>
      <span className="text-text-secondary">
        Milestone Gantt · сроки образцов и PO (peer к brand production).
      </span>
      <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
        <Link href={href} data-testid="mfr-cm-calendar-gantt-link">
          Открыть Gantt
        </Link>
      </Button>
    </div>
  );
}
