/**
 * NuORDER: Working Order — полный цикл.
 * Версии файла, кто загрузил, сравнение с матрицей, подтверждение брендом.
 */

export type WorkingOrderVersionStatus = 'draft' | 'pending_review' | 'confirmed' | 'rejected';

export interface WorkingOrderRow {
  Style?: string;
  SKU?: string;
  Color?: string;
  'Delivery Window'?: string;
  'Qty XS'?: string;
  'Qty S'?: string;
  'Qty M'?: string;
  'Qty L'?: string;
  'Qty XL'?: string;
  Total?: string;
  Price?: string;
  'Line Total'?: string;
  [key: string]: string | undefined;
}

export interface WorkingOrderVersion {
  id: string;
  createdAt: string; // ISO
  uploadedBy: string;
  uploadedByUserId?: string;
  fileName: string;
  rows: WorkingOrderRow[];
  status: WorkingOrderVersionStatus;
  /** Комментарий бренда при reject/confirm */
  brandComment?: string;
  confirmedAt?: string;
  confirmedBy?: string;
}

const STORAGE_KEY = 'b2b_working_order_versions';

function loadVersions(): WorkingOrderVersion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveVersions(versions: WorkingOrderVersion[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
}

export function getWorkingOrderVersions(brandId?: string): WorkingOrderVersion[] {
  const all = loadVersions();
  return all; // при необходимости фильтр по brandId
}

export function addWorkingOrderVersion(
  payload: { fileName: string; rows: WorkingOrderRow[]; uploadedBy: string; uploadedByUserId?: string }
): WorkingOrderVersion {
  const versions = loadVersions();
  const version: WorkingOrderVersion = {
    id: `wo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    uploadedBy: payload.uploadedBy,
    uploadedByUserId: payload.uploadedByUserId,
    fileName: payload.fileName,
    rows: payload.rows,
    status: 'draft',
  };
  versions.unshift(version);
  saveVersions(versions);
  return version;
}

export function setWorkingOrderStatus(
  versionId: string,
  status: 'pending_review' | 'confirmed' | 'rejected',
  brandComment?: string,
  confirmedBy?: string
): WorkingOrderVersion | null {
  const versions = loadVersions();
  const i = versions.findIndex((v) => v.id === versionId);
  if (i === -1) return null;
  versions[i].status = status;
  versions[i].brandComment = brandComment;
  if (status === 'confirmed' || status === 'rejected') {
    versions[i].confirmedAt = new Date().toISOString();
    versions[i].confirmedBy = confirmedBy;
  }
  saveVersions(versions);
  return versions[i];
}

export function submitWorkingOrderForReview(versionId: string): WorkingOrderVersion | null {
  return setWorkingOrderStatus(versionId, 'pending_review');
}

/** Сравнение строк Working Order с текущей матрицей (корзиной). matrixLines: { sku, totalQty }[] */
export interface MatrixLine {
  sku: string;
  totalQty: number;
  style?: string;
  color?: string;
}

export interface WorkingOrderComparisonDiff {
  sku: string;
  inFile: number;
  inMatrix: number;
  delta: number; // inFile - inMatrix
  status: 'match' | 'file_more' | 'file_less' | 'only_file' | 'only_matrix';
}

export function compareWorkingOrderWithMatrix(
  rows: WorkingOrderRow[],
  matrixLines: MatrixLine[]
): WorkingOrderComparisonDiff[] {
  const bySku = new Map<string, number>();
  for (const row of rows) {
    const sku = (row.SKU ?? row.Style ?? '').trim();
    if (!sku) continue;
    const total = parseInt(row.Total ?? '0', 10) || 0;
    bySku.set(sku, (bySku.get(sku) ?? 0) + total);
  }
  const matrixBySku = new Map(matrixLines.map((m) => [m.sku, m.totalQty]));
  const allSkus = new Set([...bySku.keys(), ...matrixBySku.keys()]);
  const result: WorkingOrderComparisonDiff[] = [];
  for (const sku of allSkus) {
    const inFile = bySku.get(sku) ?? 0;
    const inMatrix = matrixBySku.get(sku) ?? 0;
    const delta = inFile - inMatrix;
    let status: WorkingOrderComparisonDiff['status'] = 'match';
    if (inFile > 0 && inMatrix === 0) status = 'only_file';
    else if (inFile === 0 && inMatrix > 0) status = 'only_matrix';
    else if (delta > 0) status = 'file_more';
    else if (delta < 0) status = 'file_less';
    result.push({ sku, inFile, inMatrix, delta, status });
  }
  return result.sort((a, b) => a.sku.localeCompare(b.sku));
}
