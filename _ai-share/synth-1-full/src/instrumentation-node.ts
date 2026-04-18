export async function registerNodeRuntimeInstrumentation(): Promise<void> {
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

  const { logEnvSafetyWarningsOnce } = await import('@/lib/runtime/env-safety-warnings');
  logEnvSafetyWarningsOnce();

  // Keep build workers side-effect free; start background systems only on server runtime.
  if (!isBuildPhase) {
    const { bootstrapEnterpriseEcosystem } = await import('@/lib/core/bootstrap');
    bootstrapEnterpriseEcosystem();
  }
}
