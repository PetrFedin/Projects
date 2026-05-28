/**
 * Wave 28 P1: dev-console guard — предупреждение если маршрут без backend wiring.
 */
export type Workshop2RouteBackendMode = 'api' | 'static' | 'journal_only' | 'unknown';

/** В dev выводит warn если mode !== api (честный stub не считается dead-end). */
export function assertRouteHasBackend(
  routeLabel: string,
  mode: Workshop2RouteBackendMode,
  hintRu?: string
): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return;
  if (mode === 'api') return;
  const msg = `[W28 dead-end guard] ${routeLabel}: mode=${mode}${hintRu ? ` — ${hintRu}` : ''}`;
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(msg);
  }
}
