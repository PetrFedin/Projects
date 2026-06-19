import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { listIntegrationExternalRefs } from '@/lib/integrations/spine/integration-external-refs-persistence.file';
import type { IntegrationExternalRef } from '@/lib/integrations/spine/integration-external-ref.schema';

/** GET /api/integrations/v1/external-refs?platform=&synthaEntityType=&synthaEntityId=&limit= */
export async function GET(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const sp = new URL(req.url).searchParams;
  const platform = sp.get('platform')?.trim() as IntegrationExternalRef['platform'] | undefined;
  const synthaEntityType = sp.get('synthaEntityType')?.trim() as
    | IntegrationExternalRef['synthaEntityType']
    | undefined;
  const synthaEntityId = sp.get('synthaEntityId')?.trim();
  const limitRaw = Number(sp.get('limit') ?? '50');
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;

  let refs = listIntegrationExternalRefs();
  if (platform) refs = refs.filter((r) => r.platform === platform);
  if (synthaEntityType) refs = refs.filter((r) => r.synthaEntityType === synthaEntityType);
  if (synthaEntityId) refs = refs.filter((r) => r.synthaEntityId === synthaEntityId);

  return NextResponse.json(
    {
      ok: true as const,
      data: { refs: refs.slice(0, limit), total: refs.length },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
