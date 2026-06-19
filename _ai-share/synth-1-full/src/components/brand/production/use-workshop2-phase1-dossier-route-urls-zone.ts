'use client';

import { useCallback, useMemo } from 'react';
import { buildWorkshop2VisualsTzSignoffShareAbsoluteUrl } from '@/components/brand/production/workshop2-phase1-dossier-panel-article-absolute-urls';
import { buildWorkshop2Phase1DossierRouteHandoffAbsoluteUrl } from '@/components/brand/production/workshop2-phase1-dossier-panel-build-route-handoff-absolute-url';
import { buildWorkshop2Phase1DossierPassportStep1BriefHref } from '@/components/brand/production/workshop2-phase1-dossier-panel-passport-step1-brief-href';

export type UseWorkshop2Phase1DossierRouteUrlsZoneInput = {
  collectionId: string;
  articleId: string;
  internalArticleCode?: string;
};

/** Absolute URLs for TZ share, route handoff anchors, passport brief (sectionBodies). */
export function useWorkshop2Phase1DossierRouteUrlsZone({
  collectionId,
  articleId,
  internalArticleCode,
}: UseWorkshop2Phase1DossierRouteUrlsZoneInput) {
  const visualsShareAbsoluteUrl = useMemo(
    () =>
      buildWorkshop2VisualsTzSignoffShareAbsoluteUrl({
        collectionId,
        internalArticleCode,
        articleId,
      }),
    [articleId, collectionId, internalArticleCode]
  );

  const buildRouteHandoffAbsoluteUrl = useCallback(
    (tab: 'fit' | 'qc' | 'supply', domId: string) =>
      buildWorkshop2Phase1DossierRouteHandoffAbsoluteUrl(
        { collectionId, articleId, internalArticleCode },
        tab,
        domId
      ),
    [articleId, collectionId, internalArticleCode]
  );

  const passportStep1BriefHref = useMemo(
    () =>
      buildWorkshop2Phase1DossierPassportStep1BriefHref({
        collectionId,
        articleId,
        internalArticleCode,
      }),
    [articleId, collectionId, internalArticleCode]
  );

  return {
    visualsShareAbsoluteUrl,
    buildRouteHandoffAbsoluteUrl,
    passportStep1BriefHref,
  };
}
