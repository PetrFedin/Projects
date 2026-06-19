import { NextRequest, NextResponse } from 'next/server';

import { workshop2B2bCommissionLinesToRecords } from '@/lib/fashion/brand-agent-rep-ledger-map';
import { listWorkshop2B2bCommissionLinesForOrganization } from '@/lib/server/workshop2-b2b-commission-repository';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

function resolveLedgerStorageMode(lineCount: number): 'postgres' | 'file' | 'memory' | 'empty' {
  if (lineCount === 0) return 'empty';
  if (isWorkshop2PostgresEnabled()) return 'postgres';
  return process.env.NODE_ENV === 'test' ? 'memory' : 'file';
}

/** GET — brand oversight ledger: persisted commission rows → CommissionRecord[]. */
export async function GET(req: NextRequest) {
  const repId = req.nextUrl.searchParams.get('repId')?.trim();
  const lines = await listWorkshop2B2bCommissionLinesForOrganization({
    repId: repId || undefined,
    limit: 200,
    seedIfEmpty: true,
  });
  const records = workshop2B2bCommissionLinesToRecords(lines);
  const totalCommissionRub = records.reduce((sum, r) => sum + r.commissionRub, 0);
  const mode = resolveLedgerStorageMode(lines.length);

  return NextResponse.json({
    ok: true,
    records,
    mode,
    totalCommissionRub,
    messageRu:
      records.length > 0
        ? `${records.length} записей · ${totalCommissionRub.toLocaleString('ru-RU')} ₽ (${mode === 'postgres' ? 'PG' : mode} ledger).`
        : 'Нет записей комиссий — submit заказ с repId.',
  });
}
