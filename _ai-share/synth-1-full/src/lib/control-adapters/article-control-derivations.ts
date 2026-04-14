/**
 * Pure derivation helpers: ArticleControlInput → Blocker[] / NextAction | null.
 * No I/O, no storage. Same conventions as order-control-derivations (see header there).
 */
import type { Blocker, EntityRef, NextAction } from '@/lib/contracts';
import type { ArticleControlInput } from './article-control-output';
import {
  assertDerivationBlockerValid,
  assertDerivationNextActionValid,
} from './derivation-assertions';
import {
  ARTICLE_B2B_RELEASE_STAGES,
  ARTICLE_LATE_FOR_LINESHEET,
  ARTICLE_SAMPLE_GATE_STAGES,
} from './article-stage-sets';

function articleEntityRef(input: ArticleControlInput): EntityRef {
  return {
    entity_type: 'article',
    entity_id: input.article_id,
    label: input.display_label,
  };
}

function derivationSource(input: ArticleControlInput): Blocker['source'] {
  return {
    domain: 'article',
    record_type: 'ArticleControlDerivation',
    record_id: input.article_id,
  };
}

export function deriveArticleBlockers(input: ArticleControlInput): Blocker[] {
  const ref = articleEntityRef(input);
  const src = derivationSource(input);
  const ts = input.as_of;
  const out: Blocker[] = [];

  if (!input.gold_sample_approved && ARTICLE_SAMPLE_GATE_STAGES.has(input.lifecycle_stage)) {
    const b: Blocker = {
      blocker_id: `derived:article:${input.article_id}:sample_not_approved`,
      entity_ref: ref,
      blocker_type: 'MISSING_APPROVAL',
      severity: 'warning',
      source: src,
      explanation: {
        codes: [{ code: 'SAMPLE_NOT_APPROVED', params: { stage: input.lifecycle_stage } }],
      },
      owner: { role: 'brand_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'gold_sample_approved',
        predicate_ref: 'rule.article.sample.gold_approved',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveArticleBlockers.sample');
    out.push(b);
  }

  if (
    input.gold_sample_approved &&
    ARTICLE_B2B_RELEASE_STAGES.has(input.lifecycle_stage) &&
    !input.b2b_ready
  ) {
    const b: Blocker = {
      blocker_id: `derived:article:${input.article_id}:b2b_not_ready`,
      entity_ref: ref,
      blocker_type: 'READINESS_GAP',
      severity: 'warning',
      source: src,
      explanation: {
        codes: [{ code: 'READINESS_GAP', params: { dimension: 'b2b' } }],
      },
      owner: { role: 'brand_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'b2b_ready_true',
        predicate_ref: 'rule.article.b2b.ready',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveArticleBlockers.b2b');
    out.push(b);
  }

  if (
    input.gold_sample_approved &&
    input.b2b_ready &&
    !input.linesheet_ready &&
    ARTICLE_LATE_FOR_LINESHEET.has(input.lifecycle_stage)
  ) {
    const b: Blocker = {
      blocker_id: `derived:article:${input.article_id}:linesheet_not_ready`,
      entity_ref: ref,
      blocker_type: 'READINESS_GAP',
      severity: 'info',
      source: src,
      explanation: {
        codes: [{ code: 'READINESS_GAP', params: { dimension: 'linesheet' } }],
      },
      owner: { role: 'brand_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'linesheet_ready',
        predicate_ref: 'rule.article.linesheet.ready',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveArticleBlockers.linesheet');
    out.push(b);
  }

  return out;
}

/** Priority: sample gate → b2b release → linesheet. */
export function deriveArticleNextAction(input: ArticleControlInput): NextAction | null {
  const ref = articleEntityRef(input);

  if (!input.gold_sample_approved && ARTICLE_SAMPLE_GATE_STAGES.has(input.lifecycle_stage)) {
    const a: NextAction = {
      action_id: `derived:article:${input.article_id}:approve_sample`,
      entity_ref: ref,
      action_type: 'SUBMIT_APPROVAL',
      reason: [{ code: 'SAMPLE_NOT_APPROVED', params: { stage: input.lifecycle_stage } }],
      owner: { role: 'brand_ops' },
      source: { kind: 'derived', rule_id: 'article.derive.approve_sample' },
      status: 'open',
      explainability: { rule_id: 'article.derive.approve_sample' },
    };
    assertDerivationNextActionValid(a, 'deriveArticleNextAction.approve_sample');
    return a;
  }

  if (
    input.gold_sample_approved &&
    ARTICLE_B2B_RELEASE_STAGES.has(input.lifecycle_stage) &&
    !input.b2b_ready
  ) {
    const a: NextAction = {
      action_id: `derived:article:${input.article_id}:complete_b2b`,
      entity_ref: ref,
      action_type: 'FOLLOW_UP_COMMITMENT',
      reason: [{ code: 'READINESS_GAP', params: { dimension: 'b2b' } }],
      owner: { role: 'brand_ops' },
      source: { kind: 'derived', rule_id: 'article.derive.complete_b2b_release' },
      status: 'open',
      explainability: { rule_id: 'article.derive.complete_b2b_release' },
    };
    assertDerivationNextActionValid(a, 'deriveArticleNextAction.b2b');
    return a;
  }

  if (
    input.gold_sample_approved &&
    input.b2b_ready &&
    !input.linesheet_ready &&
    ARTICLE_LATE_FOR_LINESHEET.has(input.lifecycle_stage)
  ) {
    const a: NextAction = {
      action_id: `derived:article:${input.article_id}:complete_linesheet`,
      entity_ref: ref,
      action_type: 'OTHER',
      reason: [{ code: 'READINESS_GAP', params: { dimension: 'linesheet' } }],
      owner: { role: 'brand_ops' },
      source: { kind: 'derived', rule_id: 'article.derive.complete_linesheet' },
      status: 'open',
      explainability: { rule_id: 'article.derive.complete_linesheet' },
    };
    assertDerivationNextActionValid(a, 'deriveArticleNextAction.linesheet');
    return a;
  }

  return null;
}
