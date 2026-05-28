import 'server-only';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  evaluateWorkshop2ShowroomPublishGateForDossier,
  isWorkshop2AutoShowroomPublishEnabled,
  parseWorkshop2B2bDraftNumbers,
} from '@/lib/production/workshop2-auto-showroom-publish';
import {
  getWorkshop2ShowroomCampaign,
  putWorkshop2ShowroomCampaign,
} from '@/lib/server/workshop2-showroom-repository';

export async function runWorkshop2AutoShowroomPublishIfEnabled(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  env?: Record<string, string | undefined>;
}): Promise<{
  attempted: boolean;
  published: boolean;
  skippedReason?: string;
  campaign?: Awaited<ReturnType<typeof getWorkshop2ShowroomCampaign>>;
}> {
  if (!isWorkshop2AutoShowroomPublishEnabled(input.env)) {
    return { attempted: false, published: false, skippedReason: 'auto_disabled' };
  }

  const existing = await getWorkshop2ShowroomCampaign({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  if (existing?.published) {
    return {
      attempted: true,
      published: false,
      skippedReason: 'already_published',
      campaign: existing,
    };
  }

  const gate = evaluateWorkshop2ShowroomPublishGateForDossier({
    dossier: input.dossier,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  if (!gate.passed) {
    return { attempted: true, published: false, skippedReason: gate.messageRu };
  }

  const nums = parseWorkshop2B2bDraftNumbers(input.dossier.b2bIntegrationDraft);
  const campaign = await putWorkshop2ShowroomCampaign({
    collectionId: input.collectionId,
    articleId: input.articleId,
    campaignName: `${input.collectionId} · ${input.articleId}`,
    published: true,
    wholesalePrice: nums.wholesalePrice,
    msrp: nums.msrp,
    moq: nums.moq,
    windowStart: nums.windowStart,
    windowEnd: nums.windowEnd,
  });

  return { attempted: true, published: true, campaign };
}
