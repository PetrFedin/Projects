/**
 * Wave 5 P1 #7: auto showroom publish when gate showroom_publish passes (pure helpers).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2ShowroomPublishGate } from '@/lib/production/workshop2-showroom-publish-gate';

export const WORKSHOP2_SHOWROOM_PUBLISH_GATE_SCOPE = 'showroom_publish';

export function isWorkshop2AutoShowroomPublishEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  return (
    String(env.WORKSHOP2_AUTO_SHOWROOM_PUBLISH ?? '')
      .trim()
      .toLowerCase() === 'true'
  );
}

export function evaluateWorkshop2ShowroomPublishGateForDossier(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): { passed: boolean; messageRu?: string } {
  const draft = input.dossier.b2bIntegrationDraft;
  const gate = evaluateWorkshop2ShowroomPublishGate({
    published: true,
    wholesalePrice: draft?.wholesalePrice,
    msrp: draft?.msrp,
    moq: draft?.moq,
    windowStart: draft?.startDate,
    windowEnd: draft?.endDate,
    campaignName: `${input.collectionId} · ${input.articleId}`,
  });
  const blocker = gate.checks.find((c) => c.severity === 'blocker');
  if (blocker) {
    return { passed: false, messageRu: blocker.messageRu };
  }
  return { passed: true };
}

export function parseWorkshop2B2bDraftNumbers(
  draft: Workshop2DossierPhase1['b2bIntegrationDraft']
): {
  wholesalePrice?: number;
  msrp?: number;
  moq?: number;
  windowStart?: string;
  windowEnd?: string;
} {
  return {
    wholesalePrice:
      draft?.wholesalePrice != null
        ? Number(String(draft.wholesalePrice).replace(',', '.'))
        : undefined,
    msrp: draft?.msrp != null ? Number(String(draft.msrp).replace(',', '.')) : undefined,
    moq: draft?.moq != null ? Number(String(draft.moq)) : undefined,
    windowStart: draft?.startDate,
    windowEnd: draft?.endDate,
  };
}
