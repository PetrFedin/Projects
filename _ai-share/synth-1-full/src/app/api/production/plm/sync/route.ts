import { NextRequest, NextResponse } from 'next/server';
import type { PlmProvider } from '@/lib/production/plm-integration';
import { plmSync } from '@/lib/integrations/plm-backend-proxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider = 'gerber' } = body as { provider?: PlmProvider };
    const type = provider as 'gerber' | 'clo3d' | 'lectra';
    const result = await plmSync(type);
    return NextResponse.json({
      ok: result.ok,
      lastSync: result.lastSync,
      collectionsUpdated: result.collectionsUpdated,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Sync failed' },
      { status: 400 }
    );
  }
}
