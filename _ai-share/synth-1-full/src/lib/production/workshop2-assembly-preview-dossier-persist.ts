/**
 * Wave 23 #13: зеркало assembly preview в досье (POM row count + T&A).
 */
import type { Workshop2ArticleAssemblyPreview } from '@/lib/production/workshop2-article-assembler';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2AssemblyPreviewMirror(input: {
  preview: Workshop2ArticleAssemblyPreview;
  categoryLeafId: string;
}): NonNullable<Workshop2DossierPhase1['assemblyPreviewMirror']> {
  return {
    mirroredAt: new Date().toISOString(),
    categoryLeafId: input.categoryLeafId,
    phase1AttributeCount: input.preview.phase1AttributeCount,
    pomTemplateRowCount: input.preview.pomTemplateRowCount,
    taTemplateId: input.preview.taTemplateId,
    scaleLabelRu: input.preview.scaleLabelRu,
    readyForCreate: input.preview.phase1AttributeCount > 0 && Boolean(input.preview.taTemplateId),
  };
}

export function persistWorkshop2AssemblyPreviewMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: { preview: Workshop2ArticleAssemblyPreview; categoryLeafId: string }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    assemblyPreviewMirror: buildWorkshop2AssemblyPreviewMirror(input),
  };
}

export function evaluateWorkshop2AssemblyPreviewMirrorGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.assemblyPreviewMirror;
  if (!mirror) {
    return {
      id: 'assembly.preview.mirror_missing',
      severity: 'warning',
      messageRu:
        'Снимок сборки артикула не в PG — пересохраните досье или откройте workspace заново.',
    };
  }
  if (!mirror.readyForCreate) {
    return {
      id: 'assembly.preview.not_ready',
      severity: 'warning',
      messageRu: 'Превью сборки неполное — проверьте категорию и матрицу атрибутов.',
    };
  }
  return null;
}
