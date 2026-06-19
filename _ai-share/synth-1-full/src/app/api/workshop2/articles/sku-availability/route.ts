/**
 * GET — проверка занятости SKU (PG dossier assignments) до commit артикула.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { findWorkshop2PgSkuConflict } from '@/lib/server/workshop2-article-sku-availability';
import { normalizeLocalSkuCode } from '@/lib/production/local-collection-inventory';
import {
  resolveWorkshop2OrganizationId,
  workshop2DatabaseNotConfiguredResponse,
} from '@/lib/server/workshop2-api-context';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

async function getSkuAvailability(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const u = new URL(req.url);
  const sku = u.searchParams.get('sku')?.trim() ?? '';
  const collectionId = u.searchParams.get('collectionId')?.trim() ?? '';
  const excludeArticleId = u.searchParams.get('excludeArticleId')?.trim() ?? '';

  const normalized = normalizeLocalSkuCode(sku);
  if (!normalized) {
    return NextResponse.json(
      { ok: false, error: 'invalid_sku', message: 'Укажите SKU' },
      { status: 400 }
    );
  }

  if (!isWorkshop2PostgresEnabled()) {
    return NextResponse.json({
      ok: true,
      available: true,
      source: 'pg_disabled',
      messageRu: 'PG не настроен — проверка дубликата SKU только в коллекции (localStorage).',
    });
  }

  try {
    if (!collectionId) {
      return NextResponse.json(
        { ok: false, error: 'invalid_collection', message: 'Укажите collectionId' },
        { status: 400 }
      );
    }

    const conflict = await findWorkshop2PgSkuConflict({
      sku: normalized,
      collectionId,
      excludeArticleId,
      organizationId: resolveWorkshop2OrganizationId(req),
    });
    if (conflict) {
      return NextResponse.json({
        ok: true,
        available: false,
        source: 'postgres',
        conflict,
        messageRu: `SKU «${normalized}» уже в досье ${conflict.collectionId} / ${conflict.articleId}.`,
      });
    }
    return NextResponse.json({
      ok: true,
      available: true,
      source: 'postgres',
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED')) {
      return NextResponse.json(workshop2DatabaseNotConfiguredResponse(), { status: 503 });
    }
    throw e;
  }
}

export const GET = withWorkshop2ApiErrorRu(getSkuAvailability);
