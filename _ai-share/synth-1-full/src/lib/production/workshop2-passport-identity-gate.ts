/**
 * Gate паспорта: identity + brief до заказа образца (не только banner).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { summarizeWorkshop2PassportIdentityStatus } from '@/lib/production/workshop2-passport-identity-status';

export const WORKSHOP2_PASSPORT_IDENTITY_MIN_BRIEF_FIELDS = 3;

export function evaluateWorkshop2PassportIdentityGate(input: {
  dossier: Workshop2DossierPhase1;
  articleSkuDraft?: string;
  articleNameDraft?: string;
}): Workshop2HandoffReadinessCheck | null {
  const status = summarizeWorkshop2PassportIdentityStatus(input);
  if (status.state === 'ready') return null;

  return {
    id: 'passport.identity.incomplete',
    severity: 'blocker',
    messageRu:
      status.hintRu ??
      'Заполните паспорт: категория, SKU, название, аудитория и brief перед заказом образца.',
  };
}

/** Снимок валидации для persist в досье (аудит wave 17). */
export function buildWorkshop2PassportIdentityValidationRecord(input: {
  dossier: Workshop2DossierPhase1;
  articleSkuDraft?: string;
  articleNameDraft?: string;
}): {
  validatedAt: string;
  state: 'ready' | 'partial' | 'empty';
  hintRu?: string;
} {
  const status = summarizeWorkshop2PassportIdentityStatus(input);
  return {
    validatedAt: new Date().toISOString(),
    state: status.state,
    hintRu: status.hintRu,
  };
}
