/**
 * Dev-only performance toggles for Node instrumentation bootstrap.
 * Production behavior is unchanged unless E2E flags are set (Playwright prod webServer).
 */
export function shouldSkipEnterpriseBootstrap(): boolean {
  if (process.env.E2E === 'true' || process.env.NEXT_PUBLIC_E2E === 'true') {
    return true;
  }
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.SYNTH_SKIP_ENTERPRISE_BOOTSTRAP === '1';
}
