/**
 * GET — счётчик событий PLM в очереди (badge UI).
 */
import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import {
  countWorkshop2PlmOutboxPending,
  getWorkshop2PlmOutboxSummary,
} from '@/lib/server/workshop2-plm-outbox';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

async function getPlmOutboxStatus(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const org = resolveWorkshop2OrganizationId(req);
  const pending = await countWorkshop2PlmOutboxPending(org);
  const summary = await getWorkshop2PlmOutboxSummary(org);
  const awaitingAck = summary.sent;
  const autoAckEnabled = process.env.WORKSHOP2_PLM_AUTO_ACK === 'true';

  return NextResponse.json({
    ok: true,
    pending,
    summary,
    awaitingAck,
    autoAckEnabled,
    labelRu:
      pending > 0
        ? `PLM: в очереди (${pending})`
        : awaitingAck > 0
          ? `PLM: ждёт ACK (${awaitingAck})`
          : 'PLM: синхронизировано',
  });
}

export const GET = withWorkshop2ApiErrorRu(getPlmOutboxStatus);
