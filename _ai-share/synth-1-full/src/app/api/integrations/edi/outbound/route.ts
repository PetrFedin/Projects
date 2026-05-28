import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2EdiOutboundJournalEntry,
  parseWorkshop2EdiOutboundBody,
  postWorkshop2EdiOutboundWebhook,
} from '@/lib/production/workshop2-edi-outbound';
import { verifyWorkshop2EdiInboundWebhook } from '@/lib/production/workshop2-edi-inbound-verify';
import { appendWorkshop2EdiInboundJournalEntry } from '@/lib/server/workshop2-edi-inbound-repository';

/** POST — EDI outbound 855 ACK / 856 ASN из B2B order context → PG journal. */
export async function POST(req: NextRequest) {
  const verify = verifyWorkshop2EdiInboundWebhook({
    authorizationHeader: req.headers.get('authorization'),
    secretHeader: req.headers.get('x-workshop2-edi-secret'),
  });
  if (!verify.ok) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized', messageRu: verify.messageRu },
      { status: verify.status }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const ctx = parseWorkshop2EdiOutboundBody(body);
  if (!ctx) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_edi_outbound',
        messageRu: 'documentType должен быть 855 или 856.',
      },
      { status: 400 }
    );
  }

  const entry = buildWorkshop2EdiOutboundJournalEntry(ctx);
  const persist = await appendWorkshop2EdiInboundJournalEntry({ entry });

  if (persist.mode === 'pg_only_blocked') {
    return NextResponse.json(
      {
        ok: false,
        error: 'pg_only_no_fallback',
        messageRu: 'WORKSHOP2_PG_ONLY: EDI outbound journal требует PostgreSQL.',
      },
      { status: 503 }
    );
  }

  const webhook = await postWorkshop2EdiOutboundWebhook({ entry });

  return NextResponse.json({
    ok: true,
    journal: entry,
    outboundDocument: entry.outboundDocument,
    persistMode: persist.mode,
    persisted: persist.persisted,
    webhookPosted: webhook.posted,
    webhookHttpStatus: webhook.httpStatus,
    messageRu: persist.persisted ? `${entry.noteRu} Записано (${persist.mode}).` : entry.noteRu,
  });
}
