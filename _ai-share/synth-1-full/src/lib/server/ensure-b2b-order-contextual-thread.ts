import 'server-only';

import type { CoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import {
  WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
  workshop2B2bOrderContextId,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  appendWorkshop2ContextualSystemMessage,
  listWorkshop2ContextualMessages,
} from '@/lib/server/workshop2-contextual-messages-repository';

export type EnsureB2bOrderContextualThreadInput = {
  orderId: string;
  organizationId?: string;
  pillarId?: CoreHubPillarId;
  sectionId?: string;
  source?: 'checkout' | 'registry' | 'api';
  /** Если тред пуст — первое system-сообщение (checkout status и т.п.). */
  initialMessage?: string;
};

export type EnsureB2bOrderContextualThreadResult = {
  ok: true;
  orderId: string;
  contextId: string;
  created: boolean;
  messageCount: number;
  sectionAnchored?: boolean;
};

function buildEnsureThreadMessage(input: EnsureB2bOrderContextualThreadInput): string {
  const orderId = input.orderId.trim();
  const pillar = input.pillarId?.trim();
  const section = input.sectionId?.trim();
  if (pillar && section) {
    return `Тред по заказу ${orderId} · контекст ${pillar}/${section} · PG registry.`;
  }
  if (input.source === 'checkout') {
    return `Заказ ${orderId} отправлен бренду · тред переговоров открыт.`;
  }
  return `Тред по заказу ${orderId} · PG registry.`;
}

/** Idempotent: создаёт system message, если тред b2b_order пуст. */
export async function ensureB2bOrderContextualThread(
  input: EnsureB2bOrderContextualThreadInput
): Promise<EnsureB2bOrderContextualThreadResult> {
  const orderId = input.orderId.trim();
  const contextId = workshop2B2bOrderContextId(orderId);
  const org = input.organizationId?.trim() || 'org-brand-001';

  const existing = await listWorkshop2ContextualMessages({
    organizationId: org,
    contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
    contextId,
  });

  if (existing.length > 0) {
    const section = input.sectionId?.trim();
    const pillar = input.pillarId?.trim();
    if (section && pillar) {
      const marker = `${pillar}/${section}`;
      const hasSectionMsg = existing.some((m) => m.message.includes(marker));
      if (!hasSectionMsg) {
        await appendWorkshop2ContextualSystemMessage({
          organizationId: org,
          contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
          contextId,
          message: `Контекст раздела · ${marker} · заказ ${orderId}.`,
        });
        return {
          ok: true,
          orderId,
          contextId,
          created: false,
          messageCount: existing.length + 1,
          sectionAnchored: true,
        };
      }
    }
    return {
      ok: true,
      orderId,
      contextId,
      created: false,
      messageCount: existing.length,
    };
  }

  await appendWorkshop2ContextualSystemMessage({
    organizationId: org,
    contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
    contextId,
    message: input.initialMessage?.trim() || buildEnsureThreadMessage(input),
  });

  return {
    ok: true,
    orderId,
    contextId,
    created: true,
    messageCount: 1,
  };
}
