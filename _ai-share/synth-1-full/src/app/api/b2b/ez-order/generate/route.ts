import { NextResponse } from 'next/server';
import { generateEzOrderToken } from '@/lib/b2b/ez-order-link';

/** POST /api/b2b/ez-order/generate — создать EZ Order ссылку (NuOrder-style) */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brandId, linesheetId, collectionId, expiresInDays, allowedEmail, allowedDomain } = body;
    if (!brandId || !linesheetId) {
      return NextResponse.json({ error: 'brandId and linesheetId required' }, { status: 400 });
    }
    const expiresAt = expiresInDays ? Date.now() + expiresInDays * 24 * 60 * 60 * 1000 : undefined;
    const link = generateEzOrderToken({
      brandId,
      linesheetId,
      collectionId,
      expiresAt,
      allowedEmail,
      allowedDomain,
    });
    return NextResponse.json(link);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Generate failed' },
      { status: 500 }
    );
  }
}
