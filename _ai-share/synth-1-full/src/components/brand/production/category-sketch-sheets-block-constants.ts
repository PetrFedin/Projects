import type { Workshop2SketchSheetWorkflowStatus } from '@/lib/production/workshop2-dossier-phase1.types';

export const WORKFLOW_STATUS_LABEL: Record<Workshop2SketchSheetWorkflowStatus, string> = {
  draft: 'Черновик',
  review: 'На согласовании',
  approved: 'Утверждён',
};
