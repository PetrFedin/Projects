/**
 * Целевая модель связей sketch annotations ↔ атрибуты, задачи, fit, QC.
 *
 * Аннотация на скетче может быть связана с:
 * - attributeId → поле в досье (напр. «карман» → pocketOptions)
 * - taskId → производственная задача из subcategorySketchSlots
 * - bomLineRef → строка BOM / материал (PLM)
 * - fitIssueId → замечание по посадке (создаётся при fit-проверке)
 * - qcCheckpointId → контрольная точка ОТК (создаётся при QC-инспекции)
 *
 * Связи двусторонние: аннотация хранит ID, а мы можем восстановить обратный маршрут.
 */

import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchAnnotationType,
} from './workshop2-dossier-phase1.types';
import type {
  FitGoldSnapshot,
  QcSnapshot,
} from './article-workspace/types';

// ---------------------------------------------------------------------------
// 1. Canonical link record
// ---------------------------------------------------------------------------

export type SketchAnnotationLink = {
  annotationId: string;
  annotationType?: Workshop2SketchAnnotationType;
  text: string;
  xPct: number;
  yPct: number;
  linkedAttributeId?: string;
  linkedTaskId?: string;
  linkedBomLineRef?: string;
  linkedFitIssueId?: string;
  linkedQcCheckpointId?: string;
};

// ---------------------------------------------------------------------------
// 2. Resolve all links from dossier
// ---------------------------------------------------------------------------

export function resolveSketchLinks(
  dossier: Workshop2DossierPhase1
): SketchAnnotationLink[] {
  const annotations = dossier.categorySketchAnnotations ?? [];
  return annotations.map((a) => ({
    annotationId: a.annotationId,
    annotationType: a.annotationType,
    text: a.text,
    xPct: a.xPct,
    yPct: a.yPct,
    linkedAttributeId: a.linkedAttributeId,
    linkedTaskId: a.linkedTaskId,
    linkedBomLineRef: a.linkedBomLineRef,
    linkedFitIssueId: undefined,
    linkedQcCheckpointId: a.linkedQcZoneId,
  }));
}

// ---------------------------------------------------------------------------
// 3. Reverse lookup: find annotations linked to a specific entity
// ---------------------------------------------------------------------------

export function findAnnotationsForAttribute(
  dossier: Workshop2DossierPhase1,
  attributeId: string
): Workshop2Phase1CategorySketchAnnotation[] {
  return (dossier.categorySketchAnnotations ?? []).filter(
    (a) => a.linkedAttributeId === attributeId
  );
}

export function findAnnotationsForTask(
  dossier: Workshop2DossierPhase1,
  taskIdOrSlotId: string
): Workshop2Phase1CategorySketchAnnotation[] {
  return (dossier.categorySketchAnnotations ?? []).filter(
    (a) => a.linkedTaskId === taskIdOrSlotId
  );
}

export function findAnnotationsForQcZone(
  dossier: Workshop2DossierPhase1,
  qcZoneId: string
): Workshop2Phase1CategorySketchAnnotation[] {
  return (dossier.categorySketchAnnotations ?? []).filter(
    (a) => a.linkedQcZoneId === qcZoneId
  );
}

// ---------------------------------------------------------------------------
// 4. Propagation helpers: sketch → fit / QC
// ---------------------------------------------------------------------------

/**
 * Из fit-typed аннотаций генерирует начальные fit-комментарии.
 */
export function propagateAnnotationsToFit(
  dossier: Workshop2DossierPhase1
): { id: string; text: string; fromAnnotation: string }[] {
  const fitAnnotations = (dossier.categorySketchAnnotations ?? []).filter(
    (a) => a.annotationType === 'fit' || a.stage === 'sample'
  );
  return fitAnnotations.map((a) => ({
    id: `fit-from-${a.annotationId}`,
    text: `[Скетч] ${a.text}`,
    fromAnnotation: a.annotationId,
  }));
}

/**
 * Из qc-typed аннотаций генерирует контрольные зоны для ОТК.
 */
export function propagateAnnotationsToQc(
  dossier: Workshop2DossierPhase1
): { id: string; text: string; priority: string; fromAnnotation: string }[] {
  const qcAnnotations = (dossier.categorySketchAnnotations ?? []).filter(
    (a) => a.annotationType === 'qc' || a.stage === 'qc'
  );
  return qcAnnotations.map((a) => ({
    id: `qc-from-${a.annotationId}`,
    text: a.text,
    priority: a.priority ?? 'note',
    fromAnnotation: a.annotationId,
  }));
}

// ---------------------------------------------------------------------------
// 5. Link integrity check
// ---------------------------------------------------------------------------

export type LinkIntegrityIssue = {
  annotationId: string;
  issue: 'orphan_attribute' | 'orphan_task' | 'orphan_qc_zone';
  details: string;
};

/**
 * Проверяет целостность связей: находит аннотации, ссылающиеся
 * на несуществующие атрибуты, задачи или QC-зоны.
 */
export function checkLinkIntegrity(
  dossier: Workshop2DossierPhase1,
  knownAttributeIds: Set<string>,
  fitSnapshot?: FitGoldSnapshot | null,
  qcSnapshot?: QcSnapshot | null
): LinkIntegrityIssue[] {
  const issues: LinkIntegrityIssue[] = [];
  const annotations = dossier.categorySketchAnnotations ?? [];
  const subcategorySlotIds = new Set((dossier.subcategorySketchSlots ?? []).map((s) => s.slotId));

  for (const a of annotations) {
    if (a.linkedAttributeId && !knownAttributeIds.has(a.linkedAttributeId)) {
      issues.push({
        annotationId: a.annotationId,
        issue: 'orphan_attribute',
        details: `Атрибут ${a.linkedAttributeId} не найден в каталоге`,
      });
    }

    if (a.linkedTaskId && !subcategorySlotIds.has(a.linkedTaskId)) {
      issues.push({
        annotationId: a.annotationId,
        issue: 'orphan_task',
        details: `Слот производственной задачи «${a.linkedTaskId}» не найден в subcategorySketchSlots`,
      });
    }

    if (a.linkedQcZoneId && qcSnapshot) {
      const batchWithZone = qcSnapshot.batches.some(
        (b) => b.id === a.linkedQcZoneId
      );
      if (!batchWithZone) {
        issues.push({
          annotationId: a.annotationId,
          issue: 'orphan_qc_zone',
          details: `QC зона ${a.linkedQcZoneId} не найдена в batches`,
        });
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// 6. Annotation summary for handoff
// ---------------------------------------------------------------------------

export type AnnotationHandoffSummary = {
  totalAnnotations: number;
  byType: Record<string, number>;
  linkedToAttributes: number;
  linkedToTasks: number;
  fitAnnotations: number;
  qcAnnotations: number;
  unlinked: number;
};

export function summarizeAnnotationsForHandoff(
  dossier: Workshop2DossierPhase1
): AnnotationHandoffSummary {
  const annotations = dossier.categorySketchAnnotations ?? [];
  const byType: Record<string, number> = {};
  let linkedToAttributes = 0;
  let linkedToTasks = 0;
  let fitAnnotations = 0;
  let qcAnnotations = 0;
  let unlinked = 0;

  for (const a of annotations) {
    const t = a.annotationType ?? 'untyped';
    byType[t] = (byType[t] ?? 0) + 1;

    if (a.linkedAttributeId) linkedToAttributes++;
    if (a.linkedTaskId) linkedToTasks++;
    if (a.annotationType === 'fit' || a.stage === 'sample') fitAnnotations++;
    if (a.annotationType === 'qc' || a.stage === 'qc') qcAnnotations++;

    if (!a.linkedAttributeId && !a.linkedTaskId && !a.linkedQcZoneId) {
      unlinked++;
    }
  }

  return {
    totalAnnotations: annotations.length,
    byType,
    linkedToAttributes,
    linkedToTasks,
    fitAnnotations,
    qcAnnotations,
    unlinked,
  };
}
