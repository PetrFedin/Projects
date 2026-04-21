/**
 * Реестр интеграций: режим «коннектор» vs страница-заглушка.
 * UI страницы `/brand/integrations` может подмешивать статусы отсюда без дублирования id.
 */

export type ConnectorLifecycle = 'stub' | 'beta' | 'live';

export type ConnectorRegistryEntry = {
  id: string;
  label: string;
  lifecycle: ConnectorLifecycle;
  /** Кратко для бейджа в списке */
  note?: string;
};

export const BRAND_CONNECTOR_REGISTRY: readonly ConnectorRegistryEntry[] = [
  { id: 'erp-plm', label: 'ERP / PLM', lifecycle: 'stub', note: 'OAuth + sync в плане' },
  { id: 'webhooks', label: 'Webhooks', lifecycle: 'beta', note: 'Подпись запросов' },
  { id: 'sso', label: 'SSO', lifecycle: 'stub', note: 'SAML/OIDC' },
  { id: 'nuorder-archive', label: 'NuOrder (legacy)', lifecycle: 'stub', note: 'Архив' },
  { id: 'joor-archive', label: 'JOOR (legacy)', lifecycle: 'stub', note: 'Архив' },
] as const;

export function getConnectorLifecycle(id: string): ConnectorLifecycle | undefined {
  return BRAND_CONNECTOR_REGISTRY.find((e) => e.id === id)?.lifecycle;
}
