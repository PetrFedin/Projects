import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';
import { isSketchDimensionLineAnnotation } from '@/lib/production/sketch-dimension-line';
import { normalizeLinkedTzPanelSectionForNav } from '@/lib/production/workshop2-visual-excellence';

export function newUuid(): string {
  return crypto.randomUUID();
}

export function readFileAsDataUrlLimited(
  file: File,
  maxChars: number
): Promise<string | undefined> {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result ?? '');
      resolve(s.length <= maxChars ? s : undefined);
    };
    fr.onerror = () => resolve(undefined);
    fr.readAsDataURL(file);
  });
}

export function normalizeAnnotation(
  annotation: Workshop2Phase1CategorySketchAnnotation
): Workshop2Phase1CategorySketchAnnotation {
  return {
    ...annotation,
    annotationType: annotation.annotationType ?? 'construction',
    priority: annotation.priority ?? 'important',
    status: annotation.status ?? 'new',
    stage: annotation.stage ?? 'tz',
  };
}

/** Приоритет/этап/зона ОТК в соответствии с выбором «Следующая метка» (клик по доске и быстрые зоны). */
export function priorityStageForNextPinPreset(
  annotationId: string,
  nextPinPreset: 'critical' | 'qc' | 'other'
): Partial<Workshop2Phase1CategorySketchAnnotation> {
  if (nextPinPreset === 'critical') {
    return { priority: 'critical', stage: 'tz', linkedQcZoneId: undefined };
  }
  if (nextPinPreset === 'qc') {
    return { priority: 'important', stage: 'qc', linkedQcZoneId: annotationId };
  }
  return { priority: 'important', stage: 'tz', linkedQcZoneId: undefined };
}

/** Проверки заполненности метки для health / «следующая неполная». */
export function collectCategorySketchPinValidationIssues(
  a: Workshop2Phase1CategorySketchAnnotation
): string[] {
  const issues: string[] = [];
  if (isSketchDimensionLineAnnotation(a)) {
    if (!(a.dimensionLabel ?? '').trim()) issues.push('нет подписи размера');
    if (!(a.dimensionValueText ?? '').trim()) issues.push('нет значения размера');
  } else if (!(a.text ?? '').trim()) {
    issues.push('нет текста');
  }
  if (!normalizeLinkedTzPanelSectionForNav(a.linkedTzSectionKey)) issues.push('нет раздела ТЗ');
  if (!(a.linkedBomLineRef ?? '').trim()) issues.push('нет BOM ref');
  if (!(a.owner ?? '').trim()) issues.push('нет ответственного');
  if (!(a.dueDate ?? '').trim()) issues.push('нет срока');
  return issues;
}
