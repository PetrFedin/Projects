export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logEnvSafetyWarningsOnce } = await import('@/lib/runtime/env-safety-warnings');
    logEnvSafetyWarningsOnce();
    const { bootstrapEnterpriseEcosystem } = await import('@/lib/core/bootstrap');
    bootstrapEnterpriseEcosystem();
  }
}
