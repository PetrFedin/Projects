import 'server-only';

import { Pool } from 'pg';

let runwayPgPool: Pool | null = null;

export function getRunwayDatabaseUrl(): string {
  return process.env.DATABASE_URL?.trim() || '';
}

export function isRunwayPostgresConfigured(): boolean {
  return getRunwayDatabaseUrl().length > 0;
}

export function getRunwayPgPool(): Pool {
  const url = getRunwayDatabaseUrl();
  if (!url) {
    throw new Error('RUNWAY_DATABASE_URL_NOT_CONFIGURED');
  }
  if (!runwayPgPool) {
    runwayPgPool = new Pool({ connectionString: url, max: 5 });
  }
  return runwayPgPool;
}

/** Сброс пула (unit-тесты). */
export async function resetRunwayPgPoolForTests(): Promise<void> {
  if (runwayPgPool) {
    await runwayPgPool.end();
    runwayPgPool = null;
  }
}
