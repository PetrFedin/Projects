/**
 * Персистентность экспорта на platform:
 * - по умолчанию JSON-файл (data/ или INTEGRATION_EXPORT_JOBS_FILE);
 * - при INTEGRATION_EXPORT_DATABASE_URL — Postgres (jsonb, одна строка);
 * - при UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN — Upstash Redis REST (один ключ).
 */

import 'server-only';

import fs from 'fs/promises';
import path from 'path';

type PgPool = import('pg').Pool;

export type JobRecord = {
  orderId: string;
  status: 'accepted' | 'rejected';
  error?: string;
  idempotencyKey?: string;
  updatedAt: string;
};

type PersistedSnapshot = {
  jobs: Record<string, JobRecord>;
  idempotency: Record<string, string>;
};

const jobs = new Map<string, JobRecord>();
const idempotencyToJobId = new Map<string, string>();

let loadPromise: Promise<void> | null = null;
let opChain: Promise<unknown> = Promise.resolve();

let pgPool: PgPool | null = null;

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = opChain.then(fn, fn) as Promise<T>;
  opChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function persistenceMode(): 'file' | 'upstash' | 'postgres' {
  if (process.env.INTEGRATION_EXPORT_DATABASE_URL?.trim()) return 'postgres';
  if (process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()) {
    return 'upstash';
  }
  return 'file';
}

export function getExportJobsFilePath(): string {
  const fromEnv = process.env.INTEGRATION_EXPORT_JOBS_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'integration-export-jobs.json');
}

function upstashKey(): string {
  return process.env.INTEGRATION_EXPORT_UPSTASH_KEY?.trim() || 'syntha:integration-export-jobs';
}

async function upstashCommand(args: (string | number)[]): Promise<unknown> {
  const base = process.env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const r = await fetch(base, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!r.ok) {
    throw new Error(`Upstash HTTP ${r.status}: ${await r.text()}`);
  }
  const j = (await r.json()) as { result?: unknown };
  return j.result;
}

async function loadFileSnapshot(): Promise<PersistedSnapshot | null> {
  const p = getExportJobsFilePath();
  try {
    const raw = await fs.readFile(p, 'utf8');
    return JSON.parse(raw) as PersistedSnapshot;
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return null;
    throw e;
  }
}

async function saveFileSnapshot(snapshot: PersistedSnapshot): Promise<void> {
  const p = getExportJobsFilePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(snapshot), 'utf8');
}

async function loadUpstashSnapshot(): Promise<PersistedSnapshot | null> {
  const raw = await upstashCommand(['GET', upstashKey()]);
  if (raw == null || raw === '') return null;
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as PersistedSnapshot;
  } catch {
    return null;
  }
}

async function saveUpstashSnapshot(snapshot: PersistedSnapshot): Promise<void> {
  await upstashCommand(['SET', upstashKey(), JSON.stringify(snapshot)]);
}

async function getPgPool(): Promise<PgPool> {
  if (!pgPool) {
    const { default: pg } = await import('pg');
    pgPool = new pg.Pool({
      connectionString: process.env.INTEGRATION_EXPORT_DATABASE_URL!.trim(),
      max: 3,
    });
  }
  return pgPool;
}

async function ensurePgTable(p: PgPool): Promise<void> {
  await p.query(`
    CREATE TABLE IF NOT EXISTS integration_export_jobs_snapshot (
      id smallint PRIMARY KEY CHECK (id = 1),
      payload jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function loadPostgresSnapshot(): Promise<PersistedSnapshot | null> {
  const p = await getPgPool();
  await ensurePgTable(p);
  const r = await p.query<{ payload: PersistedSnapshot }>(
    'SELECT payload FROM integration_export_jobs_snapshot WHERE id = 1'
  );
  if (r.rowCount === 0 || !r.rows[0]) return null;
  return r.rows[0].payload;
}

async function savePostgresSnapshot(snapshot: PersistedSnapshot): Promise<void> {
  const p = await getPgPool();
  await ensurePgTable(p);
  await p.query(
    `INSERT INTO integration_export_jobs_snapshot (id, payload)
     VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
    [JSON.stringify(snapshot)]
  );
}

async function loadSnapshotRaw(): Promise<PersistedSnapshot | null> {
  const mode = persistenceMode();
  if (mode === 'postgres') return loadPostgresSnapshot();
  if (mode === 'upstash') return loadUpstashSnapshot();
  return loadFileSnapshot();
}

async function saveSnapshotRaw(snapshot: PersistedSnapshot): Promise<void> {
  const mode = persistenceMode();
  if (mode === 'postgres') return savePostgresSnapshot(snapshot);
  if (mode === 'upstash') return saveUpstashSnapshot(snapshot);
  return saveFileSnapshot(snapshot);
}

function applySnapshot(data: PersistedSnapshot): void {
  const now = new Date().toISOString();
  for (const [k, v] of Object.entries(data.jobs ?? {})) {
    jobs.set(k, {
      ...v,
      updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : now,
    });
  }
  for (const [k, v] of Object.entries(data.idempotency ?? {})) {
    if (typeof v === 'string') idempotencyToJobId.set(k, v);
  }
}

async function readIntoMaps(): Promise<void> {
  const data = await loadSnapshotRaw();
  jobs.clear();
  idempotencyToJobId.clear();
  if (!data) return;
  applySnapshot(data);
}

async function writeMaps(): Promise<void> {
  const snapshot: PersistedSnapshot = {
    jobs: Object.fromEntries(jobs),
    idempotency: Object.fromEntries(idempotencyToJobId),
  };
  await saveSnapshotRaw(snapshot);
}

async function ensureLoadedOnce(): Promise<void> {
  if (!loadPromise) loadPromise = readIntoMaps();
  await loadPromise;
}

function newJobId(): string {
  return `ej_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function ensureIntegrationExportPersistenceLoaded(): Promise<void> {
  await runExclusive(async () => {
    await ensureLoadedOnce();
  });
}

export async function enqueuePlatformExport(input: {
  orderId: string;
  idempotencyKey?: string;
  simulateReject?: boolean;
}): Promise<{
  success: boolean;
  exportJobId: string;
  status: 'accepted' | 'rejected';
  error?: string;
  /** Повторный ответ по тому же Idempotency-Key — не публиковать доменное событие повторно. */
  fromIdempotencyReplay?: true;
  persistedOrderId?: string;
}> {
  return runExclusive(async () => {
    await ensureLoadedOnce();

    if (input.idempotencyKey?.trim()) {
      const key = input.idempotencyKey.trim();
      const existingId = idempotencyToJobId.get(key);
      if (existingId) {
        const j = jobs.get(existingId);
        if (j) {
          return {
            success: j.status === 'accepted',
            exportJobId: existingId,
            status: j.status,
            error: j.error,
            fromIdempotencyReplay: true,
            persistedOrderId: j.orderId,
          };
        }
      }
    }

    const exportJobId = newJobId();
    const status = input.simulateReject ? 'rejected' : 'accepted';
    const error = input.simulateReject ? 'Simulated provider rejection' : undefined;
    const updatedAt = new Date().toISOString();
    jobs.set(exportJobId, {
      orderId: input.orderId,
      status,
      error,
      idempotencyKey: input.idempotencyKey?.trim() || undefined,
      updatedAt,
    });
    if (input.idempotencyKey?.trim()) {
      idempotencyToJobId.set(input.idempotencyKey.trim(), exportJobId);
    }
    await writeMaps();
    return { success: status === 'accepted', exportJobId, status, error };
  });
}

export async function retryPlatformExport(
  exportJobId: string,
  opts?: { simulateReject?: boolean }
): Promise<{
  success: boolean;
  exportJobId: string;
  orderId?: string;
  status?: 'accepted' | 'rejected';
  error?: string;
}> {
  return runExclusive(async () => {
    await ensureLoadedOnce();
    const j = jobs.get(exportJobId);
    if (!j) {
      return { success: false, exportJobId, error: 'export job not found' };
    }
    const status = opts?.simulateReject ? 'rejected' : 'accepted';
    const error = opts?.simulateReject ? 'Simulated provider rejection (retry)' : undefined;
    const updatedAt = new Date().toISOString();
    jobs.set(exportJobId, { ...j, status, error, updatedAt });
    await writeMaps();
    return {
      success: status === 'accepted',
      exportJobId,
      orderId: j.orderId,
      status,
      error,
    };
  });
}

export function getLastPlatformExportActivityIso(): string | undefined {
  let max = 0;
  for (const j of jobs.values()) {
    const t = Date.parse(j.updatedAt);
    if (!Number.isNaN(t) && t > max) max = t;
  }
  return max ? new Date(max).toISOString() : undefined;
}

/** Только для Jest. */
export function __resetIntegrationExportPersistenceForTests(): void {
  if (process.env.NODE_ENV !== 'test') return;
  jobs.clear();
  idempotencyToJobId.clear();
  loadPromise = null;
  opChain = Promise.resolve();
  void pgPool?.end();
  pgPool = null;
}
