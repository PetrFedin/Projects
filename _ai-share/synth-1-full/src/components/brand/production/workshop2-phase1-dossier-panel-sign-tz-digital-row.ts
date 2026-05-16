import type { Dispatch, SetStateAction } from 'react';
import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import { computeWorkshop2TzSignatureDigest } from '@/lib/production/workshop2-tz-digital-signoff';
import type {
  Workshop2DossierPhase1,
  Workshop2TzPerRoleStageFlags,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE } from '@/lib/production/workshop2-tz-rbac-hints';
import {
  technologistEarlyStagesRequired,
  WORKSHOP2_TZ_STAGE_LABEL_RU,
} from '@/lib/production/workshop2-tz-signatory-options';
import { workshop2TzSectionSignoffByLabelMeaningful } from '@/lib/production/workshop2-tz-signoff-actor';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export type SignTzDigitalRowDeps = {
  tzWriteDisabled: boolean;
  toast: ToastFn;
  activeSectionSignGateMeets: boolean;
  /** Сообщение при непройденном пороге заполнения активного раздела (как `TZ_SIGNOFF_BLOCK_HINT` в панели). */
  sectionSignGateBlockedDescription: string;
  technologistSignStages: Workshop2TzPerRoleStageFlags | undefined;
  materialSectionMinimumErrors: readonly string[] | undefined;
  constructionSectionMinimumErrors: readonly string[] | undefined;
  setActiveSection: Dispatch<SetStateAction<Workshop2TzSignoffSectionKey>>;
  updatedByLabel: string;
  sectionSignoffOrganizationLabel: string;
  collectionId: string;
  articleId: string;
  articleSku: string;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
};

/** Глобальная цифровая подпись ТЗ (designer / technologist / manager / extra). */
export function signTzDigitalRowAction(
  deps: SignTzDigitalRowDeps,
  rowKey: string,
  extraRoleTitle?: string
): void {
  const {
    tzWriteDisabled,
    toast,
    activeSectionSignGateMeets,
    sectionSignGateBlockedDescription,
    technologistSignStages,
    materialSectionMinimumErrors,
    constructionSectionMinimumErrors,
    setActiveSection,
    updatedByLabel,
    sectionSignoffOrganizationLabel,
    collectionId,
    articleId,
    articleSku,
    setDossier,
  } = deps;

  if (tzWriteDisabled) {
    toast({
      title: 'Подпись недоступна',
      description: W2_TZ_HINT_PRODUCTION_EDIT_SIGN_REVOKE,
      variant: 'destructive',
    });
    return;
  }
  if (!activeSectionSignGateMeets) {
    toast({
      title: 'Подпись недоступна',
      description: sectionSignGateBlockedDescription,
      variant: 'destructive',
    });
    return;
  }
  const missingTechStages = technologistEarlyStagesRequired(technologistSignStages);
  if (missingTechStages.length > 0) {
    toast({
      title: 'Подпись недоступна',
      description: `Технолог обязателен на ранних этапах (${missingTechStages
        .map((s) => WORKSHOP2_TZ_STAGE_LABEL_RU[s])
        .join(', ')}). Откройте «Подписанты» и включите этапы технолога.`,
      variant: 'destructive',
    });
    return;
  }
  const globalMinErrors = [
    ...(materialSectionMinimumErrors ?? []),
    ...(constructionSectionMinimumErrors ?? []),
  ];
  if (globalMinErrors.length > 0) {
    const focusSection: Workshop2TzSignoffSectionKey = materialSectionMinimumErrors?.length
      ? 'material'
      : 'construction';
    setActiveSection(focusSection);
    toast({
      title: 'Подпись недоступна',
      description: `Исправьте минимум ТЗ перед глобальной подписью: ${globalMinErrors
        .slice(0, 2)
        .join(' ')}`,
      variant: 'destructive',
    });
    queueMicrotask(() => {
      document
        .getElementById(`w2-tz-section-signoff-${focusSection}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return;
  }
  const at = new Date().toISOString();
  const by = updatedByLabel.slice(0, 120);
  const orgForSign = sectionSignoffOrganizationLabel.trim().slice(0, 200);
  if (!workshop2TzSectionSignoffByLabelMeaningful(updatedByLabel)) {
    toast({
      title: 'Подпись недоступна',
      description:
        'Укажите отображаемое имя в профиле (ФИО) и войдите в аккаунт — без этого подпись не фиксируется.',
      variant: 'destructive',
    });
    return;
  }
  if (!orgForSign) {
    toast({
      title: 'Подпись недоступна',
      description:
        'Не задано предприятие для строки подписи (бренд в профиле или значение среды кабинета).',
      variant: 'destructive',
    });
    return;
  }
  if (rowKey === 'designer') {
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(
        {
          ...prev,
          isVerifiedByDesigner: true,
          designerSignoff: {
            by,
            byOrganization: orgForSign,
            at,
            signatureDigest: computeWorkshop2TzSignatureDigest({
              role: 'designer',
              signerLabel: by,
              signerOrganization: orgForSign,
              collectionId,
              articleId,
              articleSku,
              signedAtIso: at,
            }),
          },
        },
        updatedByLabel,
        { type: 'tz_global_signoff', role: 'designer', set: true }
      )
    );
    return;
  }
  if (rowKey === 'technologist') {
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(
        {
          ...prev,
          isVerifiedByTechnologist: true,
          technologistSignoff: {
            by,
            byOrganization: orgForSign,
            at,
            signatureDigest: computeWorkshop2TzSignatureDigest({
              role: 'technologist',
              signerLabel: by,
              signerOrganization: orgForSign,
              collectionId,
              articleId,
              articleSku,
              signedAtIso: at,
            }),
          },
        },
        updatedByLabel,
        { type: 'tz_global_signoff', role: 'technologist', set: true }
      )
    );
    return;
  }
  if (rowKey === 'manager') {
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(
        {
          ...prev,
          isVerifiedByManager: true,
          managerSignoff: {
            by,
            byOrganization: orgForSign,
            at,
            signatureDigest: computeWorkshop2TzSignatureDigest({
              role: 'manager',
              signerLabel: by,
              signerOrganization: orgForSign,
              collectionId,
              articleId,
              articleSku,
              signedAtIso: at,
            }),
          },
        },
        updatedByLabel,
        { type: 'tz_global_signoff', role: 'manager', set: true }
      )
    );
    return;
  }
  if (rowKey.startsWith('extra:')) {
    const rowId = rowKey.slice('extra:'.length);
    const rt = extraRoleTitle?.trim() || 'Роль';
    setDossier((prev: Workshop2DossierPhase1) =>
      pushTzActionLog(
        {
          ...prev,
          extraTzSignoffsByRowId: {
            ...(prev.extraTzSignoffsByRowId ?? {}),
            [rowId]: {
              by,
              byOrganization: orgForSign,
              at,
              signatureDigest: computeWorkshop2TzSignatureDigest({
                role: `extra:${rowId}`,
                signerLabel: by,
                signerOrganization: orgForSign,
                collectionId,
                articleId,
                articleSku,
                signedAtIso: at,
              }),
            },
          },
        },
        updatedByLabel,
        { type: 'tz_extra_signoff', rowId, roleTitle: rt, set: true }
      )
    );
  }
}
