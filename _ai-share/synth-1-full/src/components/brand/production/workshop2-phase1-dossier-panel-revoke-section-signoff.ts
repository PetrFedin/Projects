import type { Dispatch, SetStateAction } from 'react';
import {
  canRevokeTzSignoff,
  pushTzActionLog,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import { W2_SECTION_SIGNOFF_PCT_THRESHOLD } from '@/components/brand/production/Workshop2TzSectionTabIndicator';
import type {
  Workshop2DossierPhase1,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE } from '@/lib/production/workshop2-tz-rbac-hints';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export type RevokeSectionSignoffDeps = {
  tzWriteDisabled: boolean;
  toast: ToastFn;
  sectionReadinessUi: Record<Workshop2TzSignoffSectionKey, { pct: number }>;
  updatedByLabel: string;
  tzRevokersEffective: readonly string[];
  onTzRevokeDenied: () => void;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  persist: (d: Workshop2DossierPhase1) => void;
};

/** Снятие подтверждения секции ТЗ (brand / tech). */
export function revokeSectionSignoffAction(
  deps: RevokeSectionSignoffDeps,
  section: Workshop2TzSignoffSectionKey,
  role: 'brand' | 'tech'
): void {
  const {
    tzWriteDisabled,
    toast,
    sectionReadinessUi,
    updatedByLabel,
    tzRevokersEffective,
    onTzRevokeDenied,
    setDossier,
    persist,
  } = deps;

  if (tzWriteDisabled) {
    toast({
      title: 'Снятие недоступно',
      description: W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE,
      variant: 'destructive',
    });
    return;
  }
  const pct = sectionReadinessUi[section]?.pct ?? 0;
  const sectionSignoffStale = pct < W2_SECTION_SIGNOFF_PCT_THRESHOLD[section];
  if (!canRevokeTzSignoff(updatedByLabel, tzRevokersEffective) && !sectionSignoffStale) {
    onTzRevokeDenied();
    return;
  }
  setDossier((prev: Workshop2DossierPhase1) => {
    const removedOrg = prev.sectionSignoffs?.[section]?.[role]?.byOrganization?.trim();
    const prevSec = { ...(prev.sectionSignoffs?.[section] ?? {}) };
    delete prevSec[role];
    const nextRoot = { ...(prev.sectionSignoffs ?? {}) };
    if (Object.keys(prevSec).length === 0) {
      delete nextRoot[section];
    } else {
      nextRoot[section] = prevSec;
    }
    const cleaned = Object.keys(nextRoot).length > 0 ? nextRoot : undefined;
    const next = pushTzActionLog({ ...prev, sectionSignoffs: cleaned }, updatedByLabel, {
      type: 'section_signoff',
      section,
      role,
      set: false,
      signerOrganization: removedOrg,
    });
    persist(next);
    return next;
  });
}
