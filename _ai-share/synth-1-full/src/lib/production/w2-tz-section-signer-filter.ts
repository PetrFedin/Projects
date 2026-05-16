import type { Workshop2TzDigitalSignoffRole } from '@/lib/production/workshop2-tz-digital-signoff';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

/**
 * Какие базовые роли (три направления ТЗ) ожидают подпись **в конкретном разделе** досье.
 * «Лишние» визуально не показываем, если пользователь в другом табе; этап «ТЗ» в паспорте по-прежнему
 * валидируется целиком при смене раздела / сохранении.
 */
const W2_TZ_SECTION_BASE_SIGNER_ROLES: Record<
  Workshop2TzSignoffSectionKey,
  readonly Workshop2TzDigitalSignoffRole[]
> = {
  general: ['designer', 'technologist', 'manager'],
  /** Визуал: владелец образа + исполнимость. */
  visuals: ['designer', 'technologist'],
  /** Материал / состав: согласование состава и условий. */
  material: ['designer', 'technologist', 'manager'],
  /** Конструкция и мерки: в первую очередь техконтур и владелец срока/объёма. */
  construction: ['technologist', 'manager'],
  /** Пакет в цех: согласование состава передачи. */
  assignment: ['designer', 'technologist', 'manager'],
  b2b_sales: ['manager'],
};

const EXTRA_ROLES_ON_SECTIONS: ReadonlySet<Workshop2TzSignoffSectionKey> = new Set<Workshop2TzSignoffSectionKey>([
  'general',
  'material',
  'assignment',
]);

export function w2TzDossierSectionShowsSignerBaseRole(
  section: Workshop2TzSignoffSectionKey,
  role: Workshop2TzDigitalSignoffRole
): boolean {
  return W2_TZ_SECTION_BASE_SIGNER_ROLES[section].includes(role);
}

export function w2TzDossierSectionShowsExtraSignerRow(section: Workshop2TzSignoffSectionKey): boolean {
  return EXTRA_ROLES_ON_SECTIONS.has(section);
}
