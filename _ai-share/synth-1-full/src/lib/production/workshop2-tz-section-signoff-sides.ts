import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2TzSignoffSide = 'brand' | 'tech';

/**
 * Какие подписи учитываются для секции ТЗ (ворота 4/4, handoff, вкладки).
 * Остальные стороны в данных могут быть, но для «секция подписана» не требуются.
 */
export const W2_SECTION_SIGNOFF_REQUIRED_SIDES: Partial<
  Record<Workshop2TzSignoffSectionKey, readonly Workshop2TzSignoffSide[]>
> = {
  /** Паспорт: продукт и технолог. */
  general: ['brand', 'tech'],
  /** Визуал: подтверждение со стороны бренда (дизайн / продакт). */
  visuals: ['brand'],
  /** Материалы и BOM: обе стороны. */
  material: ['brand', 'tech'],
  /** Конструкция, лекала, образец: технолог. */
  construction: ['tech'],
};

export function workshop2TzSectionSignoffRequiredSides(
  section: Workshop2TzSignoffSectionKey
): readonly Workshop2TzSignoffSide[] {
  return W2_SECTION_SIGNOFF_REQUIRED_SIDES[section] ?? ['brand', 'tech'];
}

export function workshop2TzSectionSignoffDoneTitle(section: Workshop2TzSignoffSectionKey): string {
  const sides = workshop2TzSectionSignoffRequiredSides(section);
  if (sides.includes('brand') && sides.includes('tech'))
    return 'Секция подписана брендом и технологом';
  if (sides.includes('brand')) return 'Секция подписана брендом';
  if (sides.includes('tech')) return 'Секция подписана технологом';
  return 'Секция подписана';
}

/** Кратко: кто обязан подписать секцию (для подсказок в UI). */
export function workshop2TzSectionSignoffRequiredRolesSummary(
  section: Workshop2TzSignoffSectionKey
): string {
  const sides = workshop2TzSectionSignoffRequiredSides(section);
  if (sides.includes('brand') && sides.includes('tech')) {
    return 'нужны бренд и технолог; в запись — ФИО и предприятие каждого (лишние роли не требуются).';
  }
  if (sides.includes('brand')) {
    return 'подписывает только представитель бренда (ФИО и предприятие).';
  }
  return 'подписывает только технолог (ФИО и предприятие).';
}
