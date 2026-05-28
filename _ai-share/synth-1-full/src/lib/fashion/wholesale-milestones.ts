import type { WholesaleMilestoneV1 } from './types';

/** Жизненный цикл оптового заказа (PO Lifecycle Milestones). */
export function getWholesaleMilestones(orderId: string = 'PO-2026-001'): WholesaleMilestoneV1[] {
  return [
    {
      id: 'PRE-ORDER',
      name: 'Pre-Order Confirmation',
      status: 'completed',
      estimatedDate: '2026-03-01',
      actualDate: '2026-03-02',
      riskFactor: 0,
    },
    {
      id: 'PRODUCTION',
      name: 'Factory Production Step 1',
      status: 'in_progress',
      estimatedDate: '2026-04-15',
      riskFactor: 15,
    },
    {
      id: 'QC-HUB',
      name: 'Quality Control (Supplier QC Hub)',
      status: 'pending',
      estimatedDate: '2026-05-01',
      riskFactor: 5,
    },
    {
      id: 'LOGISTICS-DISPATCH',
      name: 'Customs & Regional Dispatch',
      status: 'pending',
      estimatedDate: '2026-05-15',
      riskFactor: 10,
    },
    {
      id: 'STORE-DELIVERY',
      name: 'Final Store Arrival',
      status: 'pending',
      estimatedDate: '2026-05-20',
      riskFactor: 5,
    },
  ];
}
