import { NextResponse } from 'next/server';

import { resolveWorkshop2B2bShowroom3dStreamToken } from '@/lib/production/workshop2-b2b-showroom-3d-stream';

/** GET — 3D showroom stream token scaffold (placeholder | live). */
export async function GET() {
  const resolved = resolveWorkshop2B2bShowroom3dStreamToken();
  return NextResponse.json({
    ok: true,
    mode: resolved.mode,
    ...(resolved.token ? { token: resolved.token } : {}),
    streamUrlConfigured: resolved.streamUrlConfigured,
    hintRu: resolved.hintRu,
  });
}
