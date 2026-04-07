import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';
import { applyW2MetricsHotSourceRetentionAfterArchive } from '@/lib/server/workshop2-dossier-metrics-retention';
import { isW2MetricsS3NativeConfigured, putW2MetricsNdjsonToS3 } from '@/lib/server/workshop2-metrics-s3-archive';

export type W2ArchiveWriteResult =
  | { ok: true; target: 'put_url' | 's3' | 'local_dir' | 'skipped_empty' | 'skipped_duplicate' }
  | { ok: false; target: 'error'; message: string };

export type W2ArchiveStateV1 = {
  version: 1;
  lastFingerprint: string;
  lastSuccessAt: string;
  lastRows: number;
  lastTarget: 'put_url' | 's3' | 'local_dir';
};

function ndjsonFromRows(rows: Workshop2DossierMetricsPayload[]): string {
  return rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : '');
}

/** Устойчивый относительно порядка строк в хвосте (мультимножество событий). */
export function buildW2MetricsArchivePayload(rows: Workshop2DossierMetricsPayload[]): {
  body: string;
  fingerprint: string;
  bytes: number;
} {
  const lines = rows.map((r) => JSON.stringify(r)).sort();
  const body = lines.join('\n') + (lines.length ? '\n' : '');
  const fingerprint = createHash('sha256').update(body, 'utf8').digest('hex');
  return { body, fingerprint, bytes: Buffer.byteLength(body, 'utf8') };
}

export function getW2MetricsArchiveStatePath(): string {
  const fromEnv = process.env.W2_METRICS_ARCHIVE_STATE_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'w2-metrics-archive-state.json');
}

async function readArchiveState(): Promise<W2ArchiveStateV1 | null> {
  const p = getW2MetricsArchiveStatePath();
  try {
    const raw = await fs.readFile(p, 'utf8');
    const j = JSON.parse(raw) as W2ArchiveStateV1;
    if (j?.version === 1 && typeof j.lastFingerprint === 'string') return j;
  } catch {
    /* missing or corrupt */
  }
  return null;
}

async function writeArchiveState(next: W2ArchiveStateV1): Promise<void> {
  const p = getW2MetricsArchiveStatePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, `${JSON.stringify(next, null, 0)}\n`, 'utf8');
}

/**
 * Запись тела архива (presigned PUT или локальный файл с именем по fingerprint).
 */
export async function writeW2DossierMetricsArchive(
  body: string,
  fingerprint: string
): Promise<Extract<W2ArchiveWriteResult, { ok: true }>> {
  const putUrl = process.env.W2_METRICS_ARCHIVE_PUT_URL?.trim();
  if (putUrl) {
    const res = await fetch(putUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-ndjson' },
      body,
      signal: AbortSignal.timeout(120_000),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`put ${res.status} ${t.slice(0, 200)}`);
    }
    return { ok: true, target: 'put_url' };
  }

  if (isW2MetricsS3NativeConfigured()) {
    await putW2MetricsNdjsonToS3(body, fingerprint.slice(0, 16));
    return { ok: true, target: 's3' };
  }

  const dir = process.env.W2_METRICS_ARCHIVE_LOCAL_DIR?.trim();
  if (dir) {
    const short = fingerprint.slice(0, 16);
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const file = path.join(dir, `w2-dossier-metrics-${short}-${stamp}.ndjson`);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, body, 'utf8');
    return { ok: true, target: 'local_dir' };
  }

  throw new Error('no_archive_target');
}

export type W2ArchiveJobResult = {
  ok: boolean;
  fingerprint: string | null;
  skipped: 'empty' | 'duplicate' | null;
  write: W2ArchiveWriteResult | null;
  rows: number;
  statePath: string;
  stateUpdated: boolean;
  bytes: number | null;
  durationMs: number;
  error?: string;
  retention?: { redisCleared: boolean; fileTruncated: boolean };
};

/**
 * Идемпотентный архив: тот же срез (по содержимому) не уходит повторно, пока не сменится хвост или ?force=1.
 */
export async function runW2DossierMetricsArchiveJob(
  rows: Workshop2DossierMetricsPayload[],
  options: { force?: boolean }
): Promise<W2ArchiveJobResult> {
  const t0 = Date.now();
  const statePath = getW2MetricsArchiveStatePath();

  if (rows.length === 0) {
    return {
      ok: true,
      fingerprint: null,
      skipped: 'empty',
      write: { ok: true, target: 'skipped_empty' },
      rows: 0,
      statePath,
      stateUpdated: false,
      bytes: null,
      durationMs: Date.now() - t0,
    };
  }

  const { body, fingerprint, bytes } = buildW2MetricsArchivePayload(rows);

  if (!options.force) {
    const prev = await readArchiveState();
    if (prev?.lastFingerprint === fingerprint) {
      return {
        ok: true,
        fingerprint,
        skipped: 'duplicate',
        write: { ok: true, target: 'skipped_duplicate' },
        rows: rows.length,
        statePath,
        stateUpdated: false,
        bytes,
        durationMs: Date.now() - t0,
      };
    }
  }

  try {
    const written = await writeW2DossierMetricsArchive(body, fingerprint);
    const state: W2ArchiveStateV1 = {
      version: 1,
      lastFingerprint: fingerprint,
      lastSuccessAt: new Date().toISOString(),
      lastRows: rows.length,
      lastTarget: written.target,
    };
    await writeArchiveState(state);
    let retention: { redisCleared: boolean; fileTruncated: boolean } | undefined;
    try {
      retention = await applyW2MetricsHotSourceRetentionAfterArchive();
    } catch (e) {
      console.warn('[w2-archive-retention]', e instanceof Error ? e.message : e);
    }
    return {
      ok: true,
      fingerprint,
      skipped: null,
      write: written,
      rows: rows.length,
      statePath,
      stateUpdated: true,
      bytes,
      durationMs: Date.now() - t0,
      retention,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      fingerprint,
      skipped: null,
      write: { ok: false, target: 'error', message: msg },
      rows: rows.length,
      statePath,
      stateUpdated: false,
      bytes,
      durationMs: Date.now() - t0,
      error: msg,
    };
  }
}
