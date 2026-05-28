/**
 * Скачивание ZIP export-tz-bundle с разбором 409 gate (P1 UX).
 */
import {
  formatWorkshop2GateChecksForUi,
  parseWorkshop2ApiGateChecksFromJson,
  type Workshop2ApiGateCheck,
} from '@/lib/production/workshop2-api-gate-messages';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type Workshop2TzExportBundleDownloadResult =
  | { ok: true; blob: Blob; filename: string }
  | {
      ok: false;
      status: number;
      error?: string;
      messageRu?: string;
      checks?: Workshop2ApiGateCheck[];
    };

function parseContentDispositionFilename(header: string | null): string | undefined {
  if (!header) return undefined;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim());
    } catch {
      return star[1].trim();
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain?.[1]?.trim();
}

export async function downloadWorkshop2TzExportBundleApi(input: {
  collectionId: string;
  articleId: string;
  categoryLeafId?: string;
  sku?: string;
  name?: string;
}): Promise<Workshop2TzExportBundleDownloadResult> {
  const params = new URLSearchParams();
  if (input.categoryLeafId?.trim()) {
    params.set('categoryLeafId', input.categoryLeafId.trim());
  }
  if (input.sku?.trim()) params.set('sku', input.sku.trim());
  if (input.name?.trim()) params.set('name', input.name.trim());
  const q = params.toString() ? `?${params}` : '';
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/export-tz-bundle${q}`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );

  const contentType = res.headers.get('content-type') ?? '';
  if (res.ok && (contentType.includes('zip') || contentType.includes('octet-stream'))) {
    const blob = await res.blob();
    const filename =
      parseContentDispositionFilename(res.headers.get('content-disposition')) ??
      `workshop2-tz-${input.articleId}.zip`;
    return { ok: true, blob, filename };
  }

  let json: unknown = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  const body = json as { error?: string; messageRu?: string };
  return {
    ok: false,
    status: res.status,
    error: body.error,
    messageRu: body.messageRu,
    checks: parseWorkshop2ApiGateChecksFromJson(json),
  };
}

export function describeWorkshop2TzExportBundleFailure(
  result: Extract<Workshop2TzExportBundleDownloadResult, { ok: false }>
): string {
  return formatWorkshop2GateChecksForUi(
    result.checks,
    result.messageRu ?? 'Не удалось сформировать пакет ТЗ (ZIP).'
  );
}

/** Сохранить blob как файл в браузере. */
export function saveWorkshop2TzExportBundleBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
