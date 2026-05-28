'use client';

import {
  Workshop2TzSectionSignoffStrip,
  type Workshop2TzSectionSignoffTabKey,
} from '@/components/brand/production/Workshop2TzSectionSignoffStrip';
import { W2_SECTION_SIGNOFF_PCT_THRESHOLD } from '@/components/brand/production/Workshop2TzSectionTabIndicator';
import { SECTION_LABEL_BY_ID } from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-constants';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2DossierPanelSectionTzSignoffPassportPreviews = {
  brandPassportName: string | null;
  brandPassportOrg: string | null;
  brandPassportMissing: boolean;
  techPassportName: string | null;
  techPassportOrg: string | null;
  techPassportMissing: boolean;
};

export type Workshop2DossierPanelSectionTzSignoffBridgeProps = {
  section: Workshop2TzSectionSignoffTabKey;
  dossier: Workshop2DossierPhase1;
  sectionFillPct: number;
  tzWriteDisabled: boolean;
  tzSectionSignoffRevokeAllowed: boolean;
  sectionSignoffPassportPreviews: Workshop2DossierPanelSectionTzSignoffPassportPreviews;
  sectionSignoffOrganizationLabel?: string;
  updatedByLabel: string;
  sectionGateErrors: string[] | undefined;
  sectionSignoffProfileGateOk: boolean;
  dvTzSignoffSides: { brand: boolean; tech: boolean };
  sectionSignoffSessionBrandOk: boolean;
  sectionSignoffSessionTechOk: boolean;
  tzNotifyHighlightRowKey: string | null;
  commitSectionSignoff: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    role: 'brand' | 'tech'
  ) => void;
  revokeSectionSignoff: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    role: 'brand' | 'tech'
  ) => void;
  notifyStakeholdersForSectionSignoff: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    sectionTitle: string,
    side?: 'brand' | 'tech'
  ) => void;
  setSignoffDeadline: (
    section: 'general' | 'visuals' | 'material' | 'construction',
    side: 'brand' | 'tech',
    dueAt: string | undefined
  ) => void;
  /**
   * Вкладка «Конструкция»: вторая полоса подписи без UI напоминания бренду (как в исходной разметке).
   */
  omitBrandNotifyUi?: boolean;
};

export function Workshop2DossierPanelSectionTzSignoffBridge({
  section,
  dossier,
  sectionFillPct,
  tzWriteDisabled,
  tzSectionSignoffRevokeAllowed,
  sectionSignoffPassportPreviews,
  sectionSignoffOrganizationLabel,
  updatedByLabel,
  sectionGateErrors,
  sectionSignoffProfileGateOk,
  dvTzSignoffSides,
  sectionSignoffSessionBrandOk,
  sectionSignoffSessionTechOk,
  tzNotifyHighlightRowKey,
  commitSectionSignoff,
  revokeSectionSignoff,
  notifyStakeholdersForSectionSignoff,
  setSignoffDeadline,
  omitBrandNotifyUi = false,
}: Workshop2DossierPanelSectionTzSignoffBridgeProps) {
  const sec = section;
  const previews = sectionSignoffPassportPreviews;
  const reminders = dossier.sectionSignoffReminders?.[sec];
  const signoffs = dossier.sectionSignoffs?.[sec];

  return (
    <Workshop2TzSectionSignoffStrip
      section={sec}
      brandMeta={signoffs?.brand}
      techMeta={signoffs?.tech}
      sectionFillPct={sectionFillPct}
      fillPctMin={W2_SECTION_SIGNOFF_PCT_THRESHOLD[sec]}
      tzWriteDisabled={tzWriteDisabled}
      canRevoke={tzSectionSignoffRevokeAllowed}
      brandPassportName={previews.brandPassportName ?? ''}
      brandPassportOrg={previews.brandPassportOrg ?? ''}
      brandPassportMissing={previews.brandPassportMissing}
      techPassportName={previews.techPassportName ?? ''}
      techPassportOrg={previews.techPassportOrg ?? ''}
      techPassportMissing={previews.techPassportMissing}
      signerNamePreview={updatedByLabel}
      signerOrgPreview={sectionSignoffOrganizationLabel ?? ''}
      profileGateOk={sectionSignoffProfileGateOk}
      sectionGateErrors={sectionGateErrors}
      allowConfirmBrand={dvTzSignoffSides.brand}
      allowConfirmTech={dvTzSignoffSides.tech}
      sessionSignerMatchesBrand={sectionSignoffSessionBrandOk}
      sessionSignerMatchesTech={sectionSignoffSessionTechOk}
      onConfirmBrand={() => commitSectionSignoff(sec, 'brand')}
      onConfirmTech={() => commitSectionSignoff(sec, 'tech')}
      onRevokeBrand={() => revokeSectionSignoff(sec, 'brand')}
      onRevokeTech={() => revokeSectionSignoff(sec, 'tech')}
      onNotifyBrand={
        omitBrandNotifyUi
          ? undefined
          : () => notifyStakeholdersForSectionSignoff(sec, SECTION_LABEL_BY_ID[sec], 'brand')
      }
      onNotifyTech={() =>
        notifyStakeholdersForSectionSignoff(sec, SECTION_LABEL_BY_ID[sec], 'tech')
      }
      notifyHighlightBrand={
        omitBrandNotifyUi ? undefined : tzNotifyHighlightRowKey === `section:${sec}:brand`
      }
      notifyHighlightTech={tzNotifyHighlightRowKey === `section:${sec}:tech`}
      notifyMetaBrand={omitBrandNotifyUi ? undefined : reminders?.brand}
      notifyMetaTech={reminders?.tech}
      onSetDeadlineBrand={(dueAt) => setSignoffDeadline(sec, 'brand', dueAt)}
      onSetDeadlineTech={(dueAt) => setSignoffDeadline(sec, 'tech', dueAt)}
    />
  );
}
