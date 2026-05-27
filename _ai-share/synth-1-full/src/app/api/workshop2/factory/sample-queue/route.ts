import { NextRequest, NextResponse } from 'next/server';

import {
  listWorkshop2FactorySampleQueue,
  parseWorkshop2FactorySampleQueueStatusFilter,
} from '@/lib/production/workshop2-factory-sample-queue';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

/** GET /api/workshop2/factory/sample-queue?factoryId=fact-1&status=draft,sent — очередь образцов для цеха. */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const factoryId = url.searchParams.get('factoryId')?.trim() || 'fact-1';
  const statusFilter = parseWorkshop2FactorySampleQueueStatusFilter(url.searchParams.get('status'));
  const queue = await listWorkshop2FactorySampleQueue({ factoryId, statusFilter });

  return NextResponse.json({ ok: true, ...queue });
}
