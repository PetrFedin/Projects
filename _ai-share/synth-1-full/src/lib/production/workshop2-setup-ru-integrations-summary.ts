/**
 * Wave 12: однострочная сводка RU-интеграций для setup/health.
 * Client-safe: только env-probes, без workshop2-live-integration-probes (node:fs).
 */
import { resolveWorkshop2EdoProvider } from '@/lib/production/workshop2-edo-signoff';
import { probeWorkshop2Erp1c } from '@/lib/production/workshop2-erp-1c-stub';
import { probeWorkshop2MarkingHonestSign } from '@/lib/production/workshop2-marking-honest-sign';
import { resolveWorkshop2MoySkladConfig } from '@/lib/production/workshop2-moysklad-wms-adapter';
import type { Workshop2SetupHealthRow } from '@/lib/production/workshop2-setup-health-summary';

export function buildWorkshop2SetupRuIntegrationRows(
  env: Record<string, string | undefined> = process.env
): Workshop2SetupHealthRow[] {
  const edoProvider = resolveWorkshop2EdoProvider(env);
  const edoKonturConfigured = Boolean(env.WORKSHOP2_KONTUR_EDO_API_URL?.trim());
  const edoSbisConfigured = Boolean(env.WORKSHOP2_SBIS_EDO_API_URL?.trim());
  const edoConfigured = edoKonturConfigured || edoSbisConfigured;
  const moySklad = resolveWorkshop2MoySkladConfig(env);
  const markingHonestSign = probeWorkshop2MarkingHonestSign(env);
  const erp1c = probeWorkshop2Erp1c(env);
  const yukassaConfigured = Boolean(env.YUKASSA_SHOP_ID?.trim());

  const parts: string[] = [];
  if (edoConfigured) parts.push(`ЭДО:${edoProvider}`);
  else parts.push('ЭДО:off');
  if (moySklad.configured) parts.push('МойСклад');
  if (markingHonestSign.configured) parts.push('ЧЗ');
  if (erp1c.configured) parts.push('1С');
  if (yukassaConfigured) parts.push('ЮKassa');
  parts.push('счёт-оферта');

  const configuredCount = [
    edoConfigured,
    moySklad.configured,
    markingHonestSign.configured,
    erp1c.configured,
    yukassaConfigured,
  ].filter(Boolean).length;

  return [
    {
      id: 'ru-integrations',
      labelRu: 'Интеграции РФ (probes)',
      status: configuredCount >= 2 ? 'ok' : configuredCount >= 1 ? 'warn' : 'off',
      detailRu: `${parts.join(' · ')} — подробнее: GET /api/workshop2/integration-probes → wave9RuHorizontal / wave10RuHorizontal`,
    },
  ];
}

export function summarizeWorkshop2SetupRuIntegrationsOneLiner(
  env: Record<string, string | undefined> = process.env
): string {
  const row = buildWorkshop2SetupRuIntegrationRows(env)[0];
  return row ? `${row.labelRu}: ${row.detailRu}` : '';
}
