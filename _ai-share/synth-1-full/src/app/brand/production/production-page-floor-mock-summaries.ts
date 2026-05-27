import {
  MOCK_MILESTONES_FLOOR,
  MOCK_QC_INSPECTIONS_FLOOR,
  MOCK_SUBCONTRACT_ORDERS_FLOOR,
} from '@/app/brand/production/production-page-demo-data';
import type { QcInspection } from '@/lib/production/qc-app';
import type { MilestoneWithVideo } from '@/lib/production/milestones-video';
import type { SubcontractOrder } from '@/lib/production/subcontractor';

export type FloorQcSummary = { total: number; passed: number; withIssues: number };

export function buildFloorQcSummaryFromInspections(inspections: QcInspection[]): FloorQcSummary {
  const total = inspections.length;
  const passed = inspections.filter((i) => i.status === 'passed').length;
  const withIssues = inspections.filter(
    (i) => i.defectCount > 0 || i.status === 'rework' || i.status === 'rejected'
  ).length;
  return { total, passed, withIssues };
}

export type FloorMilestonesSummary = { total: number; approved: number; pending: number };

export function buildFloorMilestonesSummary(m: MilestoneWithVideo[]): FloorMilestonesSummary {
  return {
    total: m.length,
    approved: m.filter((x) => x.status === 'approved').length,
    pending: m.filter((x) => x.status === 'pending').length,
  };
}

export type FloorSubcontractSummary = { total: number; inProgress: number; completed: number };

export function buildFloorSubcontractSummary(orders: SubcontractOrder[]): FloorSubcontractSummary {
  return {
    total: orders.length,
    inProgress: orders.filter((o) => o.status === 'in_progress').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };
}

/** Сводки по мокам этажа (до API). Стабильные ссылки — не пересчитывать в `page.tsx`. */
export const FLOOR_MOCK_QC_SUMMARY = buildFloorQcSummaryFromInspections(MOCK_QC_INSPECTIONS_FLOOR);

export const FLOOR_MOCK_MILESTONES_SUMMARY = buildFloorMilestonesSummary(MOCK_MILESTONES_FLOOR);

export const FLOOR_MOCK_SUBCONTRACT_SUMMARY = buildFloorSubcontractSummary(
  MOCK_SUBCONTRACT_ORDERS_FLOOR
);
