/**
 * GET /api/workshop2/references/color-master — live PG palette + lab dip linkage summary.
 */
import { NextRequest, NextResponse } from 'next/server';
import { listWorkshop2RefColors } from '@/lib/server/workshop2-references-repository';
import { syncWorkshop2ColorMasterLabDipLinks } from '@/lib/production/workshop2-color-master-lab-dip-link';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { setWorkshop2ColorMasterPalette } from '@/lib/production/workshop2-color-master';

export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const seasonId = req.nextUrl.searchParams.get('seasonId')?.trim() || 'SS27';
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim();

  const colors = await listWorkshop2RefColors(seasonId);
  setWorkshop2ColorMasterPalette(
    colors.items.map((c) => ({
      code: c.code,
      name: c.name,
      hex: c.hex,
      ...(c.pantone ? { pantone: c.pantone } : {}),
    }))
  );

  let labDipMirror = null;
  if (collectionId && articleId) {
    const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
    if (record) {
      const synced = syncWorkshop2ColorMasterLabDipLinks(record.dossier);
      labDipMirror = synced.links;
    }
  }

  return NextResponse.json({
    ok: true,
    seasonId,
    source: colors.source,
    colorCount: colors.items.length,
    colors: colors.items,
    labDipLinks: labDipMirror,
  });
}
