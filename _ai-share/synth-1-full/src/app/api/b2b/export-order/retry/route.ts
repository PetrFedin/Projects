/**
 * POST /api/b2b/export-order/retry — повтор обработки джоба экспорта на platform.
 */

import { NextResponse } from 'next/server';
import { retryOrderExportFromJob } from '@/lib/b2b/integrations/b2b-integration-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const exportJobId = typeof body?.exportJobId === 'string' ? body.exportJobId.trim() : '';
    if (!exportJobId) {
      return NextResponse.json({ success: false, error: 'exportJobId required' }, { status: 400 });
    }
    const simulateReject = body?.simulateReject === true;
    const result = await retryOrderExportFromJob(exportJobId, { simulateReject });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Retry failed' },
      { status: 500 }
    );
  }
}
