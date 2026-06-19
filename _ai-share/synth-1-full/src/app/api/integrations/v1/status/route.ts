import { NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { getIntegrationsV1StatusPayload } from '@/lib/integrations/spine/integration-status.service';

/** GET /api/integrations/v1/status */
export async function GET(req: Request) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  return NextResponse.json(
    {
      ok: true as const,
      data: getIntegrationsV1StatusPayload(),
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
