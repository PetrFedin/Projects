import type { Workshop2B2bOrderLine } from '@/lib/production/workshop2-b2b-order-lifecycle';

export const WORKSHOP2_B2B_AMENDMENT_STATUSES = ['pending', 'approved', 'rejected'] as const;

export type Workshop2B2bAmendmentStatus = (typeof WORKSHOP2_B2B_AMENDMENT_STATUSES)[number];

export type Workshop2B2bAmendmentRecord = {
  id: string;
  orderId: string;
  status: Workshop2B2bAmendmentStatus;
  noteRu: string;
  proposedLines?: Workshop2B2bOrderLine[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  resolvedBy?: string;
  resolutionNoteRu?: string;
};

export function isWorkshop2B2bAmendmentStatus(v: string): v is Workshop2B2bAmendmentStatus {
  return (WORKSHOP2_B2B_AMENDMENT_STATUSES as readonly string[]).includes(v);
}

export function workshop2B2bAmendmentStatusLabelRu(status: Workshop2B2bAmendmentStatus): string {
  switch (status) {
    case 'pending':
      return 'Ожидает решения бренда';
    case 'approved':
      return 'Одобрено';
    case 'rejected':
      return 'Отклонено';
    default:
      return status;
  }
}
