'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';
import {
  buildWorkshop2SchetOffertaApiHref,
  resolveB2bLineWorkshop2WorkspaceHref,
  type B2bOrderLineWorkshop2Ref,
} from '@/lib/production/workshop2-b2b-order-workshop2-link';
import { evaluateWorkshop2B2bCreditHold } from '@/lib/production/workshop2-b2b-credit-hold';
import { summarizeWorkshop2B2bExternalOrderNeutralRu } from '@/lib/production/workshop2-b2b-marketplace-inbound';
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Wave 17: нейтральная строка внешнего B2B заказа на вкладках «План» / «Release» (market=ru). */
export function Workshop2B2bExternalOrderNeutralChip({
  dossier,
}: {
  dossier?: Workshop2DossierPhase1 | null;
}) {
  const draft = dossier?.b2bIntegrationDraft;
  const summary = summarizeWorkshop2B2bExternalOrderNeutralRu({
    externalOrderId: draft?.lastMarketplaceOrderId,
    provider: draft?.lastMarketplaceProvider,
    market: getWorkshop2MarketProfile(),
  });
  if (!summary) return null;
  return (
    <p
      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-800"
      data-testid="workshop2-b2b-external-order-neutral"
    >
      {summary.labelRu}
      {summary.providerLabelRu && getWorkshop2MarketProfile() !== 'ru' ? (
        <span className="text-slate-500"> · {summary.providerLabelRu}</span>
      ) : null}
    </p>
  );
}

/** Wave 12 + W16: B2B заказ → workspace W2 + счёт-оферта + credit hold (RU). */
export function Workshop2B2bOrderRuStrip({
  orderId,
  lines,
  territoryId = 'RU-MOW',
  orderTotalRub,
}: {
  orderId: string;
  lines: B2bOrderLineWorkshop2Ref[];
  /** Wave 7 territory — demo Moscow для дистрибьютора/ритейла. */
  territoryId?: string;
  orderTotalRub?: number;
}) {
  const workspaceHref =
    lines.map((line) => resolveB2bLineWorkshop2WorkspaceHref(line)).find(Boolean) ?? null;
  const schetHref = buildWorkshop2SchetOffertaApiHref(orderId);

  const computedTotal =
    orderTotalRub ??
    lines.reduce((acc, line) => {
      const qty =
        (line as { orderedQuantity?: number; quantity?: number }).orderedQuantity ??
        (line as { quantity?: number }).quantity ??
        1;
      const price = (line as { price?: number }).price ?? 0;
      return acc + price * 0.4 * qty;
    }, 0);

  const creditHold = useMemo(
    () =>
      evaluateWorkshop2B2bCreditHold({
        territoryId,
        orderTotalRub: computedTotal,
      }),
    [territoryId, computedTotal]
  );

  if (
    !workspaceHref &&
    !schetHref &&
    !creditHold.gate &&
    !creditHold.messageRu.includes('Credit OK')
  ) {
    return null;
  }

  return (
    <div
      className="flex flex-col gap-2 rounded-md border border-indigo-200/80 bg-indigo-50/50 px-3 py-2"
      data-testid="workshop2-b2b-order-ru-strip"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-indigo-900">РФ · Workshop2</span>
        {workspaceHref ? (
          <Button type="button" size="sm" variant="outline" className="h-7 text-[10px]" asChild>
            <Link href={workspaceHref} data-testid="workshop2-b2b-order-workspace-link">
              <ExternalLink className="mr-1 h-3 w-3" />
              ТЗ артикула
            </Link>
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="outline" className="h-7 text-[10px]" asChild>
          <a
            href={schetHref}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="workshop2-b2b-schet-offerta"
          >
            <FileText className="mr-1 h-3 w-3" />
            Счёт-оферта (PDF)
          </a>
        </Button>
      </div>
      {creditHold.gate ? (
        <p
          className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1.5 text-[10px] text-rose-900"
          data-testid="workshop2-b2b-order-credit-hold-block"
        >
          {creditHold.messageRu}
        </p>
      ) : creditHold.messageRu.includes('Credit OK') ? (
        <p
          className="text-[10px] text-emerald-800"
          data-testid="workshop2-b2b-order-credit-hold-ok"
        >
          {creditHold.messageRu}
        </p>
      ) : null}
    </div>
  );
}
