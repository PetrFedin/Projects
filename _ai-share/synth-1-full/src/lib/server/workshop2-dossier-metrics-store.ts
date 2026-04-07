import fs from 'fs/promises';
import path from 'path';
import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';

const MAX_TAIL_BYTES = 8 * 1024 * 1024;
const FILE_ROTATE_AT_BYTES = 12 * 1024 * 1024;
const KEEP_TAIL_BYTES = 6 * 1024 * 1024;

export function getW2DossierMetricsFilePath(): string {
  const fromEnv = process.env.W2_DOSSIER_METRICS_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'workshop2-dossier-metrics.ndjson');
}

export async function appendW2DossierMetricRow(row: Workshop2DossierMetricsPayload): Promise<void> {
  const p = getW2DossierMetricsFilePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.appendFile(p, `${JSON.stringify(row)}\n`, 'utf8');
}

/** Полная очистка файла NDJSON (после архива, только с явным env). */
export async function truncateW2DossierMetricsFile(): Promise<void> {
  const p = getW2DossierMetricsFilePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, '', 'utf8');
}

/** Усечь локальный NDJSON, если разросся (сохраняем хвост ~KEEP_TAIL_BYTES). */
export async function maybeRotateW2DossierMetricsFile(): Promise<void> {
  const p = getW2DossierMetricsFilePath();
  try {
    const st = await fs.stat(p);
    if (st.size < FILE_ROTATE_AT_BYTES) return;
    const fh = await fs.open(p, 'r');
    try {
      const keep = Math.min(st.size, KEEP_TAIL_BYTES);
      const start = st.size - keep;
      const buf = Buffer.alloc(keep);
      await fh.read(buf, 0, keep, start);
      let text = buf.toString('utf8');
      if (start > 0) {
        const n = text.indexOf('\n');
        if (n >= 0) text = text.slice(n + 1);
      }
      await fs.writeFile(p, text, 'utf8');
    } finally {
      await fh.close();
    }
  } catch {
    /* ignore */
  }
}

/**
 * Последние maxLines событий (хвост файла; читается до MAX_TAIL_BYTES с конца).
 */
export async function readW2DossierMetricsTail(maxLines: number): Promise<Workshop2DossierMetricsPayload[]> {
  const p = getW2DossierMetricsFilePath();
  let fh: Awaited<ReturnType<typeof fs.open>>;
  try {
    fh = await fs.open(p, 'r');
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return [];
    throw e;
  }
  try {
    const st = await fh.stat();
    if (st.size === 0) return [];
    const chunkSize = Math.min(st.size, MAX_TAIL_BYTES);
    const start = st.size - chunkSize;
    const buf = Buffer.alloc(chunkSize);
    await fh.read(buf, 0, chunkSize, start);
    let text = buf.toString('utf8');
    if (start > 0) {
      const n = text.indexOf('\n');
      if (n >= 0) text = text.slice(n + 1);
    }
    const lines = text.split('\n').filter((l) => l.trim());
    const slice = lines.slice(-Math.max(1, maxLines));
    const out: Workshop2DossierMetricsPayload[] = [];
    for (const l of slice) {
      try {
        out.push(JSON.parse(l) as Workshop2DossierMetricsPayload);
      } catch {
        /* skip corrupt line */
      }
    }
    return out;
  } finally {
    await fh.close();
  }
}

export type W2DossierMetricsAggregate = {
  rowsScanned: number;
  rowsUsed: number;
  byCollection: Array<{
    collectionId: string;
    events: number;
    uniqueArticles: number;
    avgTabOpenMinutes: number | null;
    avgPersistSuccess: number | null;
    milestonePassport100: number;
    milestoneVisualGate0: number;
    milestoneSampleReady: number;
    rowsWithAbandon: number;
    lastCapturedAt: string | null;
  }>;
};

export function aggregateW2DossierMetrics(
  rows: Workshop2DossierMetricsPayload[],
  collectionFilter?: Set<string>
): W2DossierMetricsAggregate {
  const filtered =
    collectionFilter && collectionFilter.size > 0
      ? rows.filter((r) => collectionFilter.has(r.collectionId))
      : rows;

  type Acc = {
    events: number;
    articles: Set<string>;
    tabSum: number;
    tabN: number;
    persistSum: number;
    persistN: number;
    milestonePassport100: number;
    milestoneVisualGate0: number;
    milestoneSampleReady: number;
    rowsWithAbandon: number;
    lastCapturedAt: string | null;
  };

  const byCol = new Map<string, Acc>();

  for (const r of filtered) {
    const cid = r.collectionId;
    if (!byCol.has(cid)) {
      byCol.set(cid, {
        events: 0,
        articles: new Set(),
        tabSum: 0,
        tabN: 0,
        persistSum: 0,
        persistN: 0,
        milestonePassport100: 0,
        milestoneVisualGate0: 0,
        milestoneSampleReady: 0,
        rowsWithAbandon: 0,
        lastCapturedAt: null,
      });
    }
    const a = byCol.get(cid)!;
    a.events += 1;
    a.articles.add(r.articleId);
    if (r.tabOpenMinutes != null) {
      a.tabSum += r.tabOpenMinutes;
      a.tabN += 1;
    }
    a.persistSum += r.persistSuccessCount;
    a.persistN += 1;
    if (r.contour?.passportRoutePct100At) a.milestonePassport100 += 1;
    if (r.contour?.visualGateOpen0At) a.milestoneVisualGate0 += 1;
    if (r.contour?.tzSampleReadyAt) a.milestoneSampleReady += 1;
    if (r.abandonCount > 0) a.rowsWithAbandon += 1;
    if (r.capturedAt) {
      if (!a.lastCapturedAt || r.capturedAt > a.lastCapturedAt) a.lastCapturedAt = r.capturedAt;
    }
  }

  const byCollection = [...byCol.entries()]
    .map(([collectionId, a]) => ({
      collectionId,
      events: a.events,
      uniqueArticles: a.articles.size,
      avgTabOpenMinutes: a.tabN > 0 ? Math.round((a.tabSum / a.tabN) * 10) / 10 : null,
      avgPersistSuccess: a.persistN > 0 ? Math.round((a.persistSum / a.persistN) * 10) / 10 : null,
      milestonePassport100: a.milestonePassport100,
      milestoneVisualGate0: a.milestoneVisualGate0,
      milestoneSampleReady: a.milestoneSampleReady,
      rowsWithAbandon: a.rowsWithAbandon,
      lastCapturedAt: a.lastCapturedAt,
    }))
    .sort((x, y) => y.events - x.events);

  return {
    rowsScanned: rows.length,
    rowsUsed: filtered.length,
    byCollection,
  };
}

/** Последний снимок на пару коллекция+артикул в окне (для KPI вех без дублей от throttle). */
export function pickLatestW2DossierRowsPerArticle(
  rows: Workshop2DossierMetricsPayload[],
  collectionFilter?: Set<string>
): Workshop2DossierMetricsPayload[] {
  const filtered =
    collectionFilter && collectionFilter.size > 0
      ? rows.filter((r) => collectionFilter.has(r.collectionId))
      : rows;
  const last = new Map<string, Workshop2DossierMetricsPayload>();
  const sorted = [...filtered].sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
  for (const r of sorted) {
    last.set(`${r.collectionId}::${r.articleId}`, r);
  }
  return [...last.values()];
}

export type W2DossierMetricsDedupAggregate = {
  latestSnapshots: number;
  rowsInWindow: number;
  byCollection: Array<{
    collectionId: string;
    articles: number;
    avgTabOpenMinutes: number | null;
    avgPersistSuccess: number | null;
    articlesPassport100: number;
    articlesVisualGate0: number;
    articlesSampleReady: number;
    articlesWithAbandon: number;
    lastCapturedAt: string | null;
  }>;
};

export function aggregateW2DossierMetricsDedupLatest(
  rows: Workshop2DossierMetricsPayload[],
  collectionFilter?: Set<string>
): W2DossierMetricsDedupAggregate {
  const latest = pickLatestW2DossierRowsPerArticle(rows, collectionFilter);
  type Acc = {
    articles: number;
    tabSum: number;
    tabN: number;
    persistSum: number;
    persistN: number;
    articlesPassport100: number;
    articlesVisualGate0: number;
    articlesSampleReady: number;
    articlesWithAbandon: number;
    lastCapturedAt: string | null;
  };
  const byCol = new Map<string, Acc>();
  const filtered =
    collectionFilter && collectionFilter.size > 0
      ? rows.filter((r) => collectionFilter.has(r.collectionId))
      : rows;

  for (const r of latest) {
    const cid = r.collectionId;
    if (!byCol.has(cid)) {
      byCol.set(cid, {
        articles: 0,
        tabSum: 0,
        tabN: 0,
        persistSum: 0,
        persistN: 0,
        articlesPassport100: 0,
        articlesVisualGate0: 0,
        articlesSampleReady: 0,
        articlesWithAbandon: 0,
        lastCapturedAt: null,
      });
    }
    const a = byCol.get(cid)!;
    a.articles += 1;
    if (r.tabOpenMinutes != null) {
      a.tabSum += r.tabOpenMinutes;
      a.tabN += 1;
    }
    a.persistSum += r.persistSuccessCount;
    a.persistN += 1;
    if (r.contour?.passportRoutePct100At) a.articlesPassport100 += 1;
    if (r.contour?.visualGateOpen0At) a.articlesVisualGate0 += 1;
    if (r.contour?.tzSampleReadyAt) a.articlesSampleReady += 1;
    if (r.abandonCount > 0) a.articlesWithAbandon += 1;
    if (r.capturedAt) {
      if (!a.lastCapturedAt || r.capturedAt > a.lastCapturedAt) a.lastCapturedAt = r.capturedAt;
    }
  }

  const byCollection = [...byCol.entries()]
    .map(([collectionId, a]) => ({
      collectionId,
      articles: a.articles,
      avgTabOpenMinutes: a.tabN > 0 ? Math.round((a.tabSum / a.tabN) * 10) / 10 : null,
      avgPersistSuccess: a.persistN > 0 ? Math.round((a.persistSum / a.persistN) * 10) / 10 : null,
      articlesPassport100: a.articlesPassport100,
      articlesVisualGate0: a.articlesVisualGate0,
      articlesSampleReady: a.articlesSampleReady,
      articlesWithAbandon: a.articlesWithAbandon,
      lastCapturedAt: a.lastCapturedAt,
    }))
    .sort((x, y) => y.articles - x.articles);

  return {
    latestSnapshots: latest.length,
    rowsInWindow: filtered.length,
    byCollection,
  };
}

export type W2DossierMetricsTeamAggregate = {
  byTeam: Array<{
    teamTag: string;
    uniqueActors: number;
    articles: number;
  }>;
};

export function aggregateW2DossierMetricsByTeamLatest(
  rows: Workshop2DossierMetricsPayload[],
  collectionFilter?: Set<string>
): W2DossierMetricsTeamAggregate {
  const latest = pickLatestW2DossierRowsPerArticle(rows, collectionFilter);
  type Acc = { actors: Set<string>; articles: number };
  const byTeam = new Map<string, Acc>();
  for (const r of latest) {
    const tag = (r.teamTag?.trim() || '__none__').slice(0, 120);
    if (!byTeam.has(tag)) {
      byTeam.set(tag, { actors: new Set(), articles: 0 });
    }
    const a = byTeam.get(tag)!;
    a.articles += 1;
    if (r.clientActorId?.trim()) a.actors.add(r.clientActorId.trim());
  }
  const list = [...byTeam.entries()]
    .map(([teamTag, a]) => ({
      teamTag,
      uniqueActors: a.actors.size,
      articles: a.articles,
    }))
    .sort((x, y) => y.articles - x.articles);
  return { byTeam: list };
}

export type W2DossierMetricsOrgAggregate = {
  byOrg: Array<{
    orgId: string;
    uniqueActors: number;
    uniqueAppUsers: number;
    articles: number;
  }>;
};

/** Срез по активной организации (последний снимок на артикул). */
export function aggregateW2DossierMetricsByOrgLatest(
  rows: Workshop2DossierMetricsPayload[],
  collectionFilter?: Set<string>
): W2DossierMetricsOrgAggregate {
  const latest = pickLatestW2DossierRowsPerArticle(rows, collectionFilter);
  type Acc = { actors: Set<string>; appUsers: Set<string>; articles: number };
  const byOrg = new Map<string, Acc>();
  for (const r of latest) {
    const oid = (r.orgId?.trim() || '__none__').slice(0, 128);
    if (!byOrg.has(oid)) {
      byOrg.set(oid, { actors: new Set(), appUsers: new Set(), articles: 0 });
    }
    const a = byOrg.get(oid)!;
    a.articles += 1;
    if (r.clientActorId?.trim()) a.actors.add(r.clientActorId.trim());
    if (r.appUserUid?.trim()) a.appUsers.add(r.appUserUid.trim());
  }
  const list = [...byOrg.entries()]
    .map(([orgId, a]) => ({
      orgId,
      uniqueActors: a.actors.size,
      uniqueAppUsers: a.appUsers.size,
      articles: a.articles,
    }))
    .sort((x, y) => y.articles - x.articles);
  return { byOrg: list };
}
