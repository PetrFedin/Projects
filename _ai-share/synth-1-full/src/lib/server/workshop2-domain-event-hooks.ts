import 'server-only';

import type { Workshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';

/** Fire-and-forget emit — не блокирует HTTP handler при сбое outbox. */
export function emitWorkshop2DomainEventBestEffort(input: {
  type: Workshop2DomainEventType;
  collectionId: string;
  articleId: string;
  payload?: Record<string, unknown>;
  organizationId?: string;
}): void {
  void enqueueWorkshop2DomainEvent({
    type: input.type,
    collectionId: input.collectionId,
    articleId: input.articleId,
    payload: input.payload,
    organizationId: input.organizationId,
    dispatchNow: true,
  }).catch(() => {
    /* cross-module outbox best-effort */
  });
}

export function emitWorkshop2GateBlockedEvent(input: {
  collectionId: string;
  articleId: string;
  gateScope: string;
  messageRu: string;
  organizationId?: string;
}): void {
  emitWorkshop2DomainEventBestEffort({
    type: 'dossier.gate_blocked',
    collectionId: input.collectionId,
    articleId: input.articleId,
    organizationId: input.organizationId,
    payload: {
      gateScope: input.gateScope,
      messageRu: input.messageRu,
    },
  });
}

export function emitWorkshop2GatePassedEvent(input: {
  collectionId: string;
  articleId: string;
  gateScope: string;
  organizationId?: string;
}): void {
  emitWorkshop2DomainEventBestEffort({
    type: 'dossier.gate_passed',
    collectionId: input.collectionId,
    articleId: input.articleId,
    organizationId: input.organizationId,
    payload: { gateScope: input.gateScope },
  });
}
