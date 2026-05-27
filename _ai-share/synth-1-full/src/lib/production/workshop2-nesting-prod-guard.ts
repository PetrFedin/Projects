/**
 * Wave 41 #63: в production без NESTING_API_URL — stub sim отключён (fail-closed).
 */
import { resolveWorkshop2NestingApiUrl } from '@/lib/production/workshop2-nesting-request';

export function isWorkshop2NestingProductionMode(
  nodeEnv?: string,
  env?: Record<string, string | undefined>
): boolean {
  const n =
    nodeEnv ?? env?.NODE_ENV ?? (typeof process !== 'undefined' ? process.env.NODE_ENV : '');
  return n === 'production';
}

export function workshop2NestingLocalHeuristicAllowed(
  env?: Record<string, string | undefined>
): boolean {
  if (resolveWorkshop2NestingApiUrl(env)) return true;
  return !isWorkshop2NestingProductionMode(undefined, env);
}

export function isWorkshop2NestingProdStubDisabled(
  env?: Record<string, string | undefined>
): boolean {
  return !workshop2NestingLocalHeuristicAllowed(env);
}
