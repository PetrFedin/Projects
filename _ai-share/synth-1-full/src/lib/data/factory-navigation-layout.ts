'use client';

/**
 * Breadcrumbs factory layouts — без factory-navigation (lucide) в initial chunk.
 */
import { resolveCabinetSectionLabelFromPathIndex } from '@/lib/ui/cabinet-nav-active';
import { factoryMfrNavPathCandidates } from './factory-mfr-navigation-path-index';
import { factorySupNavPathCandidates } from './factory-sup-navigation-path-index';

export function getFactoryMfrSectionLabel(pathname: string | null | undefined): string {
  return resolveCabinetSectionLabelFromPathIndex(pathname, factoryMfrNavPathCandidates, 'Дашборд');
}

export function getFactorySupSectionLabel(pathname: string | null | undefined): string {
  return resolveCabinetSectionLabelFromPathIndex(pathname, factorySupNavPathCandidates, 'Дашборд');
}
