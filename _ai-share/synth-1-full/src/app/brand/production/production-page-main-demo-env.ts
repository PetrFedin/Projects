'use client';

/**
 * Один флаг для legacy `production-page-main`: демо-массивы (`demo-seed.resolve`)
 * и статический контекст коллекций (`demo-context.resolve`).
 *
 * `NEXT_PUBLIC_PRODUCTION_MAIN_USE_DEMO_SEED=false` — без демо-наполнения.
 */
export const PRODUCTION_MAIN_LEGACY_USE_DEMO_SEED =
  typeof process.env.NEXT_PUBLIC_PRODUCTION_MAIN_USE_DEMO_SEED === 'string'
    ? process.env.NEXT_PUBLIC_PRODUCTION_MAIN_USE_DEMO_SEED !== 'false'
    : true;
