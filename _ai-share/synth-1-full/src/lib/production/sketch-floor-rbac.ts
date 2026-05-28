import type { PlatformRole } from '@/lib/rbac';

/** Роли с ограниченным доступом к скетчу: только режим «цех» (просмотр/экспорт), без ТЗ-редактирования. */
const SKETCH_FLOOR_ONLY_ROLES: ReadonlySet<PlatformRole> = new Set<PlatformRole>([
  'manufacturer',
  'supplier',
]);

export function isSketchFloorOnlyRole(role: PlatformRole): boolean {
  return SKETCH_FLOOR_ONLY_ROLES.has(role);
}
