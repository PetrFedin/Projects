import type { PaymentMilestoneV1 } from './types';

/** Инфраструктура платежных этапов для B2B (30/70, 50/50). */
export function getPaymentMilestones(orderTotal: number): PaymentMilestoneV1[] {
  return [
    {
      id: 'MIL-01',
      label: 'Pre-production Deposit',
      amount: Math.round(orderTotal * 0.3),
      dueDate: '2026-04-15',
      status: 'pending',
      percentage: 30,
    },
    {
      id: 'MIL-02',
      label: 'Balance Shipment Payment',
      amount: Math.round(orderTotal * 0.7),
      dueDate: '2026-06-01',
      status: 'pending',
      percentage: 70,
    }
  ];
}

export function calculateMilestoneBalance(milestones: PaymentMilestoneV1[]): number {
  return milestones.filter(m => m.status === 'pending').reduce((acc, m) => acc + m.amount, 0);
}
