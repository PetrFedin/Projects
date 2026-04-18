import { NextRequest, NextResponse } from 'next/server';
import { publishInventoryShopStockFileIngested } from '@/lib/order/domain-event-factories';

/** In-memory audit trail per client key (demo; prod → DB + tenant). */
const auditByKey = new Map<string, Array<{ name: string; at: string }>>();

function clientKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'demo-anon';
}

export async function GET(req: NextRequest) {
  const key = clientKey(req);
  const items = auditByKey.get(key) ?? [];
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const key = clientKey(req);
  let fileName = 'upload.csv';
  try {
    const body = (await req.json()) as { fileName?: string };
    if (typeof body?.fileName === 'string' && body.fileName.trim()) {
      fileName = body.fileName.trim();
    }
  } catch {
    /* empty body ok */
  }
  const row = { name: fileName, at: new Date().toISOString() };
  const prev = auditByKey.get(key) ?? [];
  auditByKey.set(key, [row, ...prev].slice(0, 50));
  void publishInventoryShopStockFileIngested({
    aggregateId: `shop-stock-upload:${key}`,
    version: 1,
    payload: {
      fileName: row.name,
      clientKey: key,
      acceptedAt: row.at,
      channel: 'b2c_shop_stock_upload_demo',
    },
  }).catch(() => {
    /* demo: не блокируем ответ API */
  });
  return NextResponse.json({ ok: true, accepted: row });
}
