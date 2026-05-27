/**
 * POST wave 36 #75: PG vault documents → vaultPanelMirror в досье (server path).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { persistWorkshop2VaultPanelMirrorToDossier } from '@/lib/production/workshop2-vault-panel-dossier-persist';
import { isWorkshop2VaultS3ConfiguredFromEnv } from '@/lib/production/workshop2-vault-presign-prod-guard';
import { listWorkshop2VaultDocumentsFromPg } from '@/lib/server/workshop2-dossier-repository';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }
  if (!isWorkshop2PostgresEnabled()) {
    return jsonWorkshop2ErrorRu(503, 'postgres_not_configured', {
      messageRu: 'Vault mirror требует PostgreSQL.',
    });
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const documents = await listWorkshop2VaultDocumentsFromPg({
    collectionId: cid,
    articleId: aid,
  });

  const actor = resolveWorkshop2UpdatedBy(req, '', auth.actor) ?? 'vault-panel-mirror-api';
  const nextDossier = persistWorkshop2VaultPanelMirrorToDossier(record.dossier, {
    backendMode: 'server',
    vaultDocuments: documents.map((d) => ({
      storagePath: d.storagePath,
      metadata: d.metadata,
    })),
    nodeEnv: process.env.NODE_ENV,
    s3Configured: isWorkshop2VaultS3ConfiguredFromEnv(),
    pgIndexedOk: true,
  });

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: nextDossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_vault_panel_mirror_sync' },
  });

  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  return NextResponse.json({
    ok: true,
    mirror: nextDossier.vaultPanelMirror,
    dossier: saved.record.dossier,
    documentCount: documents.length,
    dossierVersion: saved.record.version,
  });
}
