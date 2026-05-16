import pg from 'pg';
import { w2TechPackIndexPgEnabled } from './w2-tech-pack-index-pg';

type Pool = pg.Pool;

let pool: Pool | null = null;
let inited = false;

function getPool(): Pool | null {
  if (!w2TechPackIndexPgEnabled()) return null;
  if (pool) return pool;
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 20_000,
    });
    return pool;
  } catch {
    return null;
  }
}

export type W2TechPackJob = {
  jobId: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  resultUrl?: string;
  errorDetail?: string;
  updatedAt: string;
};

const DDL = `
CREATE TABLE IF NOT EXISTS w2_techpack_jobs (
  job_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  progress INT NOT NULL DEFAULT 0,
  result_url TEXT,
  error_detail TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

async function initTableIfNeeded() {
  if (inited) return;
  const p = getPool();
  if (!p) return;
  try {
    await p.query(DDL);
    inited = true;
  } catch (e) {
    console.error('[w2_techpack_jobs]', e);
  }
}

const memoryJobs = new Map<string, W2TechPackJob>();

export async function upsertW2TechPackJob(job: Omit<W2TechPackJob, 'updatedAt'> & { updatedAt?: string }): Promise<void> {
  const updatedAt = job.updatedAt ?? new Date().toISOString();
  const fullJob: W2TechPackJob = { ...job, updatedAt };

  if (w2TechPackIndexPgEnabled()) {
    try {
      const p = getPool();
      if (p) {
        await initTableIfNeeded();
        await p.query(
          `INSERT INTO w2_techpack_jobs (job_id, status, progress, result_url, error_detail, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (job_id) DO UPDATE SET
             status = EXCLUDED.status,
             progress = EXCLUDED.progress,
             result_url = EXCLUDED.result_url,
             error_detail = EXCLUDED.error_detail,
             updated_at = EXCLUDED.updated_at`,
          [fullJob.jobId, fullJob.status, fullJob.progress, fullJob.resultUrl ?? null, fullJob.errorDetail ?? null, fullJob.updatedAt]
        );
        return;
      }
    } catch (e) {
      console.error('[w2_techpack_jobs] pg upsert failed, fallback memory', e);
    }
  }
  
  memoryJobs.set(fullJob.jobId, fullJob);
}

export async function getW2TechPackJob(jobId: string): Promise<W2TechPackJob | null> {
  if (w2TechPackIndexPgEnabled()) {
    try {
      const p = getPool();
      if (p) {
        await initTableIfNeeded();
        const r = await p.query(
          `SELECT job_id, status, progress, result_url, error_detail, updated_at
           FROM w2_techpack_jobs WHERE job_id = $1`,
          [jobId]
        );
        if (r.rows.length > 0) {
          const row = r.rows[0];
          return {
            jobId: String(row.job_id),
            status: String(row.status) as 'processing' | 'completed' | 'error',
            progress: Number(row.progress),
            resultUrl: row.result_url ? String(row.result_url) : undefined,
            errorDetail: row.error_detail ? String(row.error_detail) : undefined,
            updatedAt: new Date(row.updated_at).toISOString(),
          };
        }
        return null;
      }
    } catch (e) {
      console.error('[w2_techpack_jobs] pg get failed, fallback memory', e);
    }
  }
  
  return memoryJobs.get(jobId) ?? null;
}
