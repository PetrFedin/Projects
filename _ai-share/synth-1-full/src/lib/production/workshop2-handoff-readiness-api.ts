/**
 * Серверный handoff-readiness API: тот же gate, что POST sample-order (parity).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2ArticleDevelopmentState,
  type Workshop2ArticleDevelopmentStateMirror,
} from '@/lib/production/workshop2-article-development-state';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import type { Workshop2HandoffReadinessResult } from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';

export const WORKSHOP2_HANDOFF_READINESS_GATE_SCOPE = 'sample_order' as const;

export function buildWorkshop2HandoffReadinessApiPayload(input: {
  dossier: Workshop2DossierPhase1;
  categoryLeafId?: string;
  vaultFileCount: number;
  actor?: string;
  latestSampleOrder?: {
    id: string;
    status: string;
    movementStatus: Workshop2SampleGoodsMovementStatus;
    movementLogLength: number;
  } | null;
}): Workshop2HandoffReadinessResult & {
  gateScope: typeof WORKSHOP2_HANDOFF_READINESS_GATE_SCOPE;
  allowed: boolean;
  articleDevelopmentState: Workshop2ArticleDevelopmentStateMirror;
} {
  const articleDevelopmentState = buildWorkshop2ArticleDevelopmentState({
    dossier: input.dossier,
    actor: input.actor ?? 'handoff-readiness-api',
    vaultFileCount: input.vaultFileCount,
    categoryLeafId: input.categoryLeafId,
    latestSampleOrder: input.latestSampleOrder ?? null,
  });
  const dossierWithDevState = {
    ...input.dossier,
    articleDevelopmentStateMirror: articleDevelopmentState,
  };
  const gate = evaluateWorkshop2SampleOrderGate({
    dossier: dossierWithDevState,
    categoryLeafId: input.categoryLeafId,
    vaultFileCount: input.vaultFileCount,
  });
  return {
    gateScope: WORKSHOP2_HANDOFF_READINESS_GATE_SCOPE,
    allowed: gate.allowed,
    articleDevelopmentState,
    ...gate.readiness,
  };
}
