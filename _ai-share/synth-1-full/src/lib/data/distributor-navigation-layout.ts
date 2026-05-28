'use client';

/**
 * Breadcrumbs distributor layout — без distributor-navigation (lucide) в initial chunk.
 */
import { resolveCabinetSectionLabelFromPathIndex } from '@/lib/ui/cabinet-nav-active';
import { distributorNavPathCandidates } from './distributor-navigation-path-index';

export function getDistributorSectionLabel(pathname: string | null | undefined): string {
  return resolveCabinetSectionLabelFromPathIndex(pathname, distributorNavPathCandidates, 'Дашборд');
}
