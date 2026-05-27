import { NextRequest, NextResponse } from 'next/server';

import {
  buildWorkshop2B2bInboundCalendarStubEvent,
  buildWorkshop2B2bInboundDraftOrder,
  isWorkshop2B2bInboundWebhookEnabled,
  parseWorkshop2B2bInboundOrderWebhookBody,
  summarizeWorkshop2B2bInboundOrderChatRu,
  verifyWorkshop2B2bInboundWebhookHmac,
} from '@/lib/production/workshop2-b2b-inbound-webhook';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { putWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';

/** POST — inbound B2B order webhook → internal draft (journal_only без PG). */
export async function POST(req: NextRequest) {
  if (!isWorkshop2B2bInboundWebhookEnabled()) {
    return jsonWorkshop2ErrorRu({
      status: 503,
      error: 'feature_disabled',
      messageRu:
        'B2B inbound webhook отключён. Задайте WORKSHOP2_B2B_INBOUND_WEBHOOK_ENABLED=true.',
    });
  }

  const rawBody = await req.text();
  const verify = verifyWorkshop2B2bInboundWebhookHmac({
    rawBody,
    signatureHeader: req.headers.get('x-b2b-webhook-secret'),
  });
  if (!verify.ok) {
    return jsonWorkshop2ErrorRu({
      status: verify.status ?? 401,
      error: 'unauthorized',
      messageRu: verify.messageRu ?? 'B2B inbound webhook: отказ авторизации.',
    });
  }

  let body: unknown;
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return jsonWorkshop2ErrorRu({
      status: 400,
      error: 'invalid_json',
      messageRu: 'Некорректный JSON в теле webhook.',
    });
  }

  const payload = parseWorkshop2B2bInboundOrderWebhookBody(body);
  if (!payload) {
    return jsonWorkshop2ErrorRu({
      status: 400,
      error: 'invalid_payload',
      messageRu: 'Укажите externalOrderRef в теле webhook.',
    });
  }

  const order = buildWorkshop2B2bInboundDraftOrder(payload);
  const persist = await putWorkshop2B2bOrder(order);
  const calendarStub = buildWorkshop2B2bInboundCalendarStubEvent(order, payload.externalOrderRef);
  const persistMode = persist.mode === 'pg_only_blocked' ? 'journal_only' : persist.mode;

  void enqueueWorkshop2DomainEvent({
    type: 'b2b.inbound_order.received',
    collectionId: order.collectionId ?? 'SS27',
    articleId: order.articleId ?? 'demo-ss27-01',
    payload: {
      externalOrderRef: payload.externalOrderRef,
      orderId: order.id,
      provider: payload.provider ?? 'inbound',
      persistMode,
      calendarStub,
      chatEvent: 'b2b_inbound_order',
      messageRu: summarizeWorkshop2B2bInboundOrderChatRu({
        externalOrderRef: payload.externalOrderRef,
        orderId: order.id,
        persistMode,
      }),
    },
    dispatchNow: true,
  }).catch(() => {
    /* best-effort */
  });

  if (persist.mode === 'pg_only_blocked') {
    return NextResponse.json({
      ok: true,
      journalOnly: true,
      order,
      persistMode: 'journal_only',
      calendarStub,
      chatEvent: 'b2b_inbound_order',
      messageRu: summarizeWorkshop2B2bInboundOrderChatRu({
        externalOrderRef: payload.externalOrderRef,
        orderId: order.id,
        persistMode: 'journal_only',
      }),
    });
  }

  return NextResponse.json({
    ok: true,
    order,
    persisted: persist.persisted,
    persistMode: persist.mode,
    calendarStub,
    chatEvent: 'b2b_inbound_order',
    domainEvent: 'b2b.inbound_order.received',
    messageRu: summarizeWorkshop2B2bInboundOrderChatRu({
      externalOrderRef: payload.externalOrderRef,
      orderId: order.id,
      persistMode: persist.mode,
    }),
  });
}
