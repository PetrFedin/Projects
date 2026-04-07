import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { showroomSampleMemoryPut } from '@/lib/server/showroom-sample-memory-store';
import type { ShowroomSampleTagPayloadV1 } from '@/lib/fashion/showroom-sample-tag';

function isPayloadV1(x: unknown): x is ShowroomSampleTagPayloadV1 {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    o.v === 1 &&
    typeof o.sampleId === 'string' &&
    typeof o.sku === 'string' &&
    typeof o.productId === 'string' &&
    typeof o.name === 'string'
  );
}

/**
 * Регистрация бирки: выдаёт короткий id для QR и штрихкода.
 * POST /api/showroom-sample  body: { payload: ShowroomSampleTagPayloadV1 }
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const payload = (body as { payload?: unknown })?.payload;
  if (!isPayloadV1(payload)) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }
  const id = `srs-${randomBytes(10).toString('hex')}`;
  showroomSampleMemoryPut(id, payload);
  return NextResponse.json({
    ok: true,
    id,
    /** Подсказка для клиента; в проде — реальный TTL в БД. */
    hintTtlDays: 90,
  });
}
