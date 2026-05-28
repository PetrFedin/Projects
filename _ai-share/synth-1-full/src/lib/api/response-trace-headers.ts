/**
 * Общие заголовки трассировки для B2B/API-роутов (request id, режим, источник данных).
 */

import type { getRuntimeMode } from '@/lib/runtime-mode';

export const HEADER_DATA_SOURCE = 'x-data-source';

type RuntimeMode = ReturnType<typeof getRuntimeMode>;

export function apiTraceHeaders(
  requestId: string,
  mode: RuntimeMode,
  extra?: Record<string, string>
): Record<string, string> {
  return {
    'x-request-id': requestId,
    'x-runtime-mode': mode,
    ...extra,
  };
}
