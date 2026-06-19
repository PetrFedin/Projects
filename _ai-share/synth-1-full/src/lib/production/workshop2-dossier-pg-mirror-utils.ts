import type { Workshop2DossierPgMirror } from '@/lib/production/workshop2-dossier-phase1.types';

/** Read string field from a generic PG mirror blob. */
export function workshop2PgMirrorStr(
  mirror: Workshop2DossierPgMirror | undefined,
  key: string,
  fallback = ''
): string {
  const v = mirror?.[key];
  return typeof v === 'string' ? v : fallback;
}

/** Read number field from a generic PG mirror blob. */
export function workshop2PgMirrorNum(
  mirror: Workshop2DossierPgMirror | undefined,
  key: string,
  fallback = 0
): number {
  const v = mirror?.[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
