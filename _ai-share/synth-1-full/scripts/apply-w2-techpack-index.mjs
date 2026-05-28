#!/usr/bin/env node
/**
 * Применяет DDL индекса tech pack к Postgres (нужен DATABASE_URL).
 * Использование: `npm run db:apply:w2-techpack-index`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, 'sql', 'w2_techpack_attachment_index.sql');
const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}
const sql = fs.readFileSync(sqlPath, 'utf8');
const pool = new pg.Pool({ connectionString: url, max: 1 });
try {
  await pool.query(sql);
  console.log('ok: w2_techpack_attachment_index');
} finally {
  await pool.end();
}
