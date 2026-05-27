/**
 * Wave 8 P2 #9: journal commission batch → factory ERP URL (fail-closed без URL).
 */
import { listWorkshop2B2bCommissionLinesForRep } from '@/lib/server/workshop2-b2b-commission-repository';
import { resolveWorkshop2FactoryErpCommissionUrl } from '@/lib/production/workshop2-factory-erp-commission-url';

export { resolveWorkshop2FactoryErpCommissionUrl } from '@/lib/production/workshop2-factory-erp-commission-url';

export type Workshop2CommissionErpExportLine = {
  orderId: string;
  repId: string;
  orderTotalRub: number;
  commissionRub: number;
  customerName?: string;
};

export type Workshop2CommissionErpExportResult = {
  ok: boolean;
  mode: 'erp_post' | 'journal_stub' | 'blocked';
  erpUrl?: string;
  batchId: string;
  lineCount: number;
  totalCommissionRub: number;
  httpStatus?: number;
  messageRu: string;
  error?: string;
};

export async function exportWorkshop2CommissionBatchToErp(input: {
  repId: string;
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
}): Promise<Workshop2CommissionErpExportResult> {
  const env = input.env ?? process.env;
  const repId = input.repId.trim();
  const batchId = `comm-erp-${Date.now()}`;
  const lines = await listWorkshop2B2bCommissionLinesForRep({ repId });
  const totalCommissionRub = lines.reduce((s, l) => s + (l.commissionRub ?? 0), 0);
  const erpUrl = resolveWorkshop2FactoryErpCommissionUrl(env);

  if (!erpUrl) {
    return {
      ok: false,
      mode: 'journal_stub',
      batchId,
      lineCount: lines.length,
      totalCommissionRub,
      messageRu:
        'ERP commission export: WORKSHOP2_FACTORY_ERP_COMMISSION_URL не задан — journal-only, без fake ACK.',
      error: 'erp_url_not_configured',
    };
  }

  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  if (!fetchFn) {
    return {
      ok: false,
      mode: 'blocked',
      erpUrl,
      batchId,
      lineCount: lines.length,
      totalCommissionRub,
      messageRu: 'ERP commission export: fetch недоступен в среде выполнения.',
      error: 'fetch_unavailable',
    };
  }

  try {
    const endpoint = erpUrl.replace(/\/$/, '') + '/commissions/journal';
    const res = await fetchFn(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batchId,
        repId,
        lines: lines.map((l) => ({
          orderId: l.orderId,
          orderTotalRub: l.orderTotalRub,
          commissionRub: l.commissionRub,
          customerName: l.customerName,
        })),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return {
        ok: false,
        mode: 'erp_post',
        erpUrl: endpoint,
        batchId,
        lineCount: lines.length,
        totalCommissionRub,
        httpStatus: res.status,
        messageRu: `ERP commission export: HTTP ${res.status} — batch не принят (fail-closed).`,
        error: `erp_http_${res.status}`,
      };
    }
    return {
      ok: true,
      mode: 'erp_post',
      erpUrl: endpoint,
      batchId,
      lineCount: lines.length,
      totalCommissionRub,
      httpStatus: res.status,
      messageRu: `ERP commission: ${lines.length} строк, ${totalCommissionRub.toLocaleString('ru-RU')} ₽ отправлено в journal.`,
    };
  } catch (e) {
    return {
      ok: false,
      mode: 'erp_post',
      erpUrl,
      batchId,
      lineCount: lines.length,
      totalCommissionRub,
      messageRu: 'ERP commission export: сеть недоступна — fail-closed.',
      error: e instanceof Error ? e.message : 'erp_unreachable',
    };
  }
}
