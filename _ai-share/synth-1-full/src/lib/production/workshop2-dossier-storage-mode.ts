import type { Workshop2DossierStorageTarget } from '@/lib/production/workshop2-dossier-phase1.types';

/**
 * Целевой контур хранения досье. Пока персист только в браузере — флаг влияет на подсказки UI.
 * `NEXT_PUBLIC_W2_DOSSIER_TARGET=server` — планируется серверное досье (API).
 */
export function getWorkshop2ClientDossierStorageTarget(): Workshop2DossierStorageTarget {
  if (typeof process === 'undefined') return 'browser_local';
  const v = String(process.env.NEXT_PUBLIC_W2_DOSSIER_TARGET ?? '').toLowerCase();
  return v === 'server' ? 'server_target' : 'browser_local';
}
