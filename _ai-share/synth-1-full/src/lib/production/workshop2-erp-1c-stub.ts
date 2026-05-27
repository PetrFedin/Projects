/**
 * Wave 9 RU: экспорт спецификации/BOM в JSON, пригодный для загрузки в 1С (без fake POST без URL).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2ProcessEnvLike } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2Erp1cExportFormat = 'json' | 'commerceml';

export type Workshop2Erp1cExportPayload = {
  format: 'workshop2-1c-bom-v1';
  exportedAt: string;
  collectionId: string;
  articleId: string;
  sku: string | null;
  nomenclature: {
    name: string;
    gtin: string | null;
    markingRequired: boolean;
  };
  bomLines: Array<{
    lineId: string;
    material: string;
    qty: number;
    unit: string;
    costRub?: number;
  }>;
  meta: {
    currency: 'RUB';
    vatRatePct: number;
    noteRu: string;
  };
};

export function resolveWorkshop2Erp1cApiUrl(env: Workshop2ProcessEnvLike = process.env): string {
  return String(env.WORKSHOP2_1C_EXPORT_API_URL ?? env.WORKSHOP2_ERP_1C_API_URL ?? '').trim();
}

export function probeWorkshop2Erp1c(env: Workshop2ProcessEnvLike = process.env): {
  integrationId: 'erp_1c';
  configured: boolean;
  live: boolean;
  journalExport: boolean;
  messageRu: string;
} {
  const url = resolveWorkshop2Erp1cApiUrl(env);
  return {
    integrationId: 'erp_1c',
    configured: Boolean(url),
    live: false,
    journalExport: true,
    messageRu: url
      ? '1С: URL задан — POST только после явного включения live-контракта.'
      : '1С: экспорт JSON в journal (без WORKSHOP2_1C_EXPORT_API_URL).',
  };
}

/** CommerceML 2.10 fragment — номенклатура + спецификация (стандарт обмена 1С). */
export function buildWorkshop2Erp1cCommerceMlFragment(input: {
  payload: Workshop2Erp1cExportPayload;
}): string {
  const p = input.payload;
  const lines = p.bomLines
    .map(
      (l, idx) =>
        `      <Товар>
        <Ид>${l.lineId}</Ид>
        <Наименование>${escapeXml(l.material)}</Наименование>
        <Количество>${l.qty}</Количество>
        <Единица>${escapeXml(l.unit)}</Единица>
        ${l.costRub != null ? `<ЦенаЗаЕдиницу>${l.costRub}</ЦенаЗаЕдиницу>` : ''}
        <НомерСтроки>${idx + 1}</НомерСтроки>
      </Товар>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<КоммерческаяИнформация ВерсияСхемы="2.10" ДатаФормирования="${p.exportedAt.slice(0, 19)}">
  <Каталог>
    <Товары>
      <Товар>
        <Ид>${escapeXml(p.articleId)}</Ид>
        <Наименование>${escapeXml(p.nomenclature.name)}</Наименование>
        <Артикул>${escapeXml(p.sku ?? p.articleId)}</Артикул>
        ${p.nomenclature.gtin ? `<Штрихкод>${escapeXml(p.nomenclature.gtin)}</Штрихкод>` : ''}
      </Товар>
    </Товары>
  </Каталог>
  <Документ>
    <Ид>spec-${escapeXml(p.collectionId)}-${escapeXml(p.articleId)}</Ид>
    <Спецификация>
      <Товары>
${lines}
      </Товары>
    </Спецификация>
  </Документ>
</КоммерческаяИнформация>`;
}

function escapeXml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildWorkshop2Erp1cExportPayload(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  env?: Workshop2ProcessEnvLike;
}): Workshop2Erp1cExportPayload {
  const env = input.env ?? process.env;
  const vatRaw = String(env.WORKSHOP2_B2B_VAT_RATE ?? '20').trim();
  const vatRatePct = Number(vatRaw) || 20;
  const bomLines = (input.dossier.assignments ?? [])
    .filter((a) => a.attributeId === 'mat' || a.kind === 'canonical')
    .slice(0, 12)
    .map((a, idx) => ({
      lineId: `spec-${idx}`,
      material: a.values[0]?.displayLabel ?? a.attributeId ?? 'material',
      qty: 1,
      unit: 'шт',
    }));

  const pb = input.dossier.passportProductionBrief;
  return {
    format: 'workshop2-1c-bom-v1',
    exportedAt: new Date().toISOString(),
    collectionId: input.collectionId,
    articleId: input.articleId,
    sku: input.dossier.sku ?? null,
    nomenclature: {
      name: input.dossier.brandNotes?.slice(0, 120) ?? input.articleId,
      gtin: pb?.gtin ?? null,
      markingRequired: Boolean(pb?.markingRequired),
    },
    bomLines,
    meta: {
      currency: 'RUB',
      vatRatePct,
      noteRu: 'Экспорт для 1С:УНФ/ERP — проверьте соответствие справочнику номенклатуры.',
    },
  };
}

export async function exportWorkshop2Erp1cJournal(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  env?: Workshop2ProcessEnvLike;
  fetchImpl?: typeof fetch;
}): Promise<{
  ok: boolean;
  payload: Workshop2Erp1cExportPayload;
  posted: boolean;
  error?: string;
  messageRu: string;
}> {
  const payload = buildWorkshop2Erp1cExportPayload(input);
  const apiUrl = resolveWorkshop2Erp1cApiUrl(input.env);
  if (!apiUrl) {
    return {
      ok: true,
      payload,
      posted: false,
      messageRu:
        '1С: JSON сформирован (journal). Задайте WORKSHOP2_1C_EXPORT_API_URL для live POST.',
    };
  }

  const fetchFn = input.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined);
  if (!fetchFn) {
    return {
      ok: false,
      payload,
      posted: false,
      error: 'fetch_unavailable',
      messageRu: '1С: URL задан, но fetch недоступен — экспорт только в journal.',
    };
  }

  try {
    const res = await fetchFn(apiUrl.replace(/\/$/, '') + '/bom-export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return {
        ok: false,
        payload,
        posted: false,
        error: `erp_1c_http_${res.status}`,
        messageRu: `1С: HTTP ${res.status} — без fake ACK, данные остаются в journal.`,
      };
    }
    return {
      ok: true,
      payload,
      posted: true,
      messageRu: '1С: POST выполнен (проверьте журнал обмена на стороне 1С).',
    };
  } catch (e) {
    return {
      ok: false,
      payload,
      posted: false,
      error: e instanceof Error ? e.message : 'erp_1c_unreachable',
      messageRu: '1С: сеть недоступна — экспорт сохранён в journal.',
    };
  }
}
