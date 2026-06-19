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
  { id: 'centric-plm', label: 'Centric PLM', lifecycle: 'beta', note: 'ADR-002 Wave B' },
  { id: 'nuorder', label: 'NuOrder', lifecycle: 'beta', note: '/api/integrations/v1' },
  { id: 'joor', label: 'JOOR', lifecycle: 'beta', note: '/api/integrations/v1' },
  { id: 'apparel-magic', label: 'Apparel Magic', lifecycle: 'stub', note: 'Wave D5' },
  { id: 'zedonk', label: 'Zedonk', lifecycle: 'stub', note: 'Wave D4' },
  { id: 'aims360', label: 'AIMS360', lifecycle: 'stub', note: 'Wave D1/D6' },
  { id: 'nuorder-archive', label: 'NuOrder (legacy archive)', lifecycle: 'stub', note: 'GET only' },
  { id: 'joor-archive', label: 'JOOR (legacy archive)', lifecycle: 'stub', note: 'GET only' },
] as const;

export function getConnectorLifecycle(id: string): ConnectorLifecycle | undefined {
  return BRAND_CONNECTOR_REGISTRY.find((e) => e.id === id)?.lifecycle;
}
