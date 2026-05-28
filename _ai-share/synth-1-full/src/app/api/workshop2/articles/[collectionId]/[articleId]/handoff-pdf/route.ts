/**
 * GET — проверка gate перед client-side PDF handoff (409 при blockers).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { listWorkshop2VaultDocumentsFromPg } from '@/lib/server/workshop2-dossier-repository';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';
import { evaluateWorkshop2HandoffPdfExportGate } from '@/lib/production/workshop2-handoff-pdf-export-gate';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const categoryLeafId =
    record.dossier.categoryBindings?.[0]?.categoryLeafId ??
    req.nextUrl.searchParams.get('categoryLeafId')?.trim();

  let vaultFileCount = 0;
  try {
    const docs = await listWorkshop2VaultDocumentsFromPg({
      collectionId: cid,
      articleId: aid,
      organizationId: resolveWorkshop2OrganizationId(req),
    });
    vaultFileCount = docs.filter((d) => d.storagePath?.trim()).length;
  } catch {
    vaultFileCount = (record.dossier.vaultDocuments ?? []).filter((d) =>
      (d as { storagePath?: string }).storagePath?.trim()
    ).length;
  }

  const gate = evaluateWorkshop2HandoffPdfExportGate({
    dossier: record.dossier,
    categoryLeaf: null,
    vaultFileCount,
  });

  if (!gate.allowed) {
    return jsonWorkshop2ErrorRu(409, 'handoff_pdf_blocked', {
      messageRu: 'Экспорт PDF handoff заблокирован.',
      state: gate.state,
      checks: gate.checks,
    });
  }

  return NextResponse.json({ ok: true, allowed: true, state: gate.state, checks: gate.checks });
}
