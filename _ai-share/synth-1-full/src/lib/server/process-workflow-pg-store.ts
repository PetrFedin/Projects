import 'server-only';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import type { WorkflowStoreFile } from '@/lib/server/process-workflow-store';

const STORE_ID = 'default';
const STORE_VERSION = 1 as const;

function defaultStore(): WorkflowStoreFile {
  return { version: STORE_VERSION, definitions: {}, runtimes: {} };
}

export function isWorkflowPgStoreEnabled(): boolean {
  return isWorkshop2PostgresEnabled();
}

export async function readWorkflowStoreFromPg(): Promise<WorkflowStoreFile> {
  if (!isWorkshop2PostgresEnabled()) return defaultStore();
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{ store_json: WorkflowStoreFile }>(
    `SELECT store_json FROM platform_core_live_workflow_store WHERE store_id = $1`,
    [STORE_ID]
  );
  const row = res.rows[0];
  if (!row?.store_json || row.store_json.version !== STORE_VERSION) return defaultStore();
  return {
    version: STORE_VERSION,
    definitions: row.store_json.definitions ?? {},
    runtimes: row.store_json.runtimes ?? {},
  };
}

export async function writeWorkflowStoreToPg(store: WorkflowStoreFile): Promise<void> {
  if (!isWorkshop2PostgresEnabled()) return;
  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `INSERT INTO platform_core_live_workflow_store (store_id, store_json, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (store_id) DO UPDATE
       SET store_json = EXCLUDED.store_json,
           updated_at = NOW()`,
    [STORE_ID, JSON.stringify(store)]
  );
}
