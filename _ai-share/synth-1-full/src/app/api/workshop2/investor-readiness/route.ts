import { NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { buildWorkshop2InvestorReadinessReport } from '@/lib/production/workshop2-investor-readiness';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { getWorkshop2PgPool } from '@/lib/server/workshop2-pg-pool';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** GET — агрегат investor readiness: wave1–5 probes + SS27 fill + PG-only + tests flag. */
async function getInvestorReadiness() {
  let ss27Dossiers: Workshop2DossierPhase1[] = [];

  if (isWorkshop2PostgresEnabled()) {
    try {
      await ensureWorkshop2PgSchema();
      const res = await getWorkshop2PgPool().query<{ dossier_json: Workshop2DossierPhase1 }>(
        `SELECT dossier_json FROM workshop2_dossiers WHERE collection_id = $1 LIMIT 50`,
        ['SS27']
      );
      ss27Dossiers = res.rows.map((r) => r.dossier_json);
    } catch {
      /* PG optional for report */
    }
  }

  const report = buildWorkshop2InvestorReadinessReport({ ss27Dossiers });

  return NextResponse.json({
    ok: true,
    ...report,
    readinessPath: '/api/workshop2/investor-readiness',
  });
}

export const GET = withWorkshop2ApiErrorRu(getInvestorReadiness);
