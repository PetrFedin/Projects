/**
 * Narrow adapter: brand-production article snapshot → ControlOutput.
 * Labeled lifecycle / flags only — no BOM/QC SoT, no rule engine.
 *
 * @see docs/domain-model/control-contracts.md
 * @see docs/domain-model/article.md (when available)
 * @see docs/article-boundaries-checklist.md (when available)
 */
import type { ArticleEntity, ArticleLifecycleStage } from '@/lib/brand-production/types';
import type {
  ControlOutput,
  ControlOwnerRef,
  DeadlinePressureState,
  NextAction,
  ReadinessSummary,
  ReasonPayload,
} from '@/lib/contracts';
import { validateControlOutput, validateNextAction } from '@/lib/contracts';
import { mapOrderDeadlinePressure } from './order-control-output';
import { deriveArticleBlockers, deriveArticleNextAction } from './article-control-derivations';
import { summarizeDerivedBlockers } from './order-control-derivations';
import {
  ARTICLE_B2B_RELEASE_STAGES,
  ARTICLE_LATE_FOR_LINESHEET,
  ARTICLE_SAMPLE_GATE_STAGES,
} from './article-stage-sets';

/**
 * Gap (explicit): no Workshop2 dossier, PIM, availability, or content/publish signals —
 * only brand-production ArticleEntity-shaped flags and optional YMD targets.
 * Optional collection_id is omitted until a stable link to collection SoT is needed.
 */
export const ARTICLE_CONTROL_ADAPTER_VERSION = 'article-control-output.v1.2';

export interface ArticleControlInput {
  article_id: string;
  lifecycle_stage: ArticleLifecycleStage;
  gold_sample_approved: boolean;
  b2b_ready: boolean;
  linesheet_ready: boolean;
  /** YYYY-MM-DD optional commitments (tech pack / cut). */
  target_tech_pack_date?: string;
  target_cut_date?: string;
  as_of: string;
  version?: string;
  commitment_id?: string;
  owner?: ControlOwnerRef;
  display_label?: string;
  next_action?: NextAction | null;
}

function pickEarlierYmd(a?: string, b?: string): string | undefined {
  const ta = a?.slice(0, 10);
  const tb = b?.slice(0, 10);
  const ok = (s: string | undefined) =>
    s != null && s.length === 10 && s[4] === '-' && s[7] === '-';
  if (!ok(ta) && !ok(tb)) return undefined;
  if (ok(ta) && !ok(tb)) return ta;
  if (!ok(ta) && ok(tb)) return tb;
  return ta! <= tb! ? ta : tb;
}

/** Nearest labeled date vs as_of — reuses order date math (pure YMD compare). */
export function mapArticleDeadlinePressure(
  target_tech_pack_date: string | undefined,
  target_cut_date: string | undefined,
  as_of: string
): DeadlinePressureState {
  const ymd = pickEarlierYmd(target_tech_pack_date, target_cut_date);
  return mapOrderDeadlinePressure(ymd, as_of);
}

/**
 * Rollup for ControlOutput.status / risk. May repeat ReasonCodes also used on blockers;
 * reasons = snapshot headline, blockers = structured actionable list (see order-control-derivations header).
 */
function mapArticleToControlSignals(input: ArticleControlInput): {
  status: ControlOutput['status'];
  risk: ControlOutput['risk'];
  reasons: ReasonPayload[];
} {
  const st = input.lifecycle_stage;

  if (!input.gold_sample_approved && ARTICLE_SAMPLE_GATE_STAGES.has(st)) {
    return {
      status: 'attention',
      risk: 'medium',
      reasons: [{ code: 'SAMPLE_NOT_APPROVED', params: { stage: st } }],
    };
  }

  if (input.gold_sample_approved && ARTICLE_B2B_RELEASE_STAGES.has(st) && !input.b2b_ready) {
    return {
      status: 'attention',
      risk: 'medium',
      reasons: [{ code: 'READINESS_GAP', params: { dimension: 'b2b' } }],
    };
  }

  if (
    input.gold_sample_approved &&
    input.b2b_ready &&
    !input.linesheet_ready &&
    ARTICLE_LATE_FOR_LINESHEET.has(st)
  ) {
    return {
      status: 'attention',
      risk: 'low',
      reasons: [{ code: 'READINESS_GAP', params: { dimension: 'linesheet' } }],
    };
  }

  if (st === 'b2b_ready' && input.b2b_ready) {
    return {
      status: 'ok',
      risk: 'low',
      reasons: [{ code: 'UNKNOWN', params: { lifecycle: st } }],
    };
  }

  return {
    status: 'ok',
    risk: 'low',
    reasons: [{ code: 'UNKNOWN', params: { lifecycle: st } }],
  };
}

function buildArticleReadinessSummary(input: ArticleControlInput): ReadinessSummary {
  const sampleCodes: ReasonPayload[] = [];
  let sampleState: ReadinessSummary['dimensions'][0]['state'] = 'unknown';
  if (input.gold_sample_approved) {
    sampleState = 'ready';
  } else if (ARTICLE_SAMPLE_GATE_STAGES.has(input.lifecycle_stage)) {
    sampleState = 'not_ready';
    sampleCodes.push({ code: 'SAMPLE_NOT_APPROVED', params: { stage: input.lifecycle_stage } });
  }

  const b2bCodes: ReasonPayload[] = [];
  let b2bState: ReadinessSummary['dimensions'][0]['state'] = 'unknown';
  if (input.b2b_ready) {
    b2bState = 'ready';
  } else if (ARTICLE_B2B_RELEASE_STAGES.has(input.lifecycle_stage)) {
    b2bState = 'not_ready';
    b2bCodes.push({ code: 'READINESS_GAP', params: { dimension: 'b2b' } });
  }

  return {
    dimensions: [
      { key: 'sample_gate', state: sampleState, gap_codes: sampleCodes },
      { key: 'b2b_release', state: b2bState, gap_codes: b2bCodes },
    ],
  };
}

export function articleControlInputFromArticleEntity(
  article: ArticleEntity,
  as_of: string,
  version?: string
): ArticleControlInput {
  return {
    article_id: article.id,
    lifecycle_stage: article.lifecycleStage,
    gold_sample_approved: article.goldSampleApproved,
    b2b_ready: article.b2bReady,
    linesheet_ready: article.linesheetReady,
    target_tech_pack_date: article.targetTechPackDate,
    target_cut_date: article.targetCutDate,
    as_of,
    version,
    display_label: `${article.sku} · ${article.name}`,
  };
}

export function assertArticleControlInput(input: ArticleControlInput): void {
  if (input.article_id == null || String(input.article_id).trim() === '') {
    throw new Error('ArticleControlInput.article_id is required');
  }
  if (input.as_of == null || String(input.as_of).trim() === '') {
    throw new Error('ArticleControlInput.as_of is required');
  }
}

/**
 * Build ControlOutput for one article anchor. Derived blockers/next_action unless next_action overridden.
 */
export function buildArticleControlOutput(input: ArticleControlInput): ControlOutput {
  assertArticleControlInput(input);

  const { status, risk, reasons } = mapArticleToControlSignals(input);
  const deadline_pressure = mapArticleDeadlinePressure(
    input.target_tech_pack_date,
    input.target_cut_date,
    input.as_of
  );
  const readiness_summary = buildArticleReadinessSummary(input);

  const derivedBlockers = deriveArticleBlockers(input);
  const blocker_summary = summarizeDerivedBlockers(derivedBlockers);

  let next: NextAction | null = null;
  if (input.next_action !== undefined) {
    if (input.next_action !== null) {
      const nv = validateNextAction(input.next_action);
      if (!nv.ok) throw new Error(`Invalid next_action: ${nv.errors.join('; ')}`);
      next = input.next_action;
    }
  } else {
    next = deriveArticleNextAction(input);
    if (next != null) {
      const nv = validateNextAction(next);
      if (!nv.ok) throw new Error(`Invalid derived next_action: ${nv.errors.join('; ')}`);
    }
  }

  const output: ControlOutput = {
    entity_ref: {
      entity_type: 'article',
      entity_id: input.article_id,
      label: input.display_label,
    },
    commitment_ref: input.commitment_id ? { commitment_id: input.commitment_id } : undefined,
    status,
    risk,
    blocker_summary,
    readiness_summary,
    deadline_pressure,
    next_action: next,
    owner: input.owner,
    reasons,
    as_of: input.as_of,
    version:
      input.version ??
      `${ARTICLE_CONTROL_ADAPTER_VERSION}:${input.as_of.slice(0, 10)}:${input.article_id}`,
  };

  const v = validateControlOutput(output);
  if (!v.ok) throw new Error(`ControlOutput validation failed: ${v.errors.join('; ')}`);
  return output;
}
