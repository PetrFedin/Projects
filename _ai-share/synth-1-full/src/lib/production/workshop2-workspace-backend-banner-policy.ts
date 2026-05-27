/**
 * Wave Y — единый banner PG/API деградации в workspace (§ catalog #7, dedup с persist footer).
 */
import type { Workshop2BackendStatus } from '@/components/brand/production/use-workshop2-backend-status-hint';

/** Показывать верхний Workshop2BackendStatusBanner в workspace article page. */
export function shouldShowWorkshop2WorkspaceBackendBanner(status: Workshop2BackendStatus): boolean {
  return status === 'pg_disabled' || status === 'offline';
}

/** Не дублировать PG-off подсказку в footer persist — banner уже объясняет режим. */
export function shouldSuppressWorkshop2WorkspacePgPersistHint(
  status: Workshop2BackendStatus
): boolean {
  return shouldShowWorkshop2WorkspaceBackendBanner(status);
}
