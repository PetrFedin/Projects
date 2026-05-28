import type { Workshop2TzSignatoryBindings } from '@/lib/production/workshop2-dossier-phase1.types';

/**
 * Демо-значения, если в карточке артикула ещё не выбраны подписанты (миграция локального инвентаря).
 * Имена совпадают с `partnerTeams` / списком «Подписанты».
 */
const W2_DEFAULT_TZ_LABELS: Workshop2TzSignatoryBindings = {
  designerDisplayLabel: 'Виктория Белова',
  technologistDisplayLabel: 'Андрей Кузнецов',
  managerDisplayLabel: 'Артем Новиков',
};

/**
 * Для строки разработки без (или с неполными) `workshopTzSignatoryBindings` — подставить недостающие ФИО.
 */
export function applyDefaultWorkshopTzSignatoryBindings(
  b: Workshop2TzSignatoryBindings | undefined
): Workshop2TzSignatoryBindings {
  const cur = b ?? {};
  return {
    ...W2_DEFAULT_TZ_LABELS,
    ...cur,
    designerDisplayLabel:
      cur.designerDisplayLabel?.trim() || W2_DEFAULT_TZ_LABELS.designerDisplayLabel,
    technologistDisplayLabel:
      cur.technologistDisplayLabel?.trim() || W2_DEFAULT_TZ_LABELS.technologistDisplayLabel,
    managerDisplayLabel:
      cur.managerDisplayLabel?.trim() || W2_DEFAULT_TZ_LABELS.managerDisplayLabel,
    designerSignStages: cur.designerSignStages,
    technologistSignStages: cur.technologistSignStages,
    managerSignStages: cur.managerSignStages,
    extraAssigneeRows: cur.extraAssigneeRows,
  };
}
