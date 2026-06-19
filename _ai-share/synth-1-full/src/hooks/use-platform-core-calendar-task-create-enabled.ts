'use client';

import { useWorkshop2BackendStatusHint } from '@/components/brand/production/use-workshop2-backend-status-hint';

/** Создание user-task в календаре — только при live PostgreSQL (не memory/file). */
export function usePlatformCoreCalendarTaskCreateEnabled(active = true): boolean {
  const status = useWorkshop2BackendStatusHint(active);
  return status === 'server';
}
