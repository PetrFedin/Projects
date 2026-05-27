/**
 * Wave 5 P1 #71: MoySklad WMS stock snapshot → internal reserve hints (honest adapter).
 */
export type Workshop2MoySkladStockRow = {
  externalId: string;
  name: string;
  quantity: number;
  reserve?: number;
  uom?: string;
};

export type Workshop2MoySkladImportResult = {
  ok: boolean;
  httpStatus?: number;
  fetchedCount: number;
  mappedHints: Array<{
    supplyLineId: string;
    label: string;
    qty: number;
    unit: string;
    externalSku: string;
    reserveHint: number;
    availableHint: number;
    importStatus: 'mapped' | 'partial' | 'skipped';
  }>;
  messageRu: string;
  moySkladUrl?: string;
  partialUiLink?: string;
};

export function resolveWorkshop2MoySkladConfig(
  env: Record<string, string | undefined> = process.env
): {
  configured: boolean;
  baseUrl: string;
  token: string;
} {
  const baseUrl = String(
    env.ERP_MOYSKLAD_URL ?? env.MOYSKLAD_API_URL ?? 'https://api.moysklad.ru/api/remap/1.2'
  ).trim();
  const token = String(env.ERP_MOYSKLAD_TOKEN ?? env.MOYSKLAD_TOKEN ?? '').trim();
  return { configured: Boolean(baseUrl && token), baseUrl, token };
}

export async function fetchWorkshop2MoySkladStockSnapshot(input: {
  baseUrl: string;
  token: string;
  limit?: number;
}): Promise<{
  ok: boolean;
  httpStatus: number;
  rows: Workshop2MoySkladStockRow[];
  error?: string;
  messageRu?: string;
}> {
  const limit = Math.min(Math.max(input.limit ?? 50, 1), 100);
  const url = `${input.baseUrl.replace(/\/$/, '')}/report/stock/all?limit=${limit}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${input.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json;charset=utf-8',
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      const errRu =
        res.status === 401
          ? 'МойСклад: неверный токен (MOYSKLAD_TOKEN / ERP_MOYSKLAD_TOKEN).'
          : res.status === 403
            ? 'МойСклад: доступ запрещён — проверьте права токена.'
            : `МойСклад: HTTP ${res.status} — импорт остатков не выполнен.`;
      return {
        ok: false,
        httpStatus: res.status,
        rows: [],
        error: `moysklad_http_${res.status}`,
        messageRu: errRu,
      };
    }
    const data = (await res.json()) as { rows?: Array<Record<string, unknown>> };
    const rows = (data.rows ?? []).map((r, idx) => {
      const meta = r.meta as { href?: string } | undefined;
      const href = meta?.href ?? '';
      const externalId = href.split('/').pop() ?? `row-${idx}`;
      const name = String(
        (r.name as string | undefined) ?? (r.assortment as { name?: string })?.name ?? 'item'
      );
      const quantity = Number(r.quantity ?? r.stock ?? 0) || 0;
      const reserve = Number(r.reserve ?? 0) || 0;
      const uomRaw = r.uom as { name?: string } | string | undefined;
      const uom =
        typeof uomRaw === 'object' && uomRaw?.name
          ? String(uomRaw.name)
          : typeof uomRaw === 'string'
            ? uomRaw
            : 'шт';
      return { externalId, name, quantity, reserve, uom };
    });
    return { ok: true, httpStatus: res.status, rows };
  } catch (e) {
    return {
      ok: false,
      httpStatus: 0,
      rows: [],
      error: e instanceof Error ? e.message : 'fetch_failed',
      messageRu: 'МойСклад: сеть недоступна — проверьте MOYSKLAD_TOKEN и доступ к api.moysklad.ru.',
    };
  }
}

export function mapWorkshop2MoySkladStockToWmsHints(input: {
  stockRows: Workshop2MoySkladStockRow[];
  supplyLines: Array<{ id: string; label: string; qty: number; unit: string; sourceNote?: string }>;
}): Workshop2MoySkladImportResult['mappedHints'] {
  return input.supplyLines.map((line) => {
    const needle = (line.sourceNote ?? line.label ?? line.id).toLowerCase();
    const match = input.stockRows.find(
      (r) =>
        r.name.toLowerCase().includes(needle.slice(0, 12)) ||
        r.externalId === line.id ||
        needle.includes(r.name.toLowerCase().slice(0, 8))
    );
    if (!match) {
      return {
        supplyLineId: line.id,
        label: line.label,
        qty: line.qty,
        unit: line.unit,
        externalSku: line.id,
        reserveHint: 0,
        availableHint: 0,
        importStatus: 'skipped' as const,
      };
    }
    const availableHint = Math.max(0, match.quantity - (match.reserve ?? 0));
    const reserveHint = Math.min(line.qty, availableHint);
    return {
      supplyLineId: line.id,
      label: line.label,
      qty: line.qty,
      unit: line.unit,
      externalSku: match.externalId,
      reserveHint,
      availableHint,
      importStatus: reserveHint >= line.qty ? ('mapped' as const) : ('partial' as const),
    };
  });
}

export function buildWorkshop2MoySkladImportSummary(input: {
  fetchOk: boolean;
  httpStatus: number;
  mappedHints: Workshop2MoySkladImportResult['mappedHints'];
  collectionId: string;
  articleId: string;
  dryRun: boolean;
}): Workshop2MoySkladImportResult {
  const mapped = input.mappedHints.filter((h) => h.importStatus !== 'skipped').length;
  const partial = input.mappedHints.some((h) => h.importStatus === 'partial');
  const partialUiLink = `/brand/production/workshop2?collection=${encodeURIComponent(input.collectionId)}&article=${encodeURIComponent(input.articleId)}&w2pane=stock`;
  let messageRu: string;
  if (!input.fetchOk) {
    messageRu = `МойСклад: HTTP ${input.httpStatus || 'ошибка'} — импорт остатков не выполнен (без fake GRN).`;
  } else if (input.dryRun) {
    messageRu = `Пробный импорт: ${mapped} строк сопоставлено из остатков МойСклад.`;
  } else if (mapped === 0) {
    messageRu =
      'Остатки получены, но сопоставлений со снабжением нет — проверьте sourceNote в BOM.';
  } else {
    messageRu = partial
      ? `Частичный импорт остатков: ${mapped} строк (см. вкладку stock).`
      : `Импорт остатков: ${mapped} строк из МойСклад.`;
  }
  return {
    ok: input.fetchOk && mapped > 0,
    httpStatus: input.httpStatus,
    fetchedCount: input.mappedHints.length,
    mappedHints: input.mappedHints,
    messageRu,
    partialUiLink: partial || !input.fetchOk ? partialUiLink : undefined,
  };
}
