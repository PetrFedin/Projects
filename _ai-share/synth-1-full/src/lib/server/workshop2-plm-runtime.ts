import 'server-only';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  mapWorkshop2DossierSavedToPlm,
  publishWorkshop2PlmBridgeEvent,
  type Workshop2PlmBridgeEnvelope,
} from '@/lib/production/workshop2-plm-bridge';
import {
  enqueueWorkshop2PlmOutbox,
  processWorkshop2PlmOutboxBatch,
  retryWorkshop2PlmOutboxFailed,
} from '@/lib/server/workshop2-plm-outbox';
import { isWorkshop2PlmPartnerAckAllowed } from '@/lib/production/workshop2-plm-inbound-verify';
import { resolveRndArticleStatus } from '@/lib/production/workshop2-rnd-state-machine';

type PlmRndTransitionInput = {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  version: number;
  previousLifecycleState?: string;
};

/**
 * Wave 3 #78: process outbox с retry; partner ACK только при valid signature/env (via outbox batch + inbound verify).
 */
export async function processWorkshop2PlmOutboxWithRetry(input?: {
  limit?: number;
  retryFailed?: boolean;
  inboundVerified?: boolean;
}): Promise<{
  dispatched: number;
  acked: number;
  failed: number;
  reset?: number;
  partnerAckAllowed: boolean;
}> {
  const limit = input?.limit ?? 20;
  const inboundVerified = input?.inboundVerified ?? true;
  const partnerAckAllowed = isWorkshop2PlmPartnerAckAllowed({ inboundVerified });

  if (input?.retryFailed) {
    const r = await retryWorkshop2PlmOutboxFailed(limit);
    return { ...r, partnerAckAllowed };
  }

  const batch = await processWorkshop2PlmOutboxBatch(limit);
  return { ...batch, partnerAckAllowed };
}

/**
 * Опционально уведомляет внешний `plm-system` (sibling monorepo) при смене статуса досье.
 * Если пакет недоступен — только bridge envelope (dev log / будущий transport).
 */
export function notifyWorkshop2PlmOnDossierSaved(input: PlmRndTransitionInput): void {
  const env = mapWorkshop2DossierSavedToPlm({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    version: input.version,
  });
  publishWorkshop2PlmBridgeEvent(env);
  void enqueueWorkshop2PlmOutbox(env).catch(() => {
    /* outbox best-effort */
  });

  const prev = input.previousLifecycleState?.trim();
  const next = input.dossier.lifecycleState?.trim();
  if (!next || prev === next) return;

  const rndStatus = resolveRndArticleStatus(input.dossier, null);
  tryInvokeExternalPlmRndStateMachine({
    collectionId: input.collectionId,
    articleId: input.articleId,
    lifecycleState: next,
    rndStatus,
    envelope: env,
  });
}

function tryInvokeExternalPlmRndStateMachine(payload: {
  collectionId: string;
  articleId: string;
  lifecycleState: string;
  rndStatus: string;
  envelope: Workshop2PlmBridgeEnvelope;
}): void {
  // Sibling repo plm-system — опционально; webpackIgnore чтобы dev/E2E не падали без checkout
  void import(
    /* webpackIgnore: true */
    '../../../../plm-system/src/workshop2/rnd-state-machine-bridge'
  )
    .then((plm: { onWorkshop2DossierLifecycleChange?: (p: typeof payload) => void }) => {
      plm.onWorkshop2DossierLifecycleChange?.(payload);
    })
    .catch(() => {
      /* plm-system не подключён — ожидаемо */
    });
}
