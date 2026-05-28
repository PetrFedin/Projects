'use client';

import { ProductionPageContentTabArchive } from '@/app/brand/production/production-page-content-tab-archive';
import { ProductionPageContentTabAudit } from '@/app/brand/production/production-page-content-tab-audit';
import { ProductionPageContentTabCalendar } from '@/app/brand/production/production-page-content-tab-calendar';
import { ProductionPageContentTabDocuments } from '@/app/brand/production/production-page-content-tab-documents';
import { ProductionPageContentTabFactories } from '@/app/brand/production/production-page-content-tab-factories';
import { ProductionPageContentTabHandbooks } from '@/app/brand/production/production-page-content-tab-handbooks';
import { ProductionPageContentTabLosses } from '@/app/brand/production/production-page-content-tab-losses';
import { ProductionPageContentTabNotifications } from '@/app/brand/production/production-page-content-tab-notifications';
import { ProductionPageContentTabReports } from '@/app/brand/production/production-page-content-tab-reports';
import { ProductionPageContentTabSla } from '@/app/brand/production/production-page-content-tab-sla';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

/** Документы, потери, фабрики, справочники, аудит, SLA, календарь, уведомления, отчёты, архив. */
export function ProductionPageContentTabPanelsBlockC({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <>
      <ProductionPageContentTabDocuments p={p} cn={cn} />
      <ProductionPageContentTabLosses p={p} cn={cn} />
      <ProductionPageContentTabFactories p={p} />
      <ProductionPageContentTabHandbooks p={p} cn={cn} />
      <ProductionPageContentTabAudit p={p} cn={cn} />
      <ProductionPageContentTabSla p={p} />
      <ProductionPageContentTabCalendar p={p} cn={cn} />
      <ProductionPageContentTabNotifications p={p} cn={cn} />
      <ProductionPageContentTabReports p={p} />
      <ProductionPageContentTabArchive p={p} />
    </>
  );
}
