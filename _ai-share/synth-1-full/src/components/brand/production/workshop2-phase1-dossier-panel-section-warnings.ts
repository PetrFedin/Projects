import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import { collectWorkshop2VisualSectionWarnings } from '@/lib/production/workshop2-visual-section-warnings';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2SectionReadinessRow = {
  done: number;
  total: number;
  pct: number;
  status: string;
};

export function getSectionWarnings(
  section: DossierSection,
  dossier: Workshop2DossierPhase1,
  currentLeaf: HandbookCategoryLeaf,
  skuDraft: string,
  nameDraft: string,
  handbookWarnings: string[],
  sectionReadiness: Record<DossierSection, Workshop2SectionReadinessRow>
): string[] {
  if (section === 'general') {
    const warnings: string[] = [];
    const skuFromAssignment = dossier.assignments.some(
      (a) => a.attributeId === 'sku' && (a.values?.length ?? 0) > 0
    );
    const nameFromAssignment = dossier.assignments.some(
      (a) => a.attributeId === 'name' && (a.values?.length ?? 0) > 0
    );
    if (!skuDraft.trim() && !skuFromAssignment) {
      warnings.push('SKU еще не подтвержден.');
    }
    if (!nameDraft.trim() && !nameFromAssignment) {
      warnings.push('Нет рабочего названия модели.');
    }
    /** Замысел и рефы — в паспорте; эскиз — «Конструкция». */
    return warnings;
  }
  if (section === 'visuals') {
    return collectWorkshop2VisualSectionWarnings(dossier, currentLeaf);
  }
  if (section === 'material') {
    const warnings: string[] = [];
    if (!dossier.assignments.some((a) => a.attributeId === 'mat' && a.values.length > 0)) {
      warnings.push('Основной материал не выбран.');
    }
    if (!dossier.assignments.some((a) => a.attributeId === 'composition' && a.values.length > 0)) {
      warnings.push('Состав материала не подтвержден.');
    }
    return warnings;
  }
  if (section === 'construction') {
    const dimWarnings = handbookWarnings.filter(
      (warning) =>
        warning.includes('Размерная шкала') ||
        warning.includes('Табель мер') ||
        warning.includes('мерки') ||
        warning.includes('лимит') ||
        warning.includes('количеств по размерам')
    );
    const base =
      sectionReadiness.construction.done === 0
        ? ['Конструктивные параметры и табель мер ещё не закрыты.']
        : [];
    return [...base, ...dimWarnings];
  }
  if (section === 'assignment') {
    const ar = sectionReadiness.assignment;
    if (ar.pct < 100) {
      return ['Пакет для цеха ещё не закрыт по чеклисту «Задание» (скетч, ZIP, подписи, передача).'];
    }
    return [];
  }
  return [];
}
