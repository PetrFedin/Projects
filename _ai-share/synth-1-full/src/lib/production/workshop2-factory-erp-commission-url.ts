/**
 * Wave AK — client-safe env resolver для ERP commission URL.
 * Вынесено из workshop2-commission-erp-export.ts, чтобы probes/plm-outbox
 * не тянули server-only repository в client bundle (Workshop2ArticleWorkspace).
 */
export function resolveWorkshop2FactoryErpCommissionUrl(
  env: Record<string, string | undefined> = process.env
): string | null {
  const url = String(
    env.WORKSHOP2_FACTORY_ERP_COMMISSION_URL ?? env.WORKSHOP2_FACTORY_ERP_BASE_URL ?? ''
  ).trim();
  return url || null;
}
