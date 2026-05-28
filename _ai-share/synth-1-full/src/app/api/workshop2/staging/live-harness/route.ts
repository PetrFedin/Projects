import { NextResponse } from 'next/server';
import {
  buildWorkshop2StagingLiveHarness,
  isWorkshop2StagingLiveHarnessAllowed,
} from '@/lib/production/workshop2-live-integration-probes';

/** Wave 26: чеклист env для live EDO / ЧЗ / MES / ERP — только dev/staging. */
export async function GET() {
  if (!isWorkshop2StagingLiveHarnessAllowed()) {
    return NextResponse.json(
      {
        ok: false,
        error: 'forbidden',
        messageRu: 'Live-harness доступен только при NODE_ENV=development или STAGING=true.',
      },
      { status: 404 }
    );
  }
  const harness = buildWorkshop2StagingLiveHarness();
  return NextResponse.json({ ok: true, ...harness });
}
