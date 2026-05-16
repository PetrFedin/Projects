import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { Workshop2Phase1AttributeAssignment } from '@/lib/production/workshop2-dossier-phase1.types';

const FIELD_DEFER_STORAGE_PREFIX = 'synth.w2.fieldDeferral.v1';

export function w2FieldDeferralStorageKey(collectionId: string, articleId: string): string {
  return `${FIELD_DEFER_STORAGE_PREFIX}:${String(collectionId).trim()}:${String(articleId).trim()}`;
}

export function loadW2FieldDeferralSet(collectionId: string, articleId: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(w2FieldDeferralStorageKey(collectionId, articleId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string' && x.length > 0));
  } catch {
    return new Set();
  }
}

export function saveW2FieldDeferralSet(
  collectionId: string,
  articleId: string,
  ids: Set<string>
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      w2FieldDeferralStorageKey(collectionId, articleId),
      JSON.stringify([...ids])
    );
  } catch {
    // ignore
  }
}

/** Согласовано с `Workshop2Phase1DossierPanel` — значение в досье считается введённым. */
export function canonicalPhaseAssignmentFilled(
  assignment: Workshop2Phase1AttributeAssignment | undefined,
  attr: AttributeCatalogAttribute
): boolean {
  if (!assignment || assignment.kind !== 'canonical') return false;
  const hb = assignment.values.filter((v) => v.valueSource === 'handbook_parameter').length;
  const hasFree = assignment.values.some(
    (v) => v.valueSource === 'free_text' && (v.text?.trim()?.length ?? 0) > 0
  );
  if (attr.type === 'text' && attr.parameters.length === 0) {
    return hasFree;
  }
  if (attr.allowMultipleDistinct || attr.type === 'multiselect') {
    return hb > 0 || (!!attr.allowFreeText && hasFree);
  }
  return hb > 0 || (!!attr.allowFreeText && hasFree);
}

function firstFreeTextTrimmed(assignment: Workshop2Phase1AttributeAssignment | undefined): string {
  if (!assignment || assignment.kind !== 'canonical') return '';
  for (const v of assignment.values) {
    if (v.valueSource === 'free_text' && (v.text?.trim() ?? '') !== '') {
      return (v.text ?? '').trim();
    }
  }
  return '';
}

/** Длина/формат цифр в свободном вводе для `type: number` (EAN, ТН ВЭД и т.д.). */
export function numberFreeTextValidForField(attr: AttributeCatalogAttribute, digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  const id = attr.attributeId.toLowerCase();
  if (
    id.includes('ean') ||
    id.includes('gtin') ||
    id.includes('barcode') ||
    id.includes('штрихкод') ||
    id.includes('gln')
  ) {
    return [8, 12, 13, 14].includes(digits.length);
  }
  if (id.includes('tnved') || id.includes('тнвэд') || id === 'tnved' || id.includes('hs-10')) {
    return digits.length === 10;
  }
  if (id.includes('okpd') || id.includes('okp')) {
    return digits.length >= 4 && digits.length <= 12;
  }
  return digits.length > 0;
}

/** «Заполненность» для числового поля: справочник ИЛИ корректная длина цифр в свободном вводе. */
export function numberFieldContentValidForLabel(
  attr: AttributeCatalogAttribute,
  assignment: Workshop2Phase1AttributeAssignment | undefined
): boolean {
  if (attr.type !== 'number') return false;
  if (!assignment || assignment.kind !== 'canonical') return false;
  const hb = assignment.values.filter((v) => v.valueSource === 'handbook_parameter').length;
  if (hb > 0) return true;
  const t = firstFreeTextTrimmed(assignment);
  if (!t) return false;
  return numberFreeTextValidForField(attr, t);
}

/**
 * Состояние поля для цвета подписи и границы: для `number` строже, чем «есть какой-то ввод».
 */
export function phase1FieldSatisfiedForUi(
  attr: AttributeCatalogAttribute,
  assignment: Workshop2Phase1AttributeAssignment | undefined
): boolean {
  if (attr.type === 'number') {
    return numberFieldContentValidForLabel(attr, assignment);
  }
  return canonicalPhaseAssignmentFilled(assignment, attr);
}

export function fieldAttributeNameClassName(
  attr: AttributeCatalogAttribute,
  assignment: Workshop2Phase1AttributeAssignment | undefined,
  isDeferred: boolean,
  tzPhase: '1' | '2' | '3' = '1'
): string {
  if (isDeferred) {
    return 'text-text-secondary';
  }
  if (phase1FieldSatisfiedForUi(attr, assignment)) {
    return 'text-emerald-700';
  }
  const requiredForStep =
    tzPhase === '1' ? Boolean(attr.requiredForPhase1) : Boolean(attr.requiredForPhase2);
  if (!requiredForStep) {
    return 'text-text-primary';
  }
  return 'text-red-600';
}

/**
 * Паспорт «Карточка артикула»: подпись атрибута зелёная при заполнении, красная при пустом
 * (включая необязательные поля). «Позже» — нейтральный серый.
 */
export function fieldAttributeNameClassNameStrict(
  attr: AttributeCatalogAttribute,
  assignment: Workshop2Phase1AttributeAssignment | undefined,
  isDeferred: boolean
): string {
  if (isDeferred) {
    return 'text-text-secondary';
  }
  if (phase1FieldSatisfiedForUi(attr, assignment)) {
    return 'text-emerald-700';
  }
  return 'text-red-600';
}
