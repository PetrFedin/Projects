import type { ProductionMilestoneV1 } from './types';

/** Трекер этапов производства заказанной коллекции. */
export function getProductionMilestones(orderId: string): ProductionMilestoneV1[] {
  return [
    {
      id: 'M-01',
      label: 'Fabric Sourcing & Lab Dips',
      status: 'completed',
      dueDate: '2026-04-10',
      progressPercent: 100,
    },
    {
      id: 'M-02',
      label: 'Pattern Making & Grading',
      status: 'completed',
      dueDate: '2026-04-25',
      progressPercent: 100,
    },
    {
      id: 'M-03',
      label: 'Bulk Cutting',
      status: 'in_progress',
      dueDate: '2026-05-15',
      progressPercent: 45,
    },
    {
      id: 'M-04',
      label: 'Sewing & Assembly',
      status: 'pending',
      dueDate: '2026-06-05',
      progressPercent: 0,
    },
    {
      id: 'M-05',
      label: 'Quality Control & Packing',
      status: 'pending',
      dueDate: '2026-06-20',
      progressPercent: 0,
    },
  ];
}
