/**
 * Wave F (#50): DPP/LCA registry — без green UI при registryStub без live write path.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { isWorkshop2LiveDppConfigured } from '@/lib/production/workshop2-live-integration-probes-env';
import { buildWorkshop2DppExportBlock } from '@/lib/production/workshop2-dpp-export';
import { isWorkshop2StagingContractModeEnabled } from '@/lib/production/workshop2-staging-contract-mode';

export type Workshop2DppRegistryWriteHonesty = {
  allowStagingSuccessUi: boolean;
  registryStubOnly: boolean;
  httpStatusHint: 200 | 409 | 503;
  messageRu: string;
};

export function evaluateWorkshop2DppRegistryWriteHonesty(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  env?: Record<string, string | undefined>;
}): Workshop2DppRegistryWriteHonesty {
  const block = buildWorkshop2DppExportBlock({
    dossier: input.dossier,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  const liveConfigured = isWorkshop2LiveDppConfigured(input.env);
  const stagingContract = isWorkshop2StagingContractModeEnabled(input.env);
  const mirror = input.dossier.dppRegistryDraftMirror;
  const registryStubOnly = block.registryStub.status !== 'live' && mirror?.registryId == null;

  if (!liveConfigured && !stagingContract && registryStubOnly) {
    return {
      allowStagingSuccessUi: false,
      registryStubOnly: true,
      httpStatusHint: 503,
      messageRu:
        'DPP registry не настроен (WORKSHOP2_DPP_REGISTRY_URL) — registryStub only, без green ACK UI (503 fail-closed).',
    };
  }

  if (mirror?.partnerAckRecorded && !liveConfigured) {
    return {
      allowStagingSuccessUi: false,
      registryStubOnly: true,
      httpStatusHint: 409,
      messageRu:
        'partnerAck без live registry — сбросьте staging contract или задайте registry URL.',
    };
  }

  return {
    allowStagingSuccessUi: Boolean(mirror?.partnerAckRecorded && liveConfigured),
    registryStubOnly,
    httpStatusHint: 200,
    messageRu: liveConfigured
      ? 'Registry URL задан — staging POST допустим (ACK только из HTTP).'
      : 'Draft JSON-LD only — live registry отдельно.',
  };
}
