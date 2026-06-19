import 'server-only';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2PgCollectionRow = {
  id: string;
  displayName: string;
};

/** Список коллекций из PG (dynamic registry, не только SS27/FW27 preset). */
export async function listWorkshop2PgCollections(): Promise<Workshop2PgCollectionRow[]> {
  if (!isWorkshop2PostgresEnabled()) return [];

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    id: string;
    display_name: string | null;
  }>(`SELECT id, display_name FROM workshop2_collections ORDER BY id ASC`);

  return res.rows.map((row) => ({
    id: row.id,
    displayName: row.display_name?.trim() || row.id,
  }));
}
