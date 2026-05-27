'use client';

import { useMemo } from 'react';
import { JOOR_DELIVERY_WINDOWS } from '@/lib/b2b/joor-constants';
import type { ProductionPageOrderLike } from '@/app/brand/production/production-page-build-items-for-collection';
import {
  buildDropStatsFromItems,
  type DropStatsItemInput,
} from '@/app/brand/production/production-page-drop-stats';
import { buildDeliveryWindowsWithMeta } from '@/app/brand/production/production-page-delivery-windows-meta';
import type { DeliveryWindowWithMeta } from '@/app/brand/production/production-page-delivery-windows-meta';
import { computeHasProductionFloorRisks } from '@/app/brand/production/production-page-floor-risk-signal';
import {
  FLOOR_MOCK_MILESTONES_SUMMARY,
  FLOOR_MOCK_QC_SUMMARY,
  FLOOR_MOCK_SUBCONTRACT_SUMMARY,
  type FloorMilestonesSummary,
  type FloorQcSummary,
  type FloorSubcontractSummary,
} from '@/app/brand/production/production-page-floor-mock-summaries';

export type BrandProductionWorkshopFloorMocks = {
  dropStats: Record<string, { styles: number; qty: number }>;
  dropsWithMeta: readonly DeliveryWindowWithMeta[];
  /** Подписи дропов для CSV и UI фильтров. */
  dropLabelById: Record<string, string>;
  qcSummary: FloorQcSummary;
  milestonesSummary: FloorMilestonesSummary;
  subcontractSummary: FloorSubcontractSummary;
  hasRisks: boolean;
};

/** Дропы по календарю JOOR + моки сводок этажа (QC / вехи / субподряд) и флаг рисков. */
export function useBrandProductionWorkshopFloorMocks(args: {
  itemsForCollection: readonly ProductionPageOrderLike[];
}): BrandProductionWorkshopFloorMocks {
  const { itemsForCollection } = args;

  const dropStats = useMemo(
    () => buildDropStatsFromItems(itemsForCollection as DropStatsItemInput[]),
    [itemsForCollection]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dropsWithMeta = useMemo(
    () => buildDeliveryWindowsWithMeta(JOOR_DELIVERY_WINDOWS, today),
    [today.getTime()]
  );

  const dropLabelById = useMemo(() => {
    const map: Record<string, string> = {};
    JOOR_DELIVERY_WINDOWS.forEach((w) => {
      map[w.id] = w.label;
    });
    return map;
  }, []);

  const qcSummary = FLOOR_MOCK_QC_SUMMARY;
  const milestonesSummary = FLOOR_MOCK_MILESTONES_SUMMARY;
  const subcontractSummary = FLOOR_MOCK_SUBCONTRACT_SUMMARY;

  const hasRisks = useMemo(
    () =>
      computeHasProductionFloorRisks(
        qcSummary.withIssues,
        milestonesSummary.pending,
        dropsWithMeta
      ),
    [qcSummary.withIssues, milestonesSummary.pending, dropsWithMeta]
  );

  return {
    dropStats,
    dropsWithMeta,
    dropLabelById,
    qcSummary,
    milestonesSummary,
    subcontractSummary,
    hasRisks,
  };
}
