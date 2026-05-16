/**
 * Обёртка над `production-page-main-demo-context.ts` — уважает
 * `NEXT_PUBLIC_PRODUCTION_MAIN_USE_DEMO_SEED` (см. `production-page-main-demo-env.ts`).
 */
'use client';

import { INITIAL_PRODUCTION_CONTEXT_DATA as FULL_INITIAL_PRODUCTION_CONTEXT_DATA } from '@/app/brand/production/production-page-main-demo-context';
import { PRODUCTION_MAIN_LEGACY_USE_DEMO_SEED } from '@/app/brand/production/production-page-main-demo-env';

export const INITIAL_PRODUCTION_CONTEXT_DATA = PRODUCTION_MAIN_LEGACY_USE_DEMO_SEED
  ? FULL_INITIAL_PRODUCTION_CONTEXT_DATA
  : {};
