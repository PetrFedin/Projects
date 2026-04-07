import type { RepairHubRequestV1, B2BRepairRequestV1 } from './types';

/** Управление циклом ремонта (Ателье / Repair Hub). */
export function getRepairHubStatus(sku: string): RepairHubRequestV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 11;

  const issueTypes: RepairHubRequestV1['issueType'][] = ['stitch', 'zipper', 'lining', 'size_alteration'];
  const statusTypes: RepairHubRequestV1['status'][] = ['received', 'in_repair', 'ready_for_pickup'];

  return {
    requestId: `REP-${seed}-2026`,
    sku,
    issueType: issueTypes[seed % issueTypes.length],
    status: statusTypes[seed % statusTypes.length],
    estimatedCost: 1500 + (seed % 3000),
    atelierId: 'ATELIER-CENTRAL-01',
  };
}

/** Список заявок на ремонт для партнера (B2B Repair Requests). */
export function getB2BRepairRequests(partnerId: string): B2BRepairRequestV1[] {
  return [
    {
      id: 'REQ-RU-7701',
      sku: 'SKU-101',
      partnerId,
      type: 'repair',
      status: 'fixing',
      trackingNumber: '7701-RU-CDEK',
    },
    {
      id: 'REQ-RU-7705',
      sku: 'SKU-202',
      partnerId,
      type: 'repair',
      status: 'returned',
      trackingNumber: '7705-RU-BOX',
    }
  ];
}
