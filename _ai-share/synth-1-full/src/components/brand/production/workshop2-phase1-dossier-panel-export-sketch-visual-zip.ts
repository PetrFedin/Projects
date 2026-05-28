import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  defaultSketchExportSurfaceForDossierView,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import { exportSketchVisualBundle } from '@/lib/production/sketch-visual-bundle-export';
import { buildWorkshop2VisualGateItems } from '@/lib/production/workshop2-visual-section-warnings';

export type SketchVisualZipExportResult = 'exported' | 'aborted' | 'error';

/** Подтверждение при открытых визуальных воротах, затем экспорт ZIP скетча/визуала. */
export async function exportSketchVisualZipWithGates(opts: {
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  dossierViewProfile: Workshop2DossierViewProfile;
  skuDraft: string;
}): Promise<SketchVisualZipExportResult> {
  const openVisualGates = buildWorkshop2VisualGateItems(opts.dossier, opts.currentLeaf).length;
  if (openVisualGates > 0) {
    const ok = window.confirm(
      `Визуальный контур не закрыт (${openVisualGates} ${openVisualGates === 1 ? 'пункт' : 'пункта'}). Экспорт может увести в цех неполный пакет. Продолжить?`
    );
    if (!ok) return 'aborted';
  }
  try {
    await exportSketchVisualBundle({
      dossier: opts.dossier,
      leafId: opts.currentLeaf.leafId,
      pathLabel: opts.currentLeaf.pathLabel,
      articleSku: opts.skuDraft,
      articlePageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      exportSurface: defaultSketchExportSurfaceForDossierView(opts.dossierViewProfile),
    });
    return 'exported';
  } catch {
    return 'error';
  }
}
