#!/usr/bin/env node
/**
 * Проверка готовности контура W2 tech pack (env, S3, Postgres).
 * Подхватывает `.env` и `.env.local` в корне full-пакета.
 *
 *   npm run w2:techpack:preflight
 *   npm run w2:techpack:preflight:strict
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

for (const f of [join(root, '.env'), join(root, '.env.local')]) {
  if (existsSync(f)) {
    dotenv.config({ path: f, override: f.endsWith('.env.local') });
  }
}

const strict = process.argv.includes('--strict');
const issues = [];

function ok(m) {
  console.log(`  ok  ${m}`);
}
function fail(m) {
  console.log(`  NO  ${m}`);
  issues.push(m);
}
function note(m) {
  console.log(`  ..  ${m}`);
}

const remoteOff = process.env.W2_TECHPACK_REMOTE === '0';

console.log('W2 tech pack — preflight\n');

if (remoteOff) {
  fail('W2_TECHPACK_REMOTE=0 — выгрузка отключена (API remote вернёт 503).');
}

const s3 = {
  bucket: process.env.W2_METRICS_S3_BUCKET?.trim(),
  region: process.env.W2_METRICS_S3_REGION?.trim(),
  keyId: process.env.W2_METRICS_S3_ACCESS_KEY_ID?.trim(),
  secret: process.env.W2_METRICS_S3_SECRET_ACCESS_KEY?.trim(),
};
const s3Names = [
  'W2_METRICS_S3_BUCKET',
  'W2_METRICS_S3_REGION',
  'W2_METRICS_S3_ACCESS_KEY_ID',
  'W2_METRICS_S3_SECRET_ACCESS_KEY',
];
const s3Values = [s3.bucket, s3.region, s3.keyId, s3.secret];
const s3Complete = s3Values.every((v) => v && v.length > 0);

console.log('Переменные S3 (metrics, общий с tech pack)');
s3Names.forEach((name, i) => {
  const v = s3Values[i];
  if (v) {
    if (name.includes('SECRET') || name.includes('KEY_ID')) {
      ok(`${name}=(set)`);
    } else {
      ok(`${name}=${v}`);
    }
  } else {
    fail(`${name} not set`);
  }
});
const rawPrefix = process.env.W2_METRICS_S3_PREFIX?.trim() || 'w2-metrics';
ok(`W2_METRICS_S3_PREFIX effective = ${rawPrefix}/techpack/...`);
console.log('');

const dbUrl = process.env.DATABASE_URL?.trim();
console.log('Postgres (индекс вложений)');
if (dbUrl) {
  ok('DATABASE_URL=(set)');
} else {
  fail('DATABASE_URL not set');
}
console.log('');

const apiSec = process.env.W2_TECHPACK_API_SECRET?.trim();
console.log('Auth tech pack');
if (apiSec) {
  ok('W2_TECHPACK_API_SECRET=(set)');
} else {
  if (process.env.NODE_ENV === 'production') {
    fail('W2_TECHPACK_API_SECRET not set (required for production write/read flow)');
  } else {
    note('W2_TECHPACK_API_SECRET not set (dev: often together with W2_TECHPACK_AUTH_DISABLED=1)');
  }
}
if (process.env.W2_TECHPACK_FACTORY_READ_SECRET?.trim()) {
  ok('W2_TECHPACK_FACTORY_READ_SECRET=(set)');
} else {
  note('W2_TECHPACK_FACTORY_READ_SECRET optional; read falls back to W2_TECHPACK_API_SECRET');
}
const so = process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER?.trim();
if (so === '1' || so === 'true') {
  ok('W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER enabled (browser same-origin without public key)');
} else {
  note(
    'W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER not 1 — для прод-кабинета обычно нужно =1 (без NEXT_PUBLIC ключа), см. docs/W2_TECHPACK_PILOT.md'
  );
}
if (process.env.W2_TECHPACK_AUTH_DISABLED === '1' || process.env.W2_TECHPACK_AUTH_DISABLED === 'true') {
  if (process.env.NODE_ENV === 'production') {
    fail('W2_TECHPACK_AUTH_DISABLED set — unsafe in production');
  } else {
    note('W2_TECHPACK_AUTH_DISABLED set (local dev only)');
  }
}
if (process.env.W2_TECHPACK_OPS_LOG_PATH?.trim()) {
  ok(`W2_TECHPACK_OPS_LOG_PATH=${process.env.W2_TECHPACK_OPS_LOG_PATH.trim()}`);
}
console.log('');

console.log('Live checks');
if (s3Complete) {
  try {
    const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3');
    const client = new S3Client({
      region: s3.region,
      credentials: { accessKeyId: s3.keyId, secretAccessKey: s3.secret },
    });
    await client.send(new HeadBucketCommand({ Bucket: s3.bucket }));
    ok(`S3 HeadBucket "${s3.bucket}" (${s3.region})`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    fail(`S3 HeadBucket: ${msg.slice(0, 250)}`);
  }
} else {
  note('S3: skipped (env incomplete).');
}

if (dbUrl) {
  try {
    const pg = (await import('pg')).default;
    const pool = new pg.Pool({ connectionString: dbUrl, max: 1, connectionTimeoutMillis: 8_000 });
    try {
      const r = await pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'w2_techpack_attachment_index'
        ) AS ok`
      );
      const hasTable = r.rows[0]?.ok === true;
      if (hasTable) {
        ok('Postgres: table public.w2_techpack_attachment_index exists');
      } else {
        fail('Postgres: table w2_techpack_attachment_index missing — run: npm run db:apply:w2-techpack-index');
      }
    } finally {
      await pool.end();
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    fail(`Postgres: ${msg.slice(0, 250)}`);
  }
} else {
  note('Postgres: skipped (no DATABASE_URL).');
}

console.log('');
if (issues.length === 0) {
  console.log('Result: all checks passed');
  process.exit(0);
}
console.log(`Result: ${issues.length} problem(s) — see NO lines above.`);
process.exit(strict ? 1 : 0);
