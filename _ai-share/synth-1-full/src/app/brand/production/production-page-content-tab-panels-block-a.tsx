'use client';

import { ProductionPageContentTabApproval } from '@/app/brand/production/production-page-content-tab-approval';
import { ProductionPageContentTabChat } from '@/app/brand/production/production-page-content-tab-chat';
import { ProductionPageContentTabCollections } from '@/app/brand/production/production-page-content-tab-collections';
import { ProductionPageContentTabDashboard } from '@/app/brand/production/production-page-content-tab-dashboard';
import { ProductionPageContentTabDemand } from '@/app/brand/production/production-page-content-tab-demand';
import { ProductionPageContentTabFitting } from '@/app/brand/production/production-page-content-tab-fitting';
import { ProductionPageContentTabMps } from '@/app/brand/production/production-page-content-tab-mps';
import { ProductionPageContentTabOrders } from '@/app/brand/production/production-page-content-tab-orders';
import { ProductionPageContentTabPlm } from '@/app/brand/production/production-page-content-tab-plm';
import { ProductionPageContentTabSamples } from '@/app/brand/production/production-page-content-tab-samples';
import { ProductionPageContentTabTz } from '@/app/brand/production/production-page-content-tab-tz';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

/** Коллекции, дашборд, прогноз, ТЗ, PLM, сэмплы, посадка, утверждение, заказы, MPS. */
export function ProductionPageContentTabPanelsBlockA({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <>
      <ProductionPageContentTabChat p={p} cn={cn} />
      <ProductionPageContentTabCollections p={p} cn={cn} />
      <ProductionPageContentTabDashboard p={p} />
      <ProductionPageContentTabDemand p={p} />
      <ProductionPageContentTabTz p={p} />
      <ProductionPageContentTabPlm p={p} />
      <ProductionPageContentTabSamples p={p} cn={cn} />
      <ProductionPageContentTabFitting p={p} />
      <ProductionPageContentTabApproval />
      <ProductionPageContentTabOrders p={p} cn={cn} />
      <ProductionPageContentTabMps p={p} />
    </>
  );
}
