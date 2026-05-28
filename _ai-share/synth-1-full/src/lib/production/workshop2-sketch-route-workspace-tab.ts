import type { Workshop2TzSignoffStageId } from '@/lib/production/workshop2-dossier-phase1.types';

/** Метка скетча «этап маршрута» → вкладка артикула в воркспейсе. */
export const SKETCH_ROUTE_STAGE_TO_WORKSPACE_TAB: Record<
  Workshop2TzSignoffStageId,
  'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc' | 'stock' | 'overview'
> = {
  tz: 'tz',
  sample: 'fit',
  supply: 'supply',
  fit: 'fit',
  plan: 'plan',
  release: 'release',
  qc: 'qc',
};
