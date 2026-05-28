import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/**
 * CAD post-ingest: мерки и метаданные из vault / tech pack — без браузерного редактора лекал.
 *
 * Минимум для «готовности» CAD viewer: ≥1 строка мерок с source `vault_metadata`
 * (cad-ingest кладёт `measures[]` в metadata загруженного файла).
 * POM/tech pack — дополнительная связь, не заменяют ingest metadata.
 */

/** Минимальное число мерок из metadata vault после cad-ingest. */
export const WORKSHOP2_CAD_VIEWER_MIN_VAULT_METADATA_MEASURES = 1;

export type Workshop2CadMeasureEntry = {
  id: string;
  label: string;
  valueCm?: number;
  tolerancePlusCm?: number;
  toleranceMinusCm?: number;
  /** Откуда взята строка для просмотра (не САПР-редактор). */
  source: 'vault_metadata' | 'tech_pack_metadata' | 'dossier_pom';
};

export type Workshop2CadViewerDocument = {
  documentId: string;
  fileName: string;
  mimeType?: string;
  storagePath?: string;
  uploadedAt?: string;
  measures: Workshop2CadMeasureEntry[];
};

type RawMeasure = {
  id?: string;
  label?: string;
  name?: string;
  valueCm?: number;
  value?: number;
  tolerancePlusCm?: number;
  toleranceMinusCm?: number;
};

function normalizeMeasure(
  raw: RawMeasure,
  source: Workshop2CadMeasureEntry['source'],
  idx: number
): Workshop2CadMeasureEntry | null {
  const label = String(raw.label ?? raw.name ?? '').trim();
  if (!label) return null;
  const valueCm =
    typeof raw.valueCm === 'number' && Number.isFinite(raw.valueCm)
      ? raw.valueCm
      : typeof raw.value === 'number' && Number.isFinite(raw.value)
        ? raw.value
        : undefined;
  return {
    id: String(raw.id ?? `${source}-${idx}`),
    label,
    valueCm,
    tolerancePlusCm:
      typeof raw.tolerancePlusCm === 'number' && Number.isFinite(raw.tolerancePlusCm)
        ? raw.tolerancePlusCm
        : undefined,
    toleranceMinusCm:
      typeof raw.toleranceMinusCm === 'number' && Number.isFinite(raw.toleranceMinusCm)
        ? raw.toleranceMinusCm
        : undefined,
    source,
  };
}

/** Мерки из metadata vault-документа (cad-ingest кладёт measures[] при загрузке). */
export function extractCadMeasuresFromVaultMetadata(
  metadata: Record<string, unknown> | undefined
): Workshop2CadMeasureEntry[] {
  if (!metadata) return [];
  const raw = metadata.measures;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m, i) => normalizeMeasure(m as RawMeasure, 'vault_metadata', i))
    .filter((x): x is Workshop2CadMeasureEntry => x != null);
}

/** Мерки из tech pack attachment (локальные метаданные после ingest). */
export function extractCadMeasuresFromTechPackMeta(
  meta: Record<string, unknown> | undefined
): Workshop2CadMeasureEntry[] {
  if (!meta) return [];
  const raw = meta.cadMeasures ?? meta.measures;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m, i) => normalizeMeasure(m as RawMeasure, 'tech_pack_metadata', i))
    .filter((x): x is Workshop2CadMeasureEntry => x != null);
}

/** Табель мер из досье (POM) — связь конструкция ↔ мерки без fake CAD API. */
export function extractCadMeasuresFromDossierPom(
  perSizeDimensions: Record<string, Record<string, string>> | undefined,
  baseSizeKey?: string
): Workshop2CadMeasureEntry[] {
  if (!perSizeDimensions || !Object.keys(perSizeDimensions).length) return [];
  const key =
    baseSizeKey && perSizeDimensions[baseSizeKey]
      ? baseSizeKey
      : Object.keys(perSizeDimensions)[0]!;
  const row = perSizeDimensions[key] ?? {};
  return Object.entries(row)
    .map(([label, valueText], i) => {
      const trimmed = valueText.trim();
      if (!trimmed) return null;
      const num = Number.parseFloat(trimmed.replace(',', '.'));
      return {
        id: `pom-${i}`,
        label,
        valueCm: Number.isFinite(num) ? num : undefined,
        source: 'dossier_pom' as const,
      };
    })
    .filter((x): x is Workshop2CadMeasureEntry => x != null);
}

export function mergeCadMeasureLists(
  ...lists: Workshop2CadMeasureEntry[][]
): Workshop2CadMeasureEntry[] {
  const seen = new Set<string>();
  const out: Workshop2CadMeasureEntry[] = [];
  for (const list of lists) {
    for (const m of list) {
      const key = `${m.source}::${m.label.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(m);
    }
  }
  return out;
}

export function isCadVaultDocument(metadata: Record<string, unknown> | undefined): boolean {
  if (!metadata) return false;
  const kind = String(metadata.kind ?? metadata.sourceKind ?? '').toLowerCase();
  return kind === 'cad' || metadata.ingest === 'cad-ingest';
}

export function countCadVaultMetadataMeasures(measures: Workshop2CadMeasureEntry[]): number {
  return measures.filter((m) => m.source === 'vault_metadata').length;
}

export function meetsWorkshop2CadViewerMinimum(measures: Workshop2CadMeasureEntry[]): boolean {
  return (
    countCadVaultMetadataMeasures(measures) >= WORKSHOP2_CAD_VIEWER_MIN_VAULT_METADATA_MEASURES
  );
}

/** Импорт мерок cad-ingest (vault metadata) в табель POM досье — только пустые ячейки. */
export function applyVaultCadMeasuresToDossierPom(
  dossier: Workshop2DossierPhase1,
  vaultMeasures: Workshop2CadMeasureEntry[],
  opts?: { importAllSizeRows?: boolean }
): {
  dossier: Workshop2DossierPhase1;
  imported: number;
  sizeKeys: string[];
} {
  const fromVault = vaultMeasures.filter(
    (m) => m.source === 'vault_metadata' && m.valueCm != null && Number.isFinite(m.valueCm)
  );
  if (!fromVault.length) {
    return { dossier, imported: 0, sizeKeys: [] };
  }
  const existing = dossier.sampleBasePerSizeDimensions ?? {};
  const baseKey = dossier.sampleBaseSizeLabel?.trim() || Object.keys(existing)[0] || 'base';
  const sizeKeys =
    opts?.importAllSizeRows && Object.keys(existing).length > 0 ? Object.keys(existing) : [baseKey];

  const nextDims = { ...existing };
  let imported = 0;
  const touched: string[] = [];

  for (const sizeKey of sizeKeys) {
    const row = { ...(nextDims[sizeKey] ?? {}) };
    let rowImported = 0;
    for (const m of fromVault) {
      if (row[m.label]?.trim()) continue;
      row[m.label] = String(m.valueCm);
      rowImported += 1;
    }
    if (rowImported > 0) {
      nextDims[sizeKey] = row;
      imported += rowImported;
      touched.push(sizeKey);
    }
  }

  if (!imported) {
    return { dossier, imported: 0, sizeKeys: [] };
  }

  const now = new Date().toISOString();
  return {
    dossier: {
      ...dossier,
      sampleBasePerSizeDimensions: nextDims,
      cadPomImport: {
        lastImportedAt: now,
        importedCellCount: imported,
        sizeKeys: touched,
      },
    },
    imported,
    sizeKeys: touched,
  };
}
