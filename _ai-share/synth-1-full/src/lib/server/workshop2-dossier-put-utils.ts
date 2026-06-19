/** Helpers for `putWorkshop2ServerDossierRecord` failure branches (version vs PG-only). */

export type Workshop2DossierPutFailure =
  | { ok: false; error: 'version_conflict'; currentVersion: number }
  | { ok: false; error: 'pg_only_required'; messageRu: string };

export function workshop2DossierPutFailureBody(put: Workshop2DossierPutFailure): {
  ok: false;
  error: string;
  currentVersion?: number;
  messageRu?: string;
} {
  if (put.error === 'version_conflict') {
    return { ok: false, error: 'version_conflict', currentVersion: put.currentVersion };
  }
  return { ok: false, error: put.error, messageRu: put.messageRu };
}

export function workshop2DossierPutFailureStatus(put: Workshop2DossierPutFailure): number {
  return put.error === 'pg_only_required' ? 503 : 409;
}

export function workshop2DossierPutFailureMessageRu(put: Workshop2DossierPutFailure): string {
  if (put.error === 'pg_only_required') return put.messageRu;
  return `Конфликт версий досье (текущая v${put.currentVersion}).`;
}
