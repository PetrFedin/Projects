import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';

import {
  deleteWorkshop2B2bTerritory,
  listWorkshop2B2bTerritories,
  upsertWorkshop2B2bTerritory,
} from '@/lib/server/workshop2-b2b-territory-repository';
import { filterWorkshop2TerritoriesForMarket } from '@/lib/production/workshop2-b2b-checkout-rub';
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';

export async function GET() {
  const territories = filterWorkshop2TerritoriesForMarket(await listWorkshop2B2bTerritories());
  return NextResponse.json({
    ok: true,
    market: getWorkshop2MarketProfile(),
    territories,
  });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }
  const b = body as {
    territoryId?: string;
    labelRu?: string;
    creditLimitRub?: number;
    openOrdersRub?: number;
    customerName?: string;
  };
  if (!b.territoryId?.trim() || !b.labelRu?.trim()) {
    return jsonWorkshop2ErrorRu(400, 'invalid_request', {
      messageRu: 'territoryId и labelRu обязательны.',
    });
  }
  const row = await upsertWorkshop2B2bTerritory({
    territoryId: b.territoryId,
    labelRu: b.labelRu,
    creditLimitRub: Number(b.creditLimitRub ?? 0),
    openOrdersRub: Number(b.openOrdersRub ?? 0),
    customerName: b.customerName,
  });
  return NextResponse.json({
    ok: true,
    territory: row,
    messageRu: `Территория ${row.territoryId} сохранена в PG/file-store.`,
  });
}

export async function DELETE(req: NextRequest) {
  const territoryId = req.nextUrl.searchParams.get('territoryId')?.trim();
  if (!territoryId) {
    return jsonWorkshop2ErrorRu(400, 'missing_territory_id');
  }
  await deleteWorkshop2B2bTerritory(territoryId);
  return NextResponse.json({ ok: true, messageRu: `Территория ${territoryId} удалена.` });
}
