import type { Dispatch, SetStateAction } from 'react';
import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import { SECTION_LABEL_BY_ID } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import { W2_SECTION_SIGNOFF_PCT_THRESHOLD } from '@/components/brand/production/Workshop2TzSectionTabIndicator';
import { computeWorkshop2TzSignatureDigest } from '@/lib/production/workshop2-tz-digital-signoff';
import type {
  Workshop2DossierPhase1,
  Workshop2TzSignatoryBindings,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE } from '@/lib/production/workshop2-tz-rbac-hints';
import { workshopTzSignerAllowed } from '@/lib/production/workshop2-tz-signatory-options';
import { workshop2TzSectionSignoffByLabelMeaningful } from '@/lib/production/workshop2-tz-signoff-actor';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export type CommitSectionSignoffDeps = {
  tzWriteDisabled: boolean;
  toast: ToastFn;
  sectionReadinessUi: Record<Workshop2TzSignoffSectionKey, { pct: number }>;
  sectionGateErrorsById: Record<Workshop2TzSignoffSectionKey, readonly string[] | undefined>;
  sectionSignoffOrganizationLabel: string;
  updatedByLabel: string;
  tzSignatoryBindings: Workshop2TzSignatoryBindings | undefined;
  collectionId: string;
  articleId: string;
  articleSku: string;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  persist: (d: Workshop2DossierPhase1) => void;
};

/** Подтверждение секции ТЗ (brand / tech) с записью в журнал. */
export function commitSectionSignoffAction(
  deps: CommitSectionSignoffDeps,
  section: Workshop2TzSignoffSectionKey,
  role: 'brand' | 'tech'
): void {
  const {
    tzWriteDisabled,
    toast,
    sectionReadinessUi,
    sectionGateErrorsById,
    sectionSignoffOrganizationLabel,
    updatedByLabel,
    tzSignatoryBindings,
    collectionId,
    articleId,
    articleSku,
    setDossier,
    persist,
  } = deps;

  if (tzWriteDisabled) {
    toast({
      title: 'Подтверждение недоступно',
      description: W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE,
      variant: 'destructive',
    });
    return;
  }
  const pct = sectionReadinessUi[section]?.pct ?? 0;
  const pctMin = W2_SECTION_SIGNOFF_PCT_THRESHOLD[section];
  if (pct < pctMin) {
    const label = SECTION_LABEL_BY_ID[section];
    toast({
      title: 'Подтверждение секции недоступно',
      description: `Сначала доведите заполнение раздела «${label}» до не менее ${pctMin}% (сейчас ${pct}%).`,
      variant: 'destructive',
    });
    return;
  }
  const sectionGateErrors = sectionGateErrorsById[section] ?? [];
  if (sectionGateErrors.length > 0) {
    toast({
      title: 'Подтверждение секции недоступно',
      description: `Исправьте ошибки раздела «${SECTION_LABEL_BY_ID[section]}»: ${sectionGateErrors
        .slice(0, 2)
        .join(' ')}`,
      variant: 'destructive',
    });
    return;
  }
  const at = new Date().toISOString();
  const by = updatedByLabel.slice(0, 120);
  const orgForSign = sectionSignoffOrganizationLabel.trim().slice(0, 200);
  if (!workshop2TzSectionSignoffByLabelMeaningful(updatedByLabel)) {
    toast({
      title: 'Подтверждение секции недоступно',
      description:
        'Укажите отображаемое имя в профиле (ФИО) и войдите в аккаунт — без имени подпись не фиксируется.',
      variant: 'destructive',
    });
    return;
  }
  if (!orgForSign) {
    toast({
      title: 'Подтверждение секции недоступно',
      description:
        'Не задано предприятие для строки подписи (бренд в профиле или значение среды кабинета).',
      variant: 'destructive',
    });
    return;
  }
  const b = tzSignatoryBindings;
  if (role === 'brand') {
    const designated = b?.designerDisplayLabel?.trim() ?? '';
    if (!designated) {
      toast({
        title: 'Подтверждение недоступно',
        description:
          'В паспорте артикула не закреплён подписант бренда — откройте «Подписанты» и назначьте ответственного.',
        variant: 'destructive',
      });
      return;
    }
    if (!workshopTzSignerAllowed(updatedByLabel, designated)) {
      toast({
        title: 'Подтверждение недоступно',
        description: `Секцию «${SECTION_LABEL_BY_ID[section]}» со стороны бренда может подтвердить только закреплённый в паспорте: ${designated}.`,
        variant: 'destructive',
      });
      return;
    }
  }
  if (role === 'tech') {
    const designated = b?.technologistDisplayLabel?.trim() ?? '';
    if (!designated) {
      toast({
        title: 'Подтверждение недоступно',
        description:
          'В паспорте не закреплён технолог — укажите в «Подписантах» карточки артикула.',
        variant: 'destructive',
      });
      return;
    }
    if (!workshopTzSignerAllowed(updatedByLabel, designated)) {
      toast({
        title: 'Подтверждение недоступно',
        description: `Секцию со стороны производства может подтвердить только закреплённый технолог: ${designated}.`,
        variant: 'destructive',
      });
      return;
    }
  }
  const digest = computeWorkshop2TzSignatureDigest({
    role: `section:${section}:${role}`,
    signerLabel: by,
    signerOrganization: orgForSign,
    collectionId,
    articleId,
    articleSku,
    signedAtIso: at,
  });
  setDossier((prev: Workshop2DossierPhase1) => {
    const next = pushTzActionLog(
      {
        ...prev,
        sectionSignoffs: {
          ...(prev.sectionSignoffs ?? {}),
          [section]: {
            ...(prev.sectionSignoffs?.[section] ?? {}),
            [role]: { by, byOrganization: orgForSign, at, signatureDigest: digest },
          },
        },
      },
      updatedByLabel,
      { type: 'section_signoff', section, role, set: true, signerOrganization: orgForSign }
    );
    persist(next);
    return next;
  });
}
