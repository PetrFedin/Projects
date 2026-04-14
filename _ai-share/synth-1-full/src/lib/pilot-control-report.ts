/**
 * Pilot snapshot → normalized rows, aggregates, heuristic flags (not ground truth).
 * Used by scripts/pilot-control-report.ts only — no product runtime dependency.
 */

export type PilotSnapshotMeta = {
  as_of: string;
  filters?: string[];
  note?: string;
  label?: string;
  source?: string;
  input_path?: string;
};

export type PilotControlBundle = {
  kind: string;
  id: string;
  control: Record<string, unknown>;
  presentation?: Record<string, unknown>;
  error?: string;
};

export type PilotSnapshotPayload = {
  meta: PilotSnapshotMeta;
  articles: PilotControlBundle[];
  orders: PilotControlBundle[];
  commitments: PilotControlBundle[];
  samples: PilotControlBundle[];
};

export type NormalizedPilotRow = {
  kind: string;
  id: string;
  label: string;
  status: string;
  risk: string;
  deadline_level: string;
  deadline_at: string;
  next_action: string;
  surface_visible: string;
  commitment_cue_visible: string;
  useful: string;
  trust: string;
  comments: string;
  noise_candidate: string;
  strong_signal_candidate: string;
  duplicate_action_candidate: string;
};

function str(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  return '';
}

function getDeadline(control: Record<string, unknown>): { level: string; at: string } {
  const dp = control.deadline_pressure as Record<string, unknown> | undefined;
  if (!dp) return { level: '', at: '' };
  return { level: str(dp.level), at: str(dp.next_deadline_at) };
}

function getLabel(control: Record<string, unknown>): string {
  const ref = control.entity_ref as Record<string, unknown> | undefined;
  return ref ? str(ref.label) : '';
}

function getNextActionLine(bundle: PilotControlBundle): string {
  const p = bundle.presentation as Record<string, unknown> | undefined;
  return str(p?.next_action_line);
}

function getSurfaceVisible(bundle: PilotControlBundle): boolean {
  const p = bundle.presentation as Record<string, unknown> | undefined;
  return p?.signal_surface_visible === true;
}

function getCommitmentCue(bundle: PilotControlBundle): string {
  const p = bundle.presentation as Record<string, unknown> | undefined;
  const v = p?.commitment_cue_visible;
  if (v === true) return 'true';
  if (v === false) return 'false';
  return '';
}

/** Sample → article_id from next_action.reason[0].params or reasons[0].params */
export function sampleLinkedArticleId(control: Record<string, unknown>): string {
  const na = control.next_action as Record<string, unknown> | undefined;
  const r0 = Array.isArray(na?.reason) ? (na!.reason as unknown[])[0] : undefined;
  const fromNa =
    r0 && typeof r0 === 'object' && r0 !== null
      ? str(
          (r0 as Record<string, unknown>).params &&
            (r0 as { params?: { article_id?: string } }).params?.article_id
        )
      : '';
  if (fromNa) return fromNa;
  const reasons = control.reasons as unknown[] | undefined;
  const r1 = reasons?.[0];
  if (r1 && typeof r1 === 'object' && r1 !== null) {
    const p = (r1 as { params?: { article_id?: string } }).params;
    return str(p?.article_id);
  }
  return '';
}

export function isPilotSnapshotPayload(x: unknown): x is PilotSnapshotPayload {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  if (!o.meta || typeof o.meta !== 'object') return false;
  const m = o.meta as Record<string, unknown>;
  if (typeof m.as_of !== 'string') return false;
  return (
    Array.isArray(o.articles) &&
    Array.isArray(o.orders) &&
    Array.isArray(o.commitments) &&
    Array.isArray(o.samples)
  );
}

/** Same thresholds as pilot-control-dump --from-file (representative pilot, not toy). */
export function pilotRepresentativenessWarnings(payload: PilotSnapshotPayload): string[] {
  const na = payload.articles.length;
  const no = payload.orders.length;
  const nc = payload.commitments.length;
  const ns = payload.samples.length;
  const total = na + no + nc + ns;
  if (total === 0) {
    return ['Snapshot has zero entities across articles/orders/commitments/samples.'];
  }
  if (na < 3 || no < 2 || nc < 2) {
    return [
      `Small snapshot for scale decisions (expect ≥3 articles, ≥2 orders, ≥2 commitments). Counts: articles=${na} orders=${no} commitments=${nc} samples=${ns}.`,
    ];
  }
  return [];
}

export function normalizePilotRows(payload: PilotSnapshotPayload): NormalizedPilotRow[] {
  const bundles: PilotControlBundle[] = [
    ...payload.articles,
    ...payload.orders,
    ...payload.commitments,
    ...payload.samples,
  ];

  const rows: NormalizedPilotRow[] = bundles.map((b) => {
    const c = b.control ?? {};
    const { level, at } = getDeadline(c);
    const next = getNextActionLine(b);
    const surf = getSurfaceVisible(b);
    return {
      kind: str(b.kind) || 'unknown',
      id: str(b.id),
      label: getLabel(c),
      status: str(c.status),
      risk: str(c.risk),
      deadline_level: level,
      deadline_at: at,
      next_action: next || '—',
      surface_visible: surf ? 'true' : 'false',
      commitment_cue_visible: getCommitmentCue(b),
      useful: '',
      trust: '',
      comments: b.error ? `error: ${b.error}` : '',
      noise_candidate: '',
      strong_signal_candidate: '',
      duplicate_action_candidate: '',
    };
  });

  applyNoiseHeuristic(rows);
  applyStrongHeuristic(rows);
  applyDuplicateHeuristic(payload, rows);
  return rows;
}

function applyNoiseHeuristic(rows: NormalizedPilotRow[]): void {
  for (const r of rows) {
    const surf = r.surface_visible === 'true';
    const noNext = r.next_action === '—' || r.next_action === '';
    const risk = r.risk;
    const medPlus = risk === 'medium' || risk === 'high' || risk === 'severe';
    const dl = r.deadline_level;
    const dlHot = dl === 'overdue' || dl === 'upcoming' || dl === 'due_today';
    if (surf && noNext && medPlus && dlHot) {
      r.noise_candidate = 'yes';
    }
  }
}

function applyStrongHeuristic(rows: NormalizedPilotRow[]): void {
  for (const r of rows) {
    const st = r.status;
    const risk = r.risk;
    const hasNext = r.next_action !== '—' && r.next_action !== '';
    const dl = r.deadline_level;
    if (risk === 'severe' || st === 'critical' || st === 'blocked') {
      r.strong_signal_candidate = 'yes';
      continue;
    }
    if (risk === 'high' && (hasNext || dl === 'overdue')) {
      r.strong_signal_candidate = 'yes';
      continue;
    }
    if (hasNext && dl === 'overdue' && (risk === 'medium' || risk === 'high')) {
      r.strong_signal_candidate = 'yes';
    }
  }
}

function bundleByKindId(payload: PilotSnapshotPayload): Map<string, PilotControlBundle> {
  const m = new Map<string, PilotControlBundle>();
  const all = [...payload.articles, ...payload.orders, ...payload.commitments, ...payload.samples];
  for (const b of all) {
    m.set(`${b.kind}:${b.id}`, b);
  }
  return m;
}

function applyDuplicateHeuristic(payload: PilotSnapshotPayload, rows: NormalizedPilotRow[]): void {
  const articleNextById = new Map<string, string>();
  for (const r of rows) {
    if (r.kind === 'article' && r.next_action && r.next_action !== '—') {
      articleNextById.set(r.id, r.next_action.trim());
    }
  }

  const bundles = bundleByKindId(payload);
  for (const r of rows) {
    if (r.kind !== 'sample') continue;
    const b = bundles.get(`sample:${r.id}`);
    if (!b) continue;
    const aid = sampleLinkedArticleId(b.control ?? {});
    if (!aid) continue;
    const artLine = articleNextById.get(aid);
    if (!artLine) continue;
    const sline = r.next_action.trim();
    if (sline && artLine === sline) {
      r.duplicate_action_candidate = 'yes';
    }
  }
}

export type PilotAggregates = {
  total_entities: number;
  by_kind: Record<string, number>;
  surface_visible_true: number;
  surface_visible_false: number;
  by_risk: Record<string, number>;
  by_deadline_level: Record<string, number>;
  with_next_action: number;
  without_next_action: number;
  commitment_cue_true: number;
  noise_candidates: number;
  strong_signal_candidates: number;
  duplicate_action_candidates: number;
};

export function computeAggregates(rows: NormalizedPilotRow[]): PilotAggregates {
  const by_kind: Record<string, number> = {};
  const by_risk: Record<string, number> = {};
  const by_deadline_level: Record<string, number> = {};
  let surface_visible_true = 0;
  let surface_visible_false = 0;
  let with_next = 0;
  let without_next = 0;
  let commitment_cue_true = 0;
  let noise = 0;
  let strong = 0;
  let dup = 0;

  for (const r of rows) {
    by_kind[r.kind] = (by_kind[r.kind] ?? 0) + 1;
    if (r.surface_visible === 'true') surface_visible_true++;
    else surface_visible_false++;
    if (r.risk) by_risk[r.risk] = (by_risk[r.risk] ?? 0) + 1;
    if (r.deadline_level)
      by_deadline_level[r.deadline_level] = (by_deadline_level[r.deadline_level] ?? 0) + 1;
    if (r.next_action && r.next_action !== '—') with_next++;
    else without_next++;
    if (r.commitment_cue_visible === 'true') commitment_cue_true++;
    if (r.noise_candidate === 'yes') noise++;
    if (r.strong_signal_candidate === 'yes') strong++;
    if (r.duplicate_action_candidate === 'yes') dup++;
  }

  return {
    total_entities: rows.length,
    by_kind,
    surface_visible_true,
    surface_visible_false,
    by_risk,
    by_deadline_level,
    with_next_action: with_next,
    without_next_action: without_next,
    commitment_cue_true,
    noise_candidates: noise,
    strong_signal_candidates: strong,
    duplicate_action_candidates: dup,
  };
}

export type ScaleRecommendation =
  | 'selective_scale_ready'
  | 'recalibrate_first'
  | 'insufficient_signal_quality';

export function recommendScale(agg: PilotAggregates): {
  verdict: ScaleRecommendation;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (agg.total_entities < 3) {
    reasons.push('Very few entities in snapshot — not enough to judge.');
    return { verdict: 'insufficient_signal_quality', reasons };
  }

  if (agg.noise_candidates >= 2) {
    reasons.push(
      'Two or more noise-pattern rows (visible pressure, medium+ risk, no next_action).'
    );
    return { verdict: 'recalibrate_first', reasons };
  }

  if (agg.noise_candidates === 1 && agg.strong_signal_candidates === 0) {
    reasons.push('Noise present without heuristic strong-signal anchors.');
    return { verdict: 'recalibrate_first', reasons };
  }

  if (agg.noise_candidates === 1 && agg.strong_signal_candidates >= 1) {
    reasons.push(
      'Single noise candidate alongside strong signals — selective scale plausible after human CSV review.'
    );
    return { verdict: 'selective_scale_ready', reasons };
  }

  if (agg.strong_signal_candidates >= 1 && agg.noise_candidates === 0) {
    reasons.push('Strong signals and no heuristic noise hits.');
    return { verdict: 'selective_scale_ready', reasons };
  }

  reasons.push('Ambiguous mix — review CSV manually.');
  return { verdict: 'recalibrate_first', reasons };
}

const CSV_HEADER: (keyof NormalizedPilotRow)[] = [
  'kind',
  'id',
  'label',
  'status',
  'risk',
  'deadline_level',
  'deadline_at',
  'next_action',
  'surface_visible',
  'commitment_cue_visible',
  'useful',
  'trust',
  'comments',
  'noise_candidate',
  'strong_signal_candidate',
  'duplicate_action_candidate',
];

function escapeCsvCell(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function pilotRowsToCsv(rows: NormalizedPilotRow[]): string {
  const lines = [CSV_HEADER.join(',')];
  for (const r of rows) {
    lines.push(CSV_HEADER.map((k) => escapeCsvCell(r[k])).join(','));
  }
  return `${lines.join('\n')}\n`;
}

export function buildPilotMarkdownReport(input: {
  inputPath: string;
  payload: PilotSnapshotPayload;
  rows: NormalizedPilotRow[];
  agg: PilotAggregates;
  rec: { verdict: ScaleRecommendation; reasons: string[] };
}): string {
  const { inputPath, payload, rows, agg, rec } = input;
  const lines: string[] = [];
  lines.push('# Pilot control report');
  lines.push('');
  lines.push('## Pilot scope');
  lines.push(`- **Input:** \`${inputPath}\``);
  lines.push(`- **as_of:** ${payload.meta.as_of}`);
  if (payload.meta.label) {
    lines.push(`- **Label:** ${payload.meta.label}`);
  }
  if (payload.meta.source) {
    lines.push(`- **Source:** ${payload.meta.source}`);
  }
  if (payload.meta.input_path) {
    lines.push(`- **Bundle path:** \`${payload.meta.input_path}\``);
  }
  if (payload.meta.filters?.length) {
    lines.push(`- **Filters:** ${payload.meta.filters.join('; ')}`);
  }
  if (payload.meta.note) {
    lines.push(`- **Note:** ${payload.meta.note}`);
  }
  lines.push(`- **Entity counts:** ${JSON.stringify(agg.by_kind)}`);
  lines.push('');

  const repr = pilotRepresentativenessWarnings(payload);
  if (repr.length > 0) {
    lines.push('## Representativeness');
    lines.push('*Heuristic — same rules as `pilot-control-dump` small-bundle warning.*');
    for (const t of repr) lines.push(`- **Warning:** ${t}`);
    lines.push('');
  }

  lines.push('## Coverage summary');
  lines.push(`- Total entities: ${agg.total_entities}`);
  lines.push(
    `- Surface visible: ${agg.surface_visible_true} / hidden: ${agg.surface_visible_false}`
  );
  lines.push(`- With next_action: ${agg.with_next_action} / without: ${agg.without_next_action}`);
  lines.push(`- By risk: ${JSON.stringify(agg.by_risk)}`);
  lines.push(`- By deadline_level: ${JSON.stringify(agg.by_deadline_level)}`);
  lines.push(`- Commitment cue true: ${agg.commitment_cue_true}`);
  lines.push('');

  const strongRows = rows.filter((r) => r.strong_signal_candidate === 'yes');
  lines.push('## Strong signal candidates (heuristic)');
  lines.push('*Not verified truth — review manually.*');
  if (strongRows.length === 0) lines.push('- (none)');
  else
    for (const r of strongRows) {
      lines.push(
        `- **${r.kind}** \`${r.id}\` — ${r.status} / ${r.risk} / ${r.deadline_level} — next: ${r.next_action}`
      );
    }
  lines.push('');

  const noiseRows = rows.filter((r) => r.noise_candidate === 'yes');
  lines.push('## Noise candidates (heuristic)');
  lines.push('*Visible pressure + medium+ risk + no next_action — review manually.*');
  if (noiseRows.length === 0) lines.push('- (none)');
  else
    for (const r of noiseRows) {
      lines.push(
        `- **${r.kind}** \`${r.id}\` — ${r.risk} / ${r.deadline_level} / surface=${r.surface_visible}`
      );
    }
  lines.push('');

  const dupRows = rows.filter((r) => r.duplicate_action_candidate === 'yes');
  lines.push('## Duplicate action candidates (article ↔ sample)');
  if (dupRows.length === 0) lines.push('- (none)');
  else
    for (const r of dupRows) {
      lines.push(`- **${r.kind}** \`${r.id}\` — same next_action line as linked article row`);
    }
  lines.push('');

  lines.push('## Missing / weak areas');
  lines.push('- **useful?** and **trust?** in CSV are left blank for human review.');
  lines.push('- Heuristics do not assess business value or data quality beyond snapshot fields.');
  lines.push('');

  lines.push('## Recommendation (heuristic)');
  lines.push(`- **Verdict:** \`${rec.verdict}\``);
  for (const t of rec.reasons) lines.push(`- ${t}`);
  lines.push('');

  lines.push('## Manual review table');
  lines.push('- See companion CSV for all rows and empty columns for manual scoring.');
  lines.push('');

  lines.push('## Executive summary draft');
  lines.push(
    `Snapshot at **${payload.meta.as_of}** contains **${agg.total_entities}** entities. Heuristic scan found **${agg.strong_signal_candidates}** strong-signal candidates and **${agg.noise_candidates}** noise-pattern rows. Duplicate article/sample action lines: **${agg.duplicate_action_candidates}**. Suggested next step: **${rec.verdict}** — confirm in CSV (useful/trust columns) before leadership messaging.`
  );
  lines.push('');
  return lines.join('\n');
}

export function buildPilotSummaryJson(input: {
  inputPath: string;
  payload: PilotSnapshotPayload;
  agg: PilotAggregates;
  rec: { verdict: ScaleRecommendation; reasons: string[] };
}): string {
  return `${JSON.stringify(
    {
      input: input.inputPath,
      as_of: input.payload.meta.as_of,
      filters: input.payload.meta.filters ?? [],
      aggregates: input.agg,
      recommendation: { verdict: input.rec.verdict, reasons: input.rec.reasons },
      disclaimer: 'Heuristics only; human review required for useful/trust and scale decisions.',
    },
    null,
    2
  )}\n`;
}
