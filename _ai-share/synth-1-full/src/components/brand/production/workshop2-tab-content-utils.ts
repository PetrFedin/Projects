import type { Workshop2RunStatus } from '@/lib/production/workshop2-collection-metrics';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import { normalizeLocalSkuCode } from '@/lib/production/local-collection-inventory';
import type {
  Workshop2ArticleRow,
  Workshop2CollectionListItem,
} from '@/components/brand/production/workshop2-tab-content-model';
import { loadWorkshop2Phase1DossierMap } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  summarizeCollectionDossierRollup,
  type CollectionDossierRollup,
} from '@/lib/production/workshop2-collection-dossier-analytics';

/** Все этапы not_started → можно удалить черновик; иначе — в работе (done / in_progress / …). */
export function workshop2ArticleStageBucket(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepIds: readonly string[]
): 'not_started' | 'in_flight' {
  const entry = doc.skus[skuId];
  for (const sid of stepIds) {
    const st = entry?.stages[sid]?.status ?? 'not_started';
    if (st !== 'not_started') return 'in_flight';
  }
  return 'not_started';
}

export function parseWorkshop2BulkPaste(raw: string): { sku: string; name?: string }[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const out: { sku: string; name?: string }[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    let parts: string[];
    if (line.includes('\t')) parts = line.split('\t');
    else if (line.includes(';')) parts = line.split(';');
    else if (line.includes(',')) parts = line.split(',');
    else parts = [line];
    const skuRaw = parts[0]?.trim().replace(/^["']|["']$/g, '') ?? '';
    if (!skuRaw) continue;
    if (i === 0 && /^sku$/i.test(skuRaw)) continue;
    const nameExtra =
      parts
        .slice(1)
        .map((p) => p.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
        .join(' · ') || undefined;
    const norm = normalizeLocalSkuCode(skuRaw) || skuRaw.toUpperCase().replace(/\s+/g, '-');
    const dedupKey = norm.toLowerCase();
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);
    out.push({ sku: norm, ...(nameExtra ? { name: nameExtra } : {}) });
  }
  return out;
}

export function formatWorkshop2ArticleRowDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return iso;
  }
}

export function workshop2ArticleDeletable(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepIds: readonly string[],
  prog: { done: number }
): boolean {
  if (prog.done > 0) return false;
  if (!doc.skus[skuId]) return true;
  return workshop2ArticleStageBucket(doc, skuId, stepIds) === 'not_started';
}

export function isoToDatetimeLocalValue(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function filterWorkshop2CollectionsForGrid(
  cols: Workshop2CollectionListItem[],
  selectedCollectionIds: ReadonlySet<string>,
  selectedSkus: ReadonlySet<string>
): Workshop2CollectionListItem[] {
  return cols.filter((col) => {
    if (selectedCollectionIds.size > 0 && !selectedCollectionIds.has(col.id)) {
      return false;
    }
    if (selectedSkus.size > 0) {
      const skuSet = new Set(
        col.articleRows.map((r) => normalizeLocalSkuCode(r.sku) || r.sku.trim()).filter(Boolean)
      );
      let hit = false;
      for (const s of selectedSkus) {
        if (skuSet.has(s)) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }
    return true;
  });
}

export function runGlobalWorkshop2Search(
  query: string,
  collections: Workshop2CollectionListItem[]
): { collectionId: string; collectionName: string; field: string; snippet: string }[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: { collectionId: string; collectionName: string; field: string; snippet: string }[] =
    [];
  const push = (collectionId: string, collectionName: string, field: string, snippet: string) => {
    out.push({ collectionId, collectionName, field, snippet });
  };
  for (const col of collections) {
    if (col.displayName.toLowerCase().includes(q)) {
      push(col.id, col.displayName, 'Название коллекции', col.displayName);
    }
    if (col.id.toLowerCase().includes(q)) {
      push(col.id, col.displayName, 'Код коллекции', col.id);
    }
    for (const row of col.articleRows) {
      if (row.sku.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'SKU', row.sku);
      }
      if (row.name.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'Название артикула', row.name);
      }
      if (row.commentPreview?.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'Комментарий', row.commentPreview ?? '');
      }
      if (row.audienceLabel.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'Аудитория', row.audienceLabel);
      }
      if (
        row.internalArticleCode &&
        typeof row.internalArticleCode === 'string' &&
        row.internalArticleCode.toLowerCase().includes(q)
      ) {
        push(col.id, col.displayName, 'Внутр. артикул', row.internalArticleCode);
      }
    }
  }
  const seen = new Set<string>();
  return out.filter((r) => {
    const k = `${r.collectionId}|${r.field}|${r.snippet}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function collectionCoverMonogram(id: string): string {
  const alnum = id.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return alnum.slice(0, 2) || '—';
}

export function workshop2StatusBadgeClass(s: Workshop2RunStatus): string {
  if (s === 'draft') return 'border-border-default text-text-secondary bg-bg-surface2/80';
  if (s === 'completed') return 'border-emerald-200 text-emerald-800 bg-emerald-50/80';
  return 'border-amber-200 text-amber-800 bg-amber-50/50';
}

export function workshop2StatusLabel(s: Workshop2RunStatus): string {
  if (s === 'draft') return 'Черновик';
  if (s === 'completed') return 'Завершена';
  return 'В работе';
}

/** После HMR или старого кода в state может быть строка вместо Set — приводим к Set. */
export function ensureFacetSelectionSet(v: unknown): Set<string> {
  if (v instanceof Set) return new Set(v);
  if (Array.isArray(v)) return new Set(v.map((x) => String(x)));
  if (typeof v === 'string' && v.trim() && v !== '__all__') return new Set([v.trim()]);
  return new Set();
}

/** Сводка досье по коллекциям для сетки хаба (читает карту phase1 из localStorage). */
export function buildWorkshop2TabContentDossierRollupByCollectionId(
  collections: readonly { id: string; articleRows: Workshop2ArticleRow[] }[]
): Record<string, CollectionDossierRollup> {
  const map = loadWorkshop2Phase1DossierMap();
  const out: Record<string, CollectionDossierRollup> = {};
  for (const col of collections) {
    out[col.id] = summarizeCollectionDossierRollup(map, col.id, col.articleRows);
  }
  return out;
}
