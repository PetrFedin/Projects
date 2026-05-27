/**
 * Wave J — чистая проверка env без side effects (MOCK warn / SDK init).
 * Workshop2 PG-only demo: `NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1` — Firebase не нужен.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()
  );
}

/** Workshop2 enterprise path не использует Firestore — не шумим MOCK в Console. */
export function isWorkshop2PgOnlyMode(): boolean {
  return process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY === '1';
}

export function shouldEmitFirebaseMockWarn(): boolean {
  if (isFirebaseConfigured()) return false;
  if (isWorkshop2PgOnlyMode()) return false;
  return true;
}
