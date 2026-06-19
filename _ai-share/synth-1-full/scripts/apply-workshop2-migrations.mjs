#!/usr/bin/env node
/**
 * Применяет DDL из db/migrations к PostgreSQL (идемпотентно, по порядку имён файлов).
 * Использование: `npm run db:apply:workshop2-migrations`
 *
 * Env: WORKSHOP2_DATABASE_URL (preferred) или DATABASE_URL.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const migrationsDir = path.join(root, 'db/migrations');

const url =
  process.env.WORKSHOP2_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!url) {
  console.error(
    'WORKSHOP2_DATABASE_URL or DATABASE_URL is required for db:apply:workshop2-migrations'
  );
  process.exit(1);
}

if (!fs.existsSync(migrationsDir)) {
  console.warn(`skip: migrations dir missing (${migrationsDir})`);
  process.exit(0);
}

const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (files.length === 0) {
  console.warn('skip: no .sql files in db/migrations');
  process.exit(0);
}

const pool = new pg.Pool({
  connectionString: url,
  max: 2,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 5_000,
});

async function queryWithRetry(sql, label, retries = 5) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await pool.query(sql);
    } catch (err) {
      lastErr = err;
      const msg = String(err?.message ?? '');
      const retryable =
        err?.code === 'ECONNRESET' ||
        err?.code === 'ECONNREFUSED' ||
        err?.code === '57P03' ||
        err?.code === '53300' ||
        msg.includes('connection timeout') ||
        msg.includes('Connection terminated');
      if (!retryable || attempt === retries) throw err;
      const delayMs = 400 * attempt;
      console.warn(`retry ${attempt}/${retries - 1} for ${label}: ${err.code ?? err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

try {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await queryWithRetry(sql, file);
    console.log(`ok: ${file}`);
  }
  console.log(`ok: applied ${files.length} migration(s)`);
} catch (err) {
  console.error('FAIL: apply-workshop2-migrations', err);
  process.exit(1);
} finally {
  await pool.end();
}
