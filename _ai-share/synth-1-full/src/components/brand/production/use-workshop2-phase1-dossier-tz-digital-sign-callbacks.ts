import { useCallback, type Dispatch, type SetStateAction } from 'react';
import {
  signTzDigitalRowAction,
  type SignTzDigitalRowDeps,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-sign-tz-digital-row';
import { revokeTzDigitalRowAction } from '@/components/brand/production/workshop2-phase1-dossier-panel-revoke-tz-digital-row';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type RevokeDeps = {
  tzWriteDisabled: boolean;
  toast: SignTzDigitalRowDeps['toast'];
  updatedByLabel: string;
  tzRevokersEffective: readonly string[];
  onTzRevokeDenied: () => void;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
};

type Params = SignTzDigitalRowDeps & RevokeDeps;

/** Обёртки sign/revoke цифровой подписи ТЗ для панели досье (без дублирования deps в panel). */
export function useWorkshop2Phase1DossierTzDigitalSignCallbacks(params: Params) {
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
    tzRevokersEffective,
    onTzRevokeDenied,
  } = params;

  const signTzDigitalRow = useCallback(
    (rowKey: string, extraRoleTitle?: string) =>
      signTzDigitalRowAction(
        {
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
        },
        rowKey,
        extraRoleTitle
      ),
    [
      articleId,
      articleSku,
      collectionId,
      toast,
      activeSectionSignGateMeets,
      sectionSignGateBlockedDescription,
      technologistSignStages,
      materialSectionMinimumErrors,
      constructionSectionMinimumErrors,
      updatedByLabel,
      sectionSignoffOrganizationLabel,
      tzWriteDisabled,
      setActiveSection,
      setDossier,
    ]
  );

  const revokeTzDigitalRow = useCallback(
    (rowKey: string, extraRoleTitle?: string) =>
      revokeTzDigitalRowAction(
        {
          tzWriteDisabled,
          toast,
          updatedByLabel,
          tzRevokersEffective,
          onTzRevokeDenied,
          setDossier,
        },
        rowKey,
        extraRoleTitle
      ),
    [onTzRevokeDenied, setDossier, updatedByLabel, tzRevokersEffective, tzWriteDisabled, toast]
  );

  return { signTzDigitalRow, revokeTzDigitalRow };
}
