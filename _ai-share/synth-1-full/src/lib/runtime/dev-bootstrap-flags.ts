/**
 * Dev-only performance toggles for Node instrumentation bootstrap.
 * Production behavior is unchanged regardless of env flags.
 */
export function shouldSkipEnterpriseBootstrap(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.SYNTH_SKIP_ENTERPRISE_BOOTSTRAP === '1';
}
