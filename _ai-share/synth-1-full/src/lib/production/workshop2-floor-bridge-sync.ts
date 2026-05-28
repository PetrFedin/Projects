/**
 * Wave 34: обратная синхронизация пол ↔ sample order (расширение floor-bridge).
 */
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';

const FLOOR_TAB_TO_ORDER_STATUS: Record<string, Workshop2SampleOrderStatus> = {
  stages: 'draft',
  workshop: 'draft',
  samples: 'sent',
  operations: 'in_progress',
  quality: 'received',
  'gold-sample': 'approved',
};

const ORDER_STATUS_TO_FLOOR_TAB: Record<Workshop2SampleOrderStatus, string> = {
  draft: 'stages',
  sent: 'samples',
  in_progress: 'operations',
  received: 'quality',
  approved: 'gold-sample',
  cancelled: 'stages',
};

export function mapWorkshop2FloorTabToSampleOrderStatus(
  floorTab: string | undefined
): Workshop2SampleOrderStatus | undefined {
  if (!floorTab?.trim()) return undefined;
  return FLOOR_TAB_TO_ORDER_STATUS[floorTab.trim()];
}

export function workshop2SampleOrderStatusToFloorTab(
  status: Workshop2SampleOrderStatus | undefined
): string {
  if (!status) return 'stages';
  return ORDER_STATUS_TO_FLOOR_TAB[status] ?? 'stages';
}
