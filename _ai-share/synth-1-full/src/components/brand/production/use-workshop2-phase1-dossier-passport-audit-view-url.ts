'use client';

import { useMemo } from 'react';
import { buildPassportCriticalAuditSummariesFromTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-passport-critical-audit';
import { buildWorkshop2FactorySketchFloorShareAbsoluteUrl } from '@/components/brand/production/workshop2-phase1-dossier-panel-article-absolute-urls';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  workshop2DossierViewTzSignoffConfirmSides,
  workshop2DossierViewUiCaps,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

/** Паспортный critical audit, UI caps профиля вида досье, стороны TZ, ссылка factory sketch floor. */
export function useWorkshop2Phase1DossierPassportAuditViewFactoryUrl(input: {
  tzActionLog: Workshop2DossierPhase1['tzActionLog'];
  dossierViewProfile: Workshop2DossierViewProfile;
  collectionId: string;
  internalArticleCode?: string;
  articleId: string;
}) {
  const { tzActionLog, dossierViewProfile, collectionId, internalArticleCode, articleId } = input;

  const passportCriticalAuditSummaries = useMemo(
    () => buildPassportCriticalAuditSummariesFromTzActionLog(tzActionLog),
    [tzActionLog]
  );

  const dossierViewUiCaps = useMemo(
    () => workshop2DossierViewUiCaps(dossierViewProfile),
    [dossierViewProfile]
  );

  const dvTzSignoffSides = useMemo(
    () => workshop2DossierViewTzSignoffConfirmSides(dossierViewProfile),
    [dossierViewProfile]
  );

  const showVisualSketchExportSurfacesNav = dossierViewUiCaps.visualSketchExportSurfacesStrip;
  const showVisualSketchLinkFieldsNav = dossierViewUiCaps.visualSketchPinLinkFieldsStrip;

  const workshop2FactoryShareUrl = useMemo(
    () =>
      buildWorkshop2FactorySketchFloorShareAbsoluteUrl({
        collectionId,
        internalArticleCode,
        articleId,
      }),
    [articleId, collectionId, internalArticleCode]
  );

  return {
    passportCriticalAuditSummaries,
    dossierViewUiCaps,
    dvTzSignoffSides,
    showVisualSketchExportSurfacesNav,
    showVisualSketchLinkFieldsNav,
    workshop2FactoryShareUrl,
  };
}
