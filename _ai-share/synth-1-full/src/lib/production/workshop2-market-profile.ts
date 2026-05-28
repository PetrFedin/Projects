/**
 * Wave 9 RU: рыночный профиль Workshop2 — default `ru`, global-only интеграции скрыты в UI/probes.
 */
export type Workshop2MarketProfile = 'ru' | 'global';

/** Интеграции, неактуальные для РФ по умолчанию (marketScope: global). */
export type Workshop2GlobalOnlyIntegrationId =
  | 'joor'
  | 'nuorder'
  | 'shopify'
  | 'us_edi'
  | 'eu_dpp_registry'
  | 'slack'
  | 'teams';

/** Интеграции, приоритетные для РФ (marketScope: ru). */
export type Workshop2RuIntegrationId =
  | 'edo_kontur'
  | 'edo_sbis'
  | 'moysklad'
  | 'marking_honest_sign'
  | 'yukassa_stub'
  | 'erp_1c_stub'
  | 'domestic_logistics';

const GLOBAL_ONLY: readonly Workshop2GlobalOnlyIntegrationId[] = [
  'joor',
  'nuorder',
  'shopify',
  'us_edi',
  'eu_dpp_registry',
  'slack',
  'teams',
];

const RU_ENABLED: readonly Workshop2RuIntegrationId[] = [
  'edo_kontur',
  'edo_sbis',
  'moysklad',
  'marking_honest_sign',
  'yukassa_stub',
  'erp_1c_stub',
  'domestic_logistics',
];

export function getWorkshop2MarketProfile(
  env: Record<string, string | undefined> = process.env
): Workshop2MarketProfile {
  const raw = String(env.WORKSHOP2_MARKET ?? 'ru')
    .trim()
    .toLowerCase();
  return raw === 'global' ? 'global' : 'ru';
}

export function isWorkshop2RuMarket(
  env: Record<string, string | undefined> = process.env
): boolean {
  return getWorkshop2MarketProfile(env) === 'ru';
}

/** UI/probes: показывать и требовать global-only интеграцию только в global market. */
export function isWorkshop2IntegrationEnabledForMarket(
  integrationId: string,
  env: Record<string, string | undefined> = process.env
): boolean {
  const id = integrationId.trim().toLowerCase() as Workshop2GlobalOnlyIntegrationId;
  if (!(GLOBAL_ONLY as readonly string[]).includes(id)) {
    return true;
  }
  return getWorkshop2MarketProfile(env) === 'global';
}

export function listWorkshop2GlobalOnlyIntegrationIds(): readonly Workshop2GlobalOnlyIntegrationId[] {
  return GLOBAL_ONLY;
}

export function listWorkshop2RuIntegrationIds(): readonly Workshop2RuIntegrationId[] {
  return RU_ENABLED;
}

export function summarizeWorkshop2MarketProfileRu(
  env: Record<string, string | undefined> = process.env
): {
  market: Workshop2MarketProfile;
  globalHidden: readonly Workshop2GlobalOnlyIntegrationId[];
  ruEnabled: readonly Workshop2RuIntegrationId[];
  labelRu: string;
} {
  const market = getWorkshop2MarketProfile(env);
  return {
    market,
    globalHidden: market === 'ru' ? GLOBAL_ONLY : [],
    ruEnabled: RU_ENABLED,
    labelRu:
      market === 'ru'
        ? 'Рынок РФ: западные интеграции (JOOR, Shopify, EU DPP…) скрыты; приоритет ЭДО, МойСклад, маркировка, ЮKassa.'
        : 'Global market: полный набор интеграций.',
  };
}
