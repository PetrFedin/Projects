#!/usr/bin/env node
/**
 * Рабочий WORKSHOP2_DATABASE_URL: localhost:5433 или bridge IP контейнера (OrbStack).
 */
import { spawnSync } from 'node:child_process';
import pg from 'pg';

const DEFAULT = 'postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2';

async function canConnect(url) {
  const pool = new pg.Pool({
    connectionString: url,
    max: 1,
    connectionTimeoutMillis: 3_000,
  });
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  } finally {
    await pool.end().catch(() => {});
  }
}

function dockerBridgeUrl() {
  const inspect = spawnSync(
    'docker',
    [
      'inspect',
      '-f',
      '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}',
      'synth-workshop2-postgres',
    ],
    { encoding: 'utf8' }
  );
  if (inspect.status !== 0) return null;
  const ip = inspect.stdout.trim();
  if (!ip) return null;
  return `postgresql://workshop2:workshop2_dev@${ip}:5432/workshop2`;
}

const candidates = [process.env.WORKSHOP2_DATABASE_URL?.trim(), DEFAULT, dockerBridgeUrl()].filter(
  Boolean
);
const unique = [...new Set(candidates)];

for (const url of unique) {
  if (await canConnect(url)) {
    process.stdout.write(url);
    process.exit(0);
  }
}

process.stdout.write(DEFAULT);
process.exit(0);
