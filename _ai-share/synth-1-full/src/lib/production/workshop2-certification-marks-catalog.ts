/**
 * Справочник сертификатов / маркировок для certificationMarksOptions (seed ids).
 */

import certificationMarksSeed from '../../../data/workshop2/certification-marks.seed.json';
import type { AttributeCatalogParameter } from '@/lib/production/attribute-catalog.types';

export type Workshop2CertificationMarkRow = {
  id: string;
  labelRu: string;
  sortOrder: number;
};

const MARKS: Workshop2CertificationMarkRow[] = [...(certificationMarksSeed.marks ?? [])].sort(
  (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
);

export function getWorkshop2CertificationMarksSeed(): Workshop2CertificationMarkRow[] {
  return MARKS;
}

/** Параметры каталога атрибутов для certificationMarksOptions. */
export function getWorkshop2CertificationMarkCatalogParameters(): AttributeCatalogParameter[] {
  return getWorkshop2CertificationMarksSeed().map((m, i) => ({
    parameterId: m.id,
    label: m.labelRu,
    sortOrder: m.sortOrder ?? i,
  }));
}
