import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';
import type { W2SketchExportSurface } from '@/lib/production/workshop2-dossier-view-infrastructure';

/**
 * Отбор меток для PNG/PDF экспорта: merch_clean убирает тех/QC-типы с доски (номера на подложке).
 */
export function filterSketchAnnotationsForExportSurface(
  anns: Workshop2Phase1CategorySketchAnnotation[],
  leafId: string,
  surface: W2SketchExportSurface
): Workshop2Phase1CategorySketchAnnotation[] {
  const own = anns.filter((a) => a.categoryLeafId === leafId);
  const list = own.length ? own : anns;
  if (surface === 'workshop_floor' || surface === 'compliance_packet') return list;
  return list.filter((a) => {
    const t = a.annotationType;
    if (t === 'qc') return false;
    if (t === 'material' || t === 'hardware' || t === 'construction' || t === 'fit') return false;
    return true;
  });
}
