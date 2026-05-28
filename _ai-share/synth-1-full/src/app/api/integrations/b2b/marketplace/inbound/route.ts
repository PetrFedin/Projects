import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2B2bMarketplaceOrderStub,
  parseWorkshop2B2bMarketplaceInboundBody,
  verifyWorkshop2B2bMarketplaceInboundSecret,
} from '@/lib/production/workshop2-b2b-marketplace-inbound';
import { persistWorkshop2B2bMarketplaceOrderStub } from '@/lib/server/workshop2-b2b-marketplace-order-repository';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';

/** POST — JOOR/NuORDER inbound order → B2B order stub + domain event. */
export async function POST(req: NextRequest) {
  const verify = verifyWorkshop2B2bMarketplaceInboundSecret({
    secretHeader: req.headers.get('x-workshop2-b2b-marketplace-secret'),
  });
  if (!verify.ok) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized', messageRu: verify.messageRu },
      { status: verify.status ?? 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const payload = parseWorkshop2B2bMarketplaceInboundBody(body);
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_payload',
        messageRu: 'Укажите externalOrderId в теле webhook.',
      },
      { status: 400 }
    );
  }

  const stub = buildWorkshop2B2bMarketplaceOrderStub(payload);
  const persist = await persistWorkshop2B2bMarketplaceOrderStub({ stub });

  if (persist.mode === 'pg_only_blocked') {
    return NextResponse.json(
      {
        ok: false,
        error: 'pg_only_no_fallback',
        messageRu: 'WORKSHOP2_PG_ONLY: marketplace order stub требует PostgreSQL.',
      },
      { status: 503 }
    );
  }

  const collectionId = String((body as { collectionId?: string }).collectionId ?? 'SS27').trim();
  const articleId = String((body as { articleId?: string }).articleId ?? 'marketplace').trim();

  void enqueueWorkshop2DomainEvent({
    type: 'b2b.marketplace_order.received',
    collectionId,
    articleId,
    payload: {
      externalOrderId: stub.externalOrderId,
      provider: stub.provider,
      campaignId: stub.campaignId,
      orderStubId: stub.id,
      messageRu: stub.noteRu,
    },
    dispatchNow: true,
  }).catch(() => {
    /* best-effort */
  });

  return NextResponse.json({
    ok: true,
    orderStub: stub,
    persistMode: persist.mode,
    persisted: persist.persisted,
    domainEvent: 'b2b.marketplace_order.received',
    messageRu: stub.noteRu,
  });
}
