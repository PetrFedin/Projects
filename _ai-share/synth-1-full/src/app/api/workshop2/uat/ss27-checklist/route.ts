import { NextResponse } from 'next/server';

import { buildWorkshop2Ss27UatChecklistResponse } from '@/lib/production/workshop2-ss27-uat-checklist-api';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

/** GET SS27 UAT checklist as JSON with auto-checked items (Wave 7 P2 #8). */
async function getSs27UatChecklist() {
  const demoIds = ['demo-ss27-01', 'demo-ss27-02'];
  const dossiers = (
    await Promise.all(
      demoIds.map(async (articleId) => {
        const record = await getWorkshop2ServerDossierRecord('SS27', articleId);
        return record?.dossier ?? null;
      })
    )
  ).filter(Boolean);
  const payload = buildWorkshop2Ss27UatChecklistResponse({
    dossiers: dossiers as NonNullable<(typeof dossiers)[number]>[],
    env: process.env,
  });
  return NextResponse.json({ ok: true, ...payload });
}

export const GET = withWorkshop2ApiErrorRu(getSs27UatChecklist);
