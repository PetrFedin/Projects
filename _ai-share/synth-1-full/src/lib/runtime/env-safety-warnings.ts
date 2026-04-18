/**
 * One-shot diagnostics for unsafe or misconfigured env in production-like runs.
 * Kept intentionally small; expand only when product needs explicit guardrails.
 */
const globalKey = '__synthEnvSafetyWarningsLogged';

export function logEnvSafetyWarningsOnce(): void {
  const g = globalThis as typeof globalThis & { [globalKey]?: boolean };
  if (g[globalKey]) return;
  g[globalKey] = true;

  if (process.env.NODE_ENV !== 'production') return;

  const demoKeys = ['NEXT_PUBLIC_DEMO_MODE', 'NEXT_PUBLIC_ALLOW_MOCK_AUTH'];
  for (const key of demoKeys) {
    if (process.env[key] === 'true') {
      // eslint-disable-next-line no-console
      console.warn(
        `[env] ${key}=true in production build — ensure this is intentional for this deployment.`
      );
    }
  }
}
