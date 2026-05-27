import 'server-only';
import { Pool } from 'pg';

/** URL Postgres для workshop2: приоритет WORKSHOP2_DATABASE_URL → legacy → DATABASE_URL */
export function getWorkshop2DatabaseUrl(): string {
  return (
    process.env.WORKSHOP2_DATABASE_URL?.trim() ||
    process.env.WORKSHOP2_DOSSIER_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    ''
  );
}

export function isWorkshop2PostgresEnabled(): boolean {
  return getWorkshop2DatabaseUrl().length > 0;
}

let pgPool: Pool | null = null;

export function getWorkshop2PgPool(): Pool {
  const url = getWorkshop2DatabaseUrl();
  if (!url) {
    throw new Error('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED');
  }
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: url,
      /** Health/E2E: не блокировать webServer при недоступном Postgres. */
      connectionTimeoutMillis: 5_000,
    });
  }
  return pgPool;
}

/** Сброс пула (тесты). */
export async function resetWorkshop2PgPoolForTests(): Promise<void> {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
}
