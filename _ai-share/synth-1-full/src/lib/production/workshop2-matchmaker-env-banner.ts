/**
 * Wave 8 P1 #9: баннер demo vs prod для Genkit matchmaker (без fake ACK).
 */
function isWorkshop2GenkitConfiguredFromEnv(env: Record<string, string | undefined>): boolean {
  const key =
    env.GOOGLE_GENAI_API_KEY?.trim() || env.GEMINI_API_KEY?.trim() || env.GOOGLE_API_KEY?.trim();
  return Boolean(key);
}

export type Workshop2MatchmakerEnvBanner = {
  mode: 'demo' | 'production_live' | 'production_unconfigured';
  labelRu: string;
  hintRu: string;
  genkitConfigured: boolean;
  rateLimitPerMinute: number;
};

export function resolveWorkshop2MatchmakerEnvBanner(
  env: Record<string, string | undefined> = process.env
): Workshop2MatchmakerEnvBanner {
  const nodeEnv = String(env.NODE_ENV ?? '').trim();
  const demoFlag = String(env.NEXT_PUBLIC_WORKSHOP2_DEMO_MODE ?? '').trim();
  const genkitConfigured = isWorkshop2GenkitConfiguredFromEnv(env);
  const rateLimitRaw = Number(String(env.WORKSHOP2_MATCHMAKER_RATE_LIMIT_PER_MIN ?? '12').trim());
  const rateLimitPerMinute = Number.isFinite(rateLimitRaw) && rateLimitRaw > 0 ? rateLimitRaw : 12;

  if (nodeEnv !== 'production') {
    const demoOn = demoFlag === '1' || demoFlag === 'true';
    return {
      mode: 'demo',
      labelRu: demoOn ? 'Matchmaker · демо-режим' : 'Matchmaker · dev',
      hintRu: demoOn
        ? 'Демо-fallback разрешён при ошибке API (WORKSHOP2_DEMO_MODE). Prod — только live Genkit.'
        : 'Dev: задайте GOOGLE_GENAI_API_KEY для live matchmaker или включите WORKSHOP2_DEMO_MODE.',
      genkitConfigured,
      rateLimitPerMinute,
    };
  }

  if (!genkitConfigured) {
    return {
      mode: 'production_unconfigured',
      labelRu: 'Matchmaker · не настроен',
      hintRu:
        'Production: задайте GOOGLE_GENAI_API_KEY — mock и silent ACK запрещены (см. /brand/integrations/erp-plm).',
      genkitConfigured: false,
      rateLimitPerMinute,
    };
  }

  return {
    mode: 'production_live',
    labelRu: 'Matchmaker · production',
    hintRu: 'Live Genkit — результаты только из API, без демо-подстановки.',
    genkitConfigured: true,
    rateLimitPerMinute,
  };
}
