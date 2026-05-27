import { NextResponse } from 'next/server';
import { listWorkshop2RefSuppliers } from '@/lib/server/workshop2-references-repository';

export const dynamic = 'force-dynamic';

/** GET: справочник поставщиков W2 (seed / будущий PG). */
export async function GET() {
  const data = await listWorkshop2RefSuppliers();
  return NextResponse.json({ ok: true, ...data });
}
