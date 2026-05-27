'use client';

/** Ссылка на настройку интеграций / AI backend (Genkit). */
export const WORKSHOP2_AI_SETUP_HREF = '/brand/integrations/erp-plm';

/**
 * Genkit настроен (клиент: флаг из health или явный NEXT_PUBLIC).
 * На сервере используйте `isWorkshop2AiConfigured` из `workshop2-genkit-health`.
 */
export function isWorkshop2AiConfigured(): boolean {
  const v = process.env.NEXT_PUBLIC_WORKSHOP2_GENKIT_CONFIGURED?.trim();
  if (v === '1' || v === 'true') return true;
  if (v === '0' || v === 'false') return false;
  if (process.env.NODE_ENV !== 'production') return true;
  return false;
}

/**
 * Демо-режим AI-панелей — только в dev/staging и при явном WORKSHOP2_DEMO_MODE.
 * В production mock никогда не подставляется.
 */
export function isWorkshop2DemoModeEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  const v = process.env.NEXT_PUBLIC_WORKSHOP2_DEMO_MODE?.trim();
  return v === '1' || v === 'true';
}

/**
 * Можно подставить демо-mock при ошибке API (DFM / matchmaker).
 * В production без ключа Genkit — всегда false.
 */
export function canWorkshop2UseAiDemoFallback(genkitConfigured?: boolean): boolean {
  if (!isWorkshop2DemoModeEnabled()) return false;
  if (process.env.NODE_ENV === 'production') {
    const configured = genkitConfigured ?? isWorkshop2AiConfigured();
    return configured;
  }
  return true;
}

/** Типичные сообщения при отсутствии Genkit / API keys. */
export function isWorkshop2AiBackendMisconfigured(message: string): boolean {
  return /genkit|api key|GEMINI|GOOGLE_AI|GOOGLE_GENAI|Failed to run|недоступен|503|500/i.test(
    message
  );
}

/** Wave 8: баннер demo vs prod для matchmaker (клиент, без server-only import). */
export function summarizeWorkshop2MatchmakerEnvBannerClient(): {
  mode: 'demo' | 'production_live' | 'production_unconfigured';
  labelRu: string;
  hintRu: string;
} {
  if (process.env.NODE_ENV !== 'production') {
    const demoOn =
      process.env.NEXT_PUBLIC_WORKSHOP2_DEMO_MODE === '1' ||
      process.env.NEXT_PUBLIC_WORKSHOP2_DEMO_MODE === 'true';
    return {
      mode: 'demo',
      labelRu: demoOn ? 'Matchmaker · демо' : 'Matchmaker · dev',
      hintRu: demoOn
        ? 'Демо-fallback при ошибке API. Production — только live Genkit.'
        : 'Dev: GOOGLE_GENAI_API_KEY или WORKSHOP2_DEMO_MODE для fallback.',
    };
  }
  const configured = isWorkshop2AiConfigured();
  if (!configured) {
    return {
      mode: 'production_unconfigured',
      labelRu: 'Matchmaker · не настроен',
      hintRu: 'Production без Genkit — mock запрещён.',
    };
  }
  return {
    mode: 'production_live',
    labelRu: 'Matchmaker · production',
    hintRu: 'Live Genkit — без демо-подстановки.',
  };
}
