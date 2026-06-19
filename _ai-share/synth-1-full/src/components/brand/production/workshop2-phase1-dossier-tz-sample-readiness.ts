import type { DossierSection } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  workshopTzExtraRowsRequiringTzSignoff,
  workshopTzSignoffRequiredForRole,
} from '@/lib/production/workshop2-tz-signatory-options';
import type { Workshop2Phase1DossierSectionReadinessEntry } from '@/components/brand/production/workshop2-phase1-dossier-section-readiness';

export type Workshop2Phase1DossierTzDigitalApprovalState = {
  reqDesigner: boolean;
  reqTechnologist: boolean;
  reqManager: boolean;
  extrasReqTzSignoff: ReturnType<typeof workshopTzExtraRowsRequiringTzSignoff>;
  approvalsDone: number;
  allTzDigitalSignoffsDone: boolean;
};

export function buildWorkshop2Phase1DossierTzDigitalApprovalState(
  dossier: Workshop2DossierPhase1
): Workshop2Phase1DossierTzDigitalApprovalState {
  const reqDesigner = workshopTzSignoffRequiredForRole(dossier.tzSignatoryBindings, 'designer');
  const reqTechnologist = workshopTzSignoffRequiredForRole(
    dossier.tzSignatoryBindings,
    'technologist'
  );
  const reqManager = workshopTzSignoffRequiredForRole(dossier.tzSignatoryBindings, 'manager');
  const extrasReqTzSignoff = workshopTzExtraRowsRequiringTzSignoff(dossier.tzSignatoryBindings);
  const approvalsDone =
    Number(!reqDesigner || Boolean(dossier.isVerifiedByDesigner)) +
    Number(!reqTechnologist || Boolean(dossier.isVerifiedByTechnologist)) +
    Number(!reqManager || Boolean(dossier.isVerifiedByManager)) +
    extrasReqTzSignoff.reduce(
      (n, ex) => n + Number(Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId])),
      0
    );
  const allTzDigitalSignoffsDone =
    (!reqDesigner || Boolean(dossier.isVerifiedByDesigner)) &&
    (!reqTechnologist || Boolean(dossier.isVerifiedByTechnologist)) &&
    (!reqManager || Boolean(dossier.isVerifiedByManager)) &&
    extrasReqTzSignoff.every((ex) => Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId]));
  return {
    reqDesigner,
    reqTechnologist,
    reqManager,
    extrasReqTzSignoff,
    approvalsDone,
    allTzDigitalSignoffsDone,
  };
}

export type BuildWorkshop2Phase1DossierTzReadyForSampleInput = {
  sectionReadiness: Record<DossierSection, Workshop2Phase1DossierSectionReadinessEntry>;
  isPhase1: boolean;
  allSectionSignoffPairsDone: boolean;
  dossier: Workshop2DossierPhase1;
  handbookWarnings: readonly string[];
  approval: Workshop2Phase1DossierTzDigitalApprovalState;
};

/** Sample-readiness gate for W2 session metrics (sectionBodies). */
export function buildWorkshop2Phase1DossierTzReadyForSample({
  sectionReadiness,
  isPhase1,
  allSectionSignoffPairsDone,
  dossier,
  handbookWarnings,
  approval,
}: BuildWorkshop2Phase1DossierTzReadyForSampleInput): boolean {
  const phaseSignoffsOk = isPhase1
    ? allSectionSignoffPairsDone
    : (!approval.reqDesigner || Boolean(dossier.isVerifiedByDesigner)) &&
      (!approval.reqTechnologist || Boolean(dossier.isVerifiedByTechnologist)) &&
      (!approval.reqManager || Boolean(dossier.isVerifiedByManager)) &&
      approval.extrasReqTzSignoff.every((ex) =>
        Boolean(dossier.extraTzSignoffsByRowId?.[ex.rowId])
      );
  return (
    sectionReadiness.general.pct >= 60 &&
    sectionReadiness.visuals.pct >= 50 &&
    sectionReadiness.material.pct >= 50 &&
    sectionReadiness.construction.pct >= 100 &&
    phaseSignoffsOk &&
    handbookWarnings.length === 0
  );
}
