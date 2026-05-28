import type { Workshop2SectionReadinessRow } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-warnings';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type BuildControlPointsCtx = {
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  skuDraft: string;
  nameDraft: string;
  handbookWarnings: string[];
  sectionReadiness: Record<DossierSection, Workshop2SectionReadinessRow>;
  selectedAudienceLabel: string;
  hasAssignmentValue: (attributeId: string) => boolean;
};

/** Чекпоинты секции — та же логика, что у полосы контроля в центральной колонке. */
export function buildSectionControlPoints(
  section: DossierSection,
  ctx: BuildControlPointsCtx
): { label: string; done: boolean }[] {
  const {
    dossier,
    currentLeaf,
    skuDraft,
    nameDraft,
    handbookWarnings,
    sectionReadiness,
    selectedAudienceLabel,
    hasAssignmentValue,
  } = ctx;
  const secDone = sectionReadiness[section].done;

  switch (section) {
    case 'general': {
      const pb = dossier.passportProductionBrief;
      return [
        { label: 'Аудитория выбрана', done: Boolean(selectedAudienceLabel) },
        { label: 'Категория 1 / 2 / 3 подтверждена', done: Boolean(currentLeaf.pathLabel) },
        { label: 'SKU подтвержден', done: Boolean(skuDraft.trim()) },
        { label: 'Рабочее название модели есть', done: Boolean(nameDraft.trim()) },
        {
          label: 'Администратор модели (карточка артикула)',
          done: Boolean(pb?.articleCardOwnerName?.trim()),
        },
        {
          label: 'Тип запуска (цех / КНП / смешанный)',
          done: Boolean(pb?.plannedLaunchType && pb.plannedLaunchType !== 'undecided'),
        },
        {
          label: 'Срок образца / пилота',
          done: Boolean(pb?.targetSampleOrPilotDate?.trim()),
        },
        {
          label: 'Критичность срока (жёстко / гибко)',
          done: pb?.deadlineCriticality === 'hard' || pb?.deadlineCriticality === 'flexible',
        },
      ];
    }
    case 'visuals':
      return [
        {
          label: 'Основной эскиз собран',
          done: Boolean(
            dossier.categorySketchImageDataUrl ||
            (dossier.categorySketchAnnotations?.length ?? 0) > 0
          ),
        },
        {
          label: 'Есть метки на скетче',
          done: (dossier.categorySketchAnnotations?.length ?? 0) > 0,
        },
        { label: 'Замысел в паспорте', done: Boolean(dossier.brandNotes?.trim()) },
        { label: 'Референсы добавлены', done: (dossier.visualReferences?.length ?? 0) > 0 },
      ];
    case 'material':
      return [
        { label: 'Основной материал выбран', done: hasAssignmentValue('mat') },
        { label: 'Состав подтвержден', done: hasAssignmentValue('composition') },
        {
          label: 'Подкладка / дублирование описаны',
          done: hasAssignmentValue('lining') || hasAssignmentValue('fusing'),
        },
        {
          label: 'Критичные material notes учтены',
          done: hasAssignmentValue('fabric_weight') || hasAssignmentValue('lining_composition'),
        },
        { label: 'Тип упаковки указан', done: hasAssignmentValue('packaging') },
        { label: 'Маркировка описана', done: hasAssignmentValue('labeling') },
        { label: 'Штрихкод / кодировка указаны', done: hasAssignmentValue('barcode') },
      ];
    case 'construction':
      return [
        { label: 'Размерная шкала выбрана', done: Boolean(dossier.sampleSizeScaleId) },
        { label: 'Базовый размер выбран', done: hasAssignmentValue('sampleBaseSize') },
        {
          label: 'Табель мер заполнен',
          done: Boolean(
            dossier.sampleBasePerSizeDimensions &&
            Object.keys(dossier.sampleBasePerSizeDimensions).length > 0
          ),
        },
        {
          label: 'Нет критичных пропусков по меркам справочника',
          done: !handbookWarnings.some(
            (warning) => warning.includes('мерки') || warning.includes('Табель мер')
          ),
        },
        {
          label: 'Силуэт / посадка описаны',
          done: hasAssignmentValue('silh') || hasAssignmentValue('fit_type'),
        },
        {
          label: 'Ключевые узлы зафиксированы',
          done:
            hasAssignmentValue('closure') ||
            hasAssignmentValue('pocket') ||
            hasAssignmentValue('neck') ||
            hasAssignmentValue('sleeve'),
        },
        {
          label: 'Есть tech pack / ссылка на лекала',
          done: hasAssignmentValue('techPackRef') || (dossier.techPackAttachments?.length ?? 0) > 0,
        },
        { label: 'Раздел не пустой', done: secDone > 0 },
      ];
    default:
      return [];
  }
}
