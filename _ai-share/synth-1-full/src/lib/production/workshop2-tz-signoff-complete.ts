/**
 * Цифровые подписи секций ТЗ (бренд + технолог) — чистые функции для `lib/production`.
 *
 * Используются: `calculateWorkshopTzSectionCompletion` (вкл. четыре ворота «Задание»),
 * `fourTzLevelsFullySignedByAll` / `Workshop2TechPackHandoffBlock` в `Workshop2Phase1DossierPanel`,
 * чеклист «Секции ТЗ — N из 4», `isWorkshop2TzSectionTabDoneForUi` (галочка на вкладке).
 * Должны давать один и тот же результат, что и реэкспорт из `Workshop2TzSectionTabIndicator`.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2DossierSectionSignoffs,
  Workshop2DossierSignoffMeta,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { workshopTzSignerAllowed } from '@/lib/production/workshop2-tz-signatory-options';
import { workshop2TzSectionSignoffRequiredSides } from '@/lib/production/workshop2-tz-section-signoff-sides';

/**
 * Сторона «подтверждена» в UI и воротах: ФИО, время и `signatureDigest` (фиксация кликом «Подтвердить»).
 * Записи только с by/at без дайджеста — устаревший формат, не показываем как «Подтверждено».
 */
export function workshop2TzSignoffMetaIsCommitted(m: Workshop2DossierSignoffMeta | undefined): boolean {
  const by = m?.by?.trim() ?? '';
  const at = m?.at?.trim() ?? '';
  const dig = m?.signatureDigest?.trim() ?? '';
  return by.length > 0 && at.length > 0 && dig.length > 0;
}

/**
 * Подпись секции совпадает с закреплённым в паспорте подписантом для этой стороны.
 * Если в паспорте никого не закрепили — не отклоняем старые записи (обратная совместимость).
 */
export function workshop2TzSectionSignoffMetaPassportAligned(
  meta: Workshop2DossierSignoffMeta | undefined,
  passportAssigneeName: string | undefined,
  passportMissing: boolean
): boolean {
  if (!workshop2TzSignoffMetaIsCommitted(meta)) return true;
  if (passportMissing) return true;
  const p = passportAssigneeName?.trim() ?? '';
  if (!p) return true;
  const by = meta?.by?.trim() ?? '';
  if (!by) return false;
  return workshopTzSignerAllowed(by, p);
}

/**
 * Все требуемые подписи есть **и** ФИО в записи совпадают с закреплёнными в `tzSignatoryBindings` (бренд → дизайнер, технолог → технолог).
 */
export function isWorkshop2TzSectionFullySignedWithPassport(
  section: Workshop2TzSignoffSectionKey,
  signoffs: Workshop2DossierSectionSignoffs | undefined,
  dossier: Workshop2DossierPhase1
): boolean {
  const row = signoffs?.[section];
  const sides = workshop2TzSectionSignoffRequiredSides(section);
  const b = dossier.tzSignatoryBindings;
  const brandName = b?.designerDisplayLabel?.trim() ?? '';
  const techName = b?.technologistDisplayLabel?.trim() ?? '';
  for (const side of sides) {
    const meta: Workshop2DossierSignoffMeta | undefined = row?.[side];
    if (!workshop2TzSignoffMetaIsCommitted(meta)) return false;
    if (side === 'brand') {
      if (
        !workshop2TzSectionSignoffMetaPassportAligned(meta, brandName || undefined, !brandName)
      ) {
        return false;
      }
    }
    if (side === 'tech') {
      if (!workshop2TzSectionSignoffMetaPassportAligned(meta, techName || undefined, !techName)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * @param section — вкладка ТЗ (`general`…`assignment`).
 * @param signoffs — `dossier.sectionSignoffs`; отсутствие секции трактуется как неподписано.
 * @returns true, если все **требуемые для секции** стороны (`brand` / `tech`) имеют валидные мета-поля.
 */
export function isWorkshop2TzSectionFullySigned(
  section: Workshop2TzSignoffSectionKey,
  signoffs: Workshop2DossierSectionSignoffs | undefined
): boolean {
  const row = signoffs?.[section];
  const sides = workshop2TzSectionSignoffRequiredSides(section);
  for (const side of sides) {
    const meta: Workshop2DossierSignoffMeta | undefined = row?.[side];
    if (!workshop2TzSignoffMetaIsCommitted(meta)) return false;
  }
  return true;
}
