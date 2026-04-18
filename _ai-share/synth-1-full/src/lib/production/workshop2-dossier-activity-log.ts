/**
 * Сводка изменений досье при сохранении — для журнала «История действий».
 */
import { getAttributeById } from '@/lib/production/attribute-catalog';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1AttributeAssignment,
} from '@/lib/production/workshop2-dossier-phase1.types';

const STRIP_KEYS = new Set([
  'tzActionLog',
  'updatedAt',
  'updatedBy',
  'designerSignoff',
  'technologistSignoff',
  'managerSignoff',
  'isVerifiedByDesigner',
  'isVerifiedByTechnologist',
  'isVerifiedByManager',
  'extraTzSignoffsByRowId',
  'sectionSignoffs',
]);

/** Убираем журнал, мета сохранения и подписи — они логируются отдельными записями. */
export function stripDossierForPersistDiff(d: Workshop2DossierPhase1): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(d)) {
    if (STRIP_KEYS.has(k)) continue;
    out[k] = v;
  }
  return out;
}

function stableStringify(o: unknown): string {
  return JSON.stringify(o);
}

function changedAttributeNames(
  before: Workshop2Phase1AttributeAssignment[],
  after: Workshop2Phase1AttributeAssignment[]
): string[] {
  const key = (a: Workshop2Phase1AttributeAssignment) =>
    `${a.kind}:${a.attributeId ?? a.assignmentId}`;
  const bm = new Map(before.map((a) => [key(a), a]));
  const am = new Map(after.map((a) => [key(a), a]));
  const names = new Set<string>();
  for (const k of new Set([...bm.keys(), ...am.keys()])) {
    const x = bm.get(k);
    const y = am.get(k);
    if (stableStringify(x) === stableStringify(y)) continue;
    const aid = y?.attributeId ?? x?.attributeId;
    if (aid) {
      names.add(getAttributeById(aid)?.name ?? aid);
    } else if (x?.kind === 'custom_proposed' || y?.kind === 'custom_proposed') {
      names.add('Пользовательское поле');
    }
  }
  return [...names];
}

const MAX_ATTR_LINES = 10;

/**
 * Человекочитаемые строки для одной записи журнала при сохранении досье.
 */
export function summarizeWorkshop2PersistDiff(
  before: Workshop2DossierPhase1,
  after: Workshop2DossierPhase1
): string[] {
  if (
    stableStringify(stripDossierForPersistDiff(before)) ===
    stableStringify(stripDossierForPersistDiff(after))
  ) {
    return [];
  }

  const out: string[] = [];

  if (before.selectedAudienceId !== after.selectedAudienceId) {
    out.push('Аудитория (сегмент)');
  }
  if (before.isUnisex !== after.isUnisex) {
    out.push(`Унисекс: ${after.isUnisex ? 'да' : 'нет'}`);
  }
  if ((before.brandNotes ?? '').trim() !== (after.brandNotes ?? '').trim()) {
    out.push('Дизайнерский замысел (текст)');
  }
  if (stableStringify(before.visualReferences) !== stableStringify(after.visualReferences)) {
    const n = after.visualReferences?.length ?? 0;
    out.push(`Визуальные референсы (${n} шт.)`);
  }
  const hadSketch = Boolean(before.categorySketchImageDataUrl);
  const hasSketch = Boolean(after.categorySketchImageDataUrl);
  if (hadSketch !== hasSketch) {
    out.push(hasSketch ? 'Основной эскиз: добавлен' : 'Основной эскиз: убран');
  }
  if (
    stableStringify(before.categorySketchAnnotations) !==
    stableStringify(after.categorySketchAnnotations)
  ) {
    out.push('Метки на эскизе');
  }
  if (stableStringify(before.techPackAttachments) !== stableStringify(after.techPackAttachments)) {
    out.push(`Вложения tech pack (${after.techPackAttachments?.length ?? 0} шт.)`);
  }
  if (
    stableStringify(before.subcategorySketchSlots) !== stableStringify(after.subcategorySketchSlots)
  ) {
    out.push('Мини-скетчи по узлам ветки (линия / группа / модель) / задачи цеха');
  }
  if (stableStringify(before.sketchSheets) !== stableStringify(after.sketchSheets)) {
    const n = after.sketchSheets?.length ?? 0;
    out.push(`Скетч-листы (${n} шт.)`);
  }
  if (before.sampleSizeScaleId !== after.sampleSizeScaleId) {
    out.push('Размерная шкала образца');
  }
  if (
    stableStringify(before.sampleBasePerSizeDimensions) !==
    stableStringify(after.sampleBasePerSizeDimensions)
  ) {
    out.push('Табель мер / габариты по размерам');
  }
  if (before.sampleBaseDimensionRangeMode !== after.sampleBaseDimensionRangeMode) {
    out.push('Режим мин–макс по меркам');
  }
  if (
    stableStringify(before.sampleBasePerSizeDimensionRanges) !==
    stableStringify(after.sampleBasePerSizeDimensionRanges)
  ) {
    out.push('Диапазоны мерок');
  }
  if (
    stableStringify(before.sampleBasePerSizePieceQty) !==
    stableStringify(after.sampleBasePerSizePieceQty)
  ) {
    out.push('Количество шт по размерам (табель)');
  }
  if (
    stableStringify(before.sampleBaseExtraDimensions) !==
    stableStringify(after.sampleBaseExtraDimensions)
  ) {
    out.push('Дополнительные мерки');
  }
  if (stableStringify(before.optionalNote) !== stableStringify(after.optionalNote)) {
    out.push('Примечание к досье');
  }
  if (stableStringify(before.tzSignatoryBindings) !== stableStringify(after.tzSignatoryBindings)) {
    out.push('Закрепление подписантов ТЗ по артикулу');
  }
  if (
    stableStringify(before.materialComplianceChecklist) !==
    stableStringify(after.materialComplianceChecklist)
  ) {
    out.push('Чеклист комплаенса материалов (хаб BOM)');
  }
  if (
    stableStringify(before.visualReadinessChecklist) !==
    stableStringify(after.visualReadinessChecklist)
  ) {
    out.push('Чеклист готовности визуала (менеджер / досье)');
  }

  if (stableStringify(before.assignments) !== stableStringify(after.assignments)) {
    const names = changedAttributeNames(before.assignments, after.assignments);
    if (names.length === 0) {
      out.push('Атрибуты ТЗ (состав назначений)');
    } else if (names.length <= MAX_ATTR_LINES) {
      for (const n of names) {
        out.push(`Атрибут «${n}»`);
      }
    } else {
      out.push(
        `Атрибуты ТЗ: изменено полей — ${names.length} (в т.ч. «${names.slice(0, 3).join('», «')}» …)`
      );
    }
  }

  return out;
}
