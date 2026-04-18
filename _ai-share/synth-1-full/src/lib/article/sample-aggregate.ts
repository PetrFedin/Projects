/**
 * [Phase 2 — Sample / SMS / Gold sample]
 */

export type SampleStatus =
  | 'requested'
  | 'in_production'
  | 'shipped'
  | 'received'
  | 'approved'
  | 'rejected';

export interface SampleAggregate {
  id: string;
  articleId: string;
  status: SampleStatus;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

export function isSampleReady(sample: SampleAggregate): boolean {
  return sample.status === 'approved';
}
