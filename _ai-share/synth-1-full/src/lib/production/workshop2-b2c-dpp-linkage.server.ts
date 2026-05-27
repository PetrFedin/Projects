/**
 * Server-only lookup B2C slug ↔ досье Workshop2 (PG / file-store).
 * Клиентские компоненты импортируют только workshop2-b2c-dpp-linkage.ts.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  resolveWorkshop2B2cProductSlugFromDossier,
  type Workshop2B2cDppLinkageHit,
} from '@/lib/production/workshop2-b2c-dpp-linkage';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import fs from 'node:fs';
import path from 'node:path';

const STORE_FILE_PATH = path.join(process.cwd(), 'data', 'workshop2-phase1-server-store.json');

/** Скан file-store JSON для slug (dev / без PG). */
export function findWorkshop2DossierByB2cSlugInFileStore(
  slug: string
): Workshop2B2cDppLinkageHit | null {
  const target = slug.trim().toLowerCase();
  if (!target) return null;
  try {
    if (!fs.existsSync(STORE_FILE_PATH)) return null;
    const raw = fs.readFileSync(STORE_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Record<
      string,
      { collectionId?: string; articleId?: string; dossier?: Workshop2DossierPhase1 }
    >;
    for (const row of Object.values(parsed)) {
      if (!row?.dossier || !row.collectionId || !row.articleId) continue;
      const linked = resolveWorkshop2B2cProductSlugFromDossier(row.dossier);
      if (linked && linked.toLowerCase() === target) {
        return {
          collectionId: row.collectionId,
          articleId: row.articleId,
          dossier: row.dossier,
          b2cProductSlug: linked,
        };
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function findWorkshop2DossierByB2cProductSlug(
  slug: string
): Promise<Workshop2B2cDppLinkageHit | null> {
  const fromFile = findWorkshop2DossierByB2cSlugInFileStore(slug);
  if (fromFile) return fromFile;

  const demoPairs = [
    { collectionId: 'SS27', articleId: 'demo-ss27-01' },
    { collectionId: 'SS27', articleId: 'demo-ss27-02' },
  ];
  for (const pair of demoPairs) {
    const record = await getWorkshop2ServerDossierRecord(pair.collectionId, pair.articleId);
    if (!record?.dossier) continue;
    const linked = resolveWorkshop2B2cProductSlugFromDossier(record.dossier);
    if (linked && linked.toLowerCase() === slug.trim().toLowerCase()) {
      return {
        collectionId: pair.collectionId,
        articleId: pair.articleId,
        dossier: record.dossier,
        b2cProductSlug: linked,
      };
    }
  }
  return null;
}
