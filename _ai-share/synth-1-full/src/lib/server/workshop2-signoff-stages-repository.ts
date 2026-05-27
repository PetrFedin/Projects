import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import {
  WORKSHOP2_DEFAULT_SIGNOFF_STAGES,
  normalizeWorkshop2SignoffStages,
  type Workshop2SignoffStageDef,
} from '@/lib/production/workshop2-signoff-stages-config';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const FILE_STORE = path.join(process.cwd(), 'data', 'workshop2-signoff-stages.json');

type FileStoreShape = Record<string, Workshop2SignoffStageDef[]>;

function readFileStore(): FileStoreShape {
  try {
    if (!fs.existsSync(FILE_STORE)) return {};
    return JSON.parse(fs.readFileSync(FILE_STORE, 'utf8')) as FileStoreShape;
  } catch {
    return {};
  }
}

function writeFileStore(data: FileStoreShape): void {
  if (process.env.NODE_ENV === 'test') return;
  fs.mkdirSync(path.dirname(FILE_STORE), { recursive: true });
  fs.writeFileSync(FILE_STORE, JSON.stringify(data, null, 2), 'utf8');
}

export async function getWorkshop2CollectionSignoffStages(input: {
  collectionId: string;
  organizationId?: string;
}): Promise<Workshop2SignoffStageDef[]> {
  const collectionId = input.collectionId.trim();
  if (!isWorkshop2PostgresEnabled()) {
    const file = readFileStore();
    return normalizeWorkshop2SignoffStages(file[collectionId]);
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{ stages: Workshop2SignoffStageDef[] }>(
    `SELECT stages FROM workshop2_collection_signoff_stages
     WHERE organization_id = $1 AND collection_id = $2`,
    [input.organizationId ?? 'org-brand-001', collectionId]
  );
  const stages = res.rows[0]?.stages;
  return normalizeWorkshop2SignoffStages(
    stages?.length ? stages : WORKSHOP2_DEFAULT_SIGNOFF_STAGES
  );
}

export async function putWorkshop2CollectionSignoffStages(input: {
  collectionId: string;
  stages: Workshop2SignoffStageDef[];
  organizationId?: string;
}): Promise<Workshop2SignoffStageDef[]> {
  const collectionId = input.collectionId.trim();
  const stages = normalizeWorkshop2SignoffStages(input.stages);
  if (!isWorkshop2PostgresEnabled()) {
    const file = readFileStore();
    file[collectionId] = stages;
    writeFileStore(file);
    return stages;
  }
  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_collection_signoff_stages (organization_id, collection_id, stages, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (organization_id, collection_id) DO UPDATE SET
       stages = EXCLUDED.stages,
       updated_at = NOW()`,
    [input.organizationId ?? 'org-brand-001', collectionId, JSON.stringify(stages)]
  );
  return stages;
}

export function clearWorkshop2SignoffStagesMemoryForTests(): void {
  if (fs.existsSync(FILE_STORE)) fs.unlinkSync(FILE_STORE);
}
