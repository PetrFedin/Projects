import { NextRequest, NextResponse } from 'next/server';
import {
  brandRegistryExportHeaders,
  brandRegistryExportJsonHeaders,
  buildBrandRegistryExportCsv,
  buildBrandRegistryExportJson,
  listBrandRegistryExportOrders,
} from '@/lib/server/platform-core-brand-registry-export';

/** GET — PG-backed export реестра бренда (CSV default · JSON ?format=json). */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() || 'all';
  const partner = req.nextUrl.searchParams.get('partner')?.trim() || 'all';
  const format = req.nextUrl.searchParams.get('format')?.trim() || 'csv';

  const orders = await listBrandRegistryExportOrders({ collectionId, partner });

  if (format === 'json') {
    return NextResponse.json(buildBrandRegistryExportJson(orders), {
      status: 200,
      headers: brandRegistryExportJsonHeaders(collectionId),
    });
  }

  const csv = buildBrandRegistryExportCsv(orders);

  return new NextResponse(csv, {
    status: 200,
    headers: brandRegistryExportHeaders(collectionId),
  });
}
