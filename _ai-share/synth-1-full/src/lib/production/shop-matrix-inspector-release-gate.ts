import { ROUTES } from '@/lib/routes';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { buildWorkshop2FinalTzExportContextFromDossier } from '@/lib/production/workshop2-final-tz-spec-export';
import { buildWorkshop2TechPackExportOptions } from '@/lib/production/workshop2-techpack-export-options';
import {
  assessWorkshop2TechPackReleaseGate,
  type Workshop2TechPackReleaseGate,
} from '@/lib/production/workshop2-techpack-release-gate';
import { buildBrandTechPackExportSession } from '@/lib/production/workshop2-techpack-export-session';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type ShopMatrixInspectorReleaseGate = Workshop2TechPackReleaseGate & {
  brandFactoryPackHref: string;
  brandReleaseGateHref: string;
};

export function assessShopMatrixInspectorFactoryPackGate(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  articleSku?: string;
}): ShopMatrixInspectorReleaseGate {
  const ctx = buildWorkshop2FinalTzExportContextFromDossier(input.dossier, {
    articleId: input.articleId,
    exportLanguage: 'ru_en',
  });
  if (input.articleSku?.trim()) ctx.articleSku = input.articleSku.trim();
  const session = buildBrandTechPackExportSession({
    articleId: input.articleId,
    collectionId: input.collectionId,
    sku: ctx.articleSku,
  });
  const gate = assessWorkshop2TechPackReleaseGate({
    dossier: input.dossier,
    ctx,
    exportOptions: buildWorkshop2TechPackExportOptions({
      dossier: input.dossier,
      articleSku: ctx.articleSku,
      articleId: input.articleId,
      collectionId: input.collectionId,
      matrixHref: session.matrixQtyHref,
    }),
  });
  return {
    ...gate,
    brandFactoryPackHref: session.dossierAssignmentHref,
    brandReleaseGateHref: `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=techpack-gate`,
  };
}
