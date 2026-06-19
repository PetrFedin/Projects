#!/usr/bin/env node
/**
 * Dev seed step 1 — проверка WORKSHOP2_DATABASE_URL перед SS27 dossier seed.
 * Цепочка: npm run db:seed:workshop2-dev
 */
import pg from 'pg';

const url =
  process.env.WORKSHOP2_DATABASE_URL?.trim() ||
  process.env.WORKSHOP2_DOSSIER_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!url) {
  console.error('ERROR: WORKSHOP2_DATABASE_URL is required for db:seed:workshop2-dev');
  process.exit(1);
}

process.env.WORKSHOP2_DOSSIER_DATABASE_URL ||= url;

const pool = new pg.Pool({ connectionString: url, max: 1 });
try {
  await pool.query('SELECT 1');
  console.log('== seed-workshop2-dev ==');
  console.log('  WORKSHOP2_DATABASE_URL=set');
  console.log('  postgres: reachable');
} catch (err) {
  console.error('ERROR: cannot reach PostgreSQL:', err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await pool.end();
}
