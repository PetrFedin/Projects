import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2EdiJournalEntry,
  parseWorkshop2EdiInboundBody,
} from '@/lib/production/workshop2-edi-types';
import { verifyWorkshop2EdiInboundWebhook } from '@/lib/production/workshop2-edi-inbound-verify';
import { appendWorkshop2EdiInboundJournalEntry } from '@/lib/server/workshop2-edi-inbound-repository';

/** POST — EDI inbound webhook (850/855/856), journal only без fake retailer ACK. */
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

  const payload = parseWorkshop2EdiInboundBody(body);
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_edi_payload',
        messageRu: 'documentType должен быть 850, 855 или 856.',
      },
      { status: 400 }
    );
  }

  const entry = buildWorkshop2EdiJournalEntry(payload);
  const persist = await appendWorkshop2EdiInboundJournalEntry({ entry });

  if (persist.mode === 'pg_only_blocked') {
    return NextResponse.json(
      {
        ok: false,
        error: 'pg_only_no_fallback',
        messageRu:
          'WORKSHOP2_PG_ONLY: EDI journal требует PostgreSQL — file-store fallback отключён.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    journal: entry,
    persistMode: persist.mode,
    persisted: persist.persisted,
    messageRu: persist.persisted ? `${entry.noteRu} Записано (${persist.mode}).` : entry.noteRu,
  });
}
