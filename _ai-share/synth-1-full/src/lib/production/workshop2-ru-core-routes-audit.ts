/**
 * Wave 10 P0: core Workshop2 flows не блокируются market=ru (только global-only интеграции в probes).
 */
import {
  WORKSHOP2_ARTICLE_PANE_PARAM,
  parseWorkshop2ArticlePaneParam,
} from '@/lib/production/workshop2-url';
import {
  isWorkshop2IntegrationEnabledForMarket,
  listWorkshop2GlobalOnlyIntegrationIds,
} from '@/lib/production/workshop2-market-profile';

/** Все рабочие вкладки карточки артикула (8 + legacy aliases). */
export const WORKSHOP2_CORE_ARTICLE_PANES = [
  'overview',
  'tz',
  'supply',
  'fit',
  'plan',
  'release',
  'qc',
  'stock',
  'vault',
] as const;

/** API/flows, которые должны оставаться доступны при WORKSHOP2_MARKET=ru. */
export const WORKSHOP2_CORE_API_PATH_PATTERNS = [
  '/api/workshop2/articles/',
  '/dossier',
  '/sample-order',
  '/handoff',
  '/calendar-sync',
  '/chat',
  '/rf-logistics-docs',
  '/export-1c',
  '/marking/',
  '/signoff/',
] as const;

export function auditWorkshop2RuCoreNotDisabled(
  env: Record<string, string | undefined> = process.env
): {
  ok: boolean;
  panesAllowed: string[];
  globalOnlyHidden: string[];
  coreApiPatterns: readonly string[];
  messageRu: string;
} {
  const panesAllowed = WORKSHOP2_CORE_ARTICLE_PANES.map((p) =>
    parseWorkshop2ArticlePaneParam(p)
  ).filter((v): v is string => Boolean(v));
  const globalOnlyHidden = listWorkshop2GlobalOnlyIntegrationIds().filter(
    (id) => !isWorkshop2IntegrationEnabledForMarket(id, env)
  );
  const allPanesParse =
    WORKSHOP2_CORE_ARTICLE_PANES.every((p) => parseWorkshop2ArticlePaneParam(p) != null) &&
    parseWorkshop2ArticlePaneParam('documents') === 'vault';
  const ok =
    allPanesParse && globalOnlyHidden.length === listWorkshop2GlobalOnlyIntegrationIds().length;
  return {
    ok,
    panesAllowed,
    globalOnlyHidden,
    coreApiPatterns: WORKSHOP2_CORE_API_PATH_PATTERNS,
    messageRu: ok
      ? `Рынок РФ: ${panesAllowed.length} вкладок w2pane и core API без market-gate; скрыты только global-only интеграции (${globalOnlyHidden.length}).`
      : 'Аудит core RU: обнаружено блокирование вкладок или интеграций.',
  };
}

export function workshop2ArticlePaneParamName(): string {
  return WORKSHOP2_ARTICLE_PANE_PARAM;
}
