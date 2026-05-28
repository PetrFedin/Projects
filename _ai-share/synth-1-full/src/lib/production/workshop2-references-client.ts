/**
 * Клиент GET /api/workshop2/references/* (read-only справочники).
 */

import type { Workshop2ProductionMeasurement } from '@/lib/production/workshop2-dossier-phase1.types';
import type {
  Workshop2MaterialLibraryRow,
  Workshop2PomTemplateRow,
} from '@/lib/production/workshop2-reference-seeds';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type Workshop2RefColorDto = {
  code: string;
  name: string;
  hex: string;
  pantone?: string;
};

export type Workshop2RefTnvedDto = {
  code: string;
  label: string;
  leafId?: string;
  chapterHint?: string;
};

export type Workshop2ReferencesPayload<T> = {
  ok?: boolean;
  source: 'postgres' | 'static';
  items: T[];
  leafId?: string;
};

async function fetchJson<T>(path: string): Promise<{ data: T | null; status: number }> {
  try {
    const res = await fetch(path, {
      cache: 'no-store',
      headers: buildWorkshop2ApiRequestHeaders(),
    });
    if (!res.ok) return { data: null, status: res.status };
    return { data: (await res.json()) as T, status: res.status };
  } catch {
    return { data: null, status: 0 };
  }
}

async function fetchReferencesData<T>(path: string): Promise<T | null> {
  const { data } = await fetchJson<T>(path);
  return data;
}

/** Wave 11: статус ответа для UI (503 → static fallback hint). */
export async function fetchWorkshop2ReferencesApiStatus(path: string): Promise<number> {
  const { status } = await fetchJson<unknown>(path);
  return status;
}

export async function fetchWorkshop2RefColors(): Promise<Workshop2ReferencesPayload<Workshop2RefColorDto> | null> {
  return fetchReferencesData('/api/workshop2/references/colors');
}

export async function fetchWorkshop2RefTnved(
  leafId?: string
): Promise<Workshop2ReferencesPayload<Workshop2RefTnvedDto> | null> {
  const q = leafId?.trim() ? `?leafId=${encodeURIComponent(leafId.trim())}` : '';
  return fetchReferencesData(`/api/workshop2/references/tnved${q}`);
}

export async function fetchWorkshop2RefMaterials(): Promise<Workshop2ReferencesPayload<Workshop2MaterialLibraryRow> | null> {
  return fetchReferencesData('/api/workshop2/references/materials');
}

export async function fetchWorkshop2RefPomTemplates(
  leafId: string
): Promise<Workshop2ReferencesPayload<Workshop2PomTemplateRow> | null> {
  return fetchReferencesData(
    `/api/workshop2/references/pom-templates?leafId=${encodeURIComponent(leafId.trim())}`
  );
}

export async function fetchWorkshop2ReferencesStatus(): Promise<{
  ok?: boolean;
  postgres: 'ok' | 'down' | 'disabled';
  directories: Record<string, 'postgres' | 'static'>;
} | null> {
  return fetchReferencesData('/api/workshop2/references/status');
}

export type Workshop2CategoryLeafMetaDto = {
  leafId: string;
  pathLabel: string;
  l1?: string;
  l2?: string;
  l3?: string;
  defaultAudienceHint?: string;
};

export async function fetchWorkshop2CategoryLeafMeta(
  leafId: string
): Promise<{ source: 'postgres' | 'static'; item: Workshop2CategoryLeafMetaDto | null } | null> {
  const q = encodeURIComponent(leafId.trim());
  return fetchReferencesData(`/api/workshop2/references/categories?leafId=${q}`);
}

export async function putWorkshop2RefColor(input: {
  code: string;
  name: string;
  hex: string;
  pantone?: string;
}): Promise<Workshop2ReferencesPayload<Workshop2RefColorDto> | null> {
  try {
    const res = await fetch('/api/workshop2/references/colors', {
      method: 'PUT',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    return (await res.json()) as Workshop2ReferencesPayload<Workshop2RefColorDto>;
  } catch {
    return null;
  }
}

export type Workshop2RefAttributeDto = {
  attributeId: string;
  name: string;
  groupId: string;
  requiredForPhase1: boolean;
  hasOverride: boolean;
  overrideLabel?: string;
};

export async function fetchWorkshop2RefAttributes(): Promise<Workshop2ReferencesPayload<Workshop2RefAttributeDto> | null> {
  return fetchReferencesData('/api/workshop2/references/attributes');
}

export async function putWorkshop2RefAttribute(
  attributeId: string,
  input: { label?: string; requiredForPhase1?: boolean }
): Promise<Workshop2ReferencesPayload<Workshop2RefAttributeDto> | null> {
  try {
    const res = await fetch(
      `/api/workshop2/references/attributes/${encodeURIComponent(attributeId.trim())}`,
      {
        method: 'PUT',
        headers: buildWorkshop2ApiRequestHeaders(),
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as Workshop2ReferencesPayload<Workshop2RefAttributeDto>;
  } catch {
    return null;
  }
}

export async function putWorkshop2RefMaterial(input: {
  id: string;
  name: string;
  role: string;
  supplier?: string;
  composition?: string;
  gsm?: number;
  priceUsd?: number;
  certCode?: string;
}): Promise<Workshop2ReferencesPayload<Workshop2MaterialLibraryRow> | null> {
  try {
    const res = await fetch('/api/workshop2/references/materials', {
      method: 'PUT',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    return (await res.json()) as Workshop2ReferencesPayload<Workshop2MaterialLibraryRow>;
  } catch {
    return null;
  }
}

export async function deleteWorkshop2RefMaterial(
  id: string
): Promise<Workshop2ReferencesPayload<Workshop2MaterialLibraryRow> | null> {
  try {
    const res = await fetch(
      `/api/workshop2/references/materials?id=${encodeURIComponent(id.trim())}`,
      {
        method: 'DELETE',
        headers: buildWorkshop2ApiRequestHeaders(),
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as Workshop2ReferencesPayload<Workshop2MaterialLibraryRow>;
  } catch {
    return null;
  }
}

export async function putWorkshop2RefTnved(input: {
  code: string;
  description: string;
  leafId?: string;
  chapter?: string;
}): Promise<Workshop2ReferencesPayload<Workshop2RefTnvedDto> | null> {
  try {
    const res = await fetch('/api/workshop2/references/tnved', {
      method: 'PUT',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    return (await res.json()) as Workshop2ReferencesPayload<Workshop2RefTnvedDto>;
  } catch {
    return null;
  }
}

export async function deleteWorkshop2RefTnved(
  code: string
): Promise<Workshop2ReferencesPayload<Workshop2RefTnvedDto> | null> {
  try {
    const res = await fetch(
      `/api/workshop2/references/tnved?code=${encodeURIComponent(code.trim())}`,
      {
        method: 'DELETE',
        headers: buildWorkshop2ApiRequestHeaders(),
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as Workshop2ReferencesPayload<Workshop2RefTnvedDto>;
  } catch {
    return null;
  }
}

export type Workshop2PomApplyResponse = {
  ok: boolean;
  leafId?: string;
  template?: Workshop2PomTemplateRow;
  mode?: 'merge' | 'replace';
  measurements?: Workshop2ProductionMeasurement[];
  error?: string;
};

export async function applyWorkshop2PomTemplate(input: {
  leafId: string;
  templateLabel?: string;
  mode?: 'merge' | 'replace';
}): Promise<Workshop2PomApplyResponse | null> {
  try {
    const res = await fetch('/api/workshop2/references/pom-templates/apply', {
      method: 'POST',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify(input),
    });
    return (await res.json()) as Workshop2PomApplyResponse;
  } catch {
    return null;
  }
}

export async function importWorkshop2RefColorsCsv(
  csv: string
): Promise<{ ok: boolean; imported?: number; error?: string; message?: string } | null> {
  try {
    const res = await fetch('/api/workshop2/references/colors/import', {
      method: 'POST',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify({ csv }),
    });
    return (await res.json()) as {
      ok: boolean;
      imported?: number;
      error?: string;
      message?: string;
    };
  } catch {
    return null;
  }
}

export type Workshop2SizeScaleImportResponse = {
  ok: boolean;
  mode?: 'postgres' | 'validate_only';
  upserted?: number;
  message?: string;
  error?: string;
  report?: {
    totalLines: number;
    valid: number;
    invalid: number;
  };
};

export async function importWorkshop2SizeScalesCsv(
  csv: string
): Promise<Workshop2SizeScaleImportResponse | null> {
  try {
    const res = await fetch('/api/workshop2/references/size-scales/import', {
      method: 'POST',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify({ csv }),
    });
    return (await res.json()) as Workshop2SizeScaleImportResponse;
  } catch {
    return null;
  }
}

export async function fetchWorkshop2RequiredFields(leafId: string): Promise<{
  ok?: boolean;
  leafId: string;
  count: number;
  requiredIds: string[];
  fromCatalogRequiredForPhase1: string[];
  fromInfoPickMatrix: string[];
  fromTzLeafRequirements: string[];
  pathLabel?: string;
} | null> {
  const q = encodeURIComponent(leafId.trim());
  return fetchReferencesData(`/api/workshop2/references/required-fields?leafId=${q}`);
}

export type Workshop2ArticlesImportResponse = {
  ok: boolean;
  commit?: boolean;
  committed?: number;
  commitErrors?: { sku: string; error: string }[];
  total: number;
  imported: number;
  failed: number;
  maxRows: number;
  rows: Array<
    | {
        ok: true;
        sku: string;
        leafId: string;
        audienceId: string;
        preview: string;
        dossier: unknown;
      }
    | { ok: false; sku: string; error: string }
  >;
  error?: string;
  message?: string;
};

export async function importWorkshop2ArticlesCsv(
  csv: string,
  collectionId?: string,
  options?: { commit?: boolean }
): Promise<Workshop2ArticlesImportResponse | null> {
  try {
    const res = await fetch('/api/workshop2/articles/import', {
      method: 'POST',
      headers: buildWorkshop2ApiRequestHeaders(),
      body: JSON.stringify({
        csv,
        ...(collectionId ? { collectionId } : {}),
        ...(options?.commit ? { commit: true } : {}),
      }),
    });
    return (await res.json()) as Workshop2ArticlesImportResponse;
  } catch {
    return null;
  }
}

export async function syncWorkshop2CategoriesFromHandbook(): Promise<{
  ok: boolean;
  upserted?: number;
  total?: number;
  message?: string;
  error?: string;
} | null> {
  try {
    const res = await fetch('/api/workshop2/references/categories/sync-from-handbook', {
      method: 'POST',
      headers: buildWorkshop2ApiRequestHeaders(),
    });
    return (await res.json()) as {
      ok: boolean;
      upserted?: number;
      total?: number;
      message?: string;
      error?: string;
    };
  } catch {
    return null;
  }
}

/** Атрибуты досье с полем ТН ВЭД (10 знаков). */
export function isWorkshop2TnvedAttributeId(attributeId: string): boolean {
  const id = attributeId.toLowerCase();
  return (
    id.startsWith('customs') ||
    id.includes('tnved') ||
    id.includes('тнвэд') ||
    id === 'tnved' ||
    id.includes('hs-10')
  );
}

export type Workshop2AttributeRegistryDto = {
  ok?: boolean;
  leafId?: string;
  aliases: Record<string, string>;
  catalogToInfoPick: Record<string, string[]>;
  unresolvedInfoPickKeys: string[];
};

export async function fetchWorkshop2AttributeRegistry(
  leafId?: string
): Promise<Workshop2AttributeRegistryDto | null> {
  const q = leafId?.trim() ? `?leafId=${encodeURIComponent(leafId.trim())}` : '';
  return fetchReferencesData(`/api/workshop2/references/attribute-aliases${q}`);
}
