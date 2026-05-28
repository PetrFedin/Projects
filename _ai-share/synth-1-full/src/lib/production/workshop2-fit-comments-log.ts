/**
 * Wave 7 P0 #15: журнал комментариев посадки с media/pin + gate gold sample.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2FitCommentLogEntry,
  Workshop2FitCommentPin,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export type { Workshop2FitCommentLogEntry, Workshop2FitCommentPin };

export function isWorkshop2FitCommentsGateEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  return (
    String(env.WORKSHOP2_FIT_COMMENTS_GATE ?? '')
      .trim()
      .toLowerCase() === 'true'
  );
}

export function listWorkshop2FitCommentsFromDossier(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2FitCommentLogEntry[] {
  return dossier?.fitComments ?? [];
}

export function summarizeWorkshop2FitCommentsLog(input: {
  dossier: Workshop2DossierPhase1 | null | undefined;
}): {
  total: number;
  openCount: number;
  resolvedCount: number;
  hintRu: string;
} {
  const entries = listWorkshop2FitCommentsFromDossier(input.dossier);
  const openCount = entries.filter((e) => !e.resolved).length;
  const resolvedCount = entries.length - openCount;
  let hintRu = 'Комментарии посадки не добавлены.';
  if (openCount > 0) {
    hintRu = `Открытые комментарии посадки: ${openCount} — закройте перед gold sample.`;
  } else if (entries.length > 0) {
    hintRu = `Все ${entries.length} комментариев закрыты.`;
  }
  return { total: entries.length, openCount, resolvedCount, hintRu };
}

export function buildWorkshop2FitCommentsMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['fitCommentsMirror']> {
  const summary = summarizeWorkshop2FitCommentsLog({ dossier });
  return {
    mirroredAt: new Date().toISOString(),
    totalCount: summary.total,
    openCount: summary.openCount,
    blockerGoldSample: summary.openCount > 0,
    hintRu: summary.hintRu,
  };
}

export function persistWorkshop2FitCommentsMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    fitCommentsMirror: buildWorkshop2FitCommentsMirror(dossier),
  };
}

export function appendWorkshop2FitCommentToDossier(input: {
  dossier: Workshop2DossierPhase1;
  text: string;
  author: string;
  vaultAttachmentId?: string;
  pin?: Workshop2FitCommentPin;
  commentId?: string;
}): Workshop2DossierPhase1 {
  const entry: Workshop2FitCommentLogEntry = {
    commentId: input.commentId ?? `fc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: input.text.trim(),
    author: input.author.trim() || 'technologist',
    at: new Date().toISOString(),
    vaultAttachmentId: input.vaultAttachmentId?.trim() || undefined,
    pin: input.pin,
    resolved: false,
  };
  const next = {
    ...input.dossier,
    fitComments: [...(input.dossier.fitComments ?? []), entry],
  };
  return persistWorkshop2FitCommentsMirrorToDossier(next);
}

export function resolveWorkshop2FitCommentInDossier(input: {
  dossier: Workshop2DossierPhase1;
  commentId: string;
  resolvedBy: string;
}): Workshop2DossierPhase1 {
  const comments = (input.dossier.fitComments ?? []).map((c) =>
    c.commentId === input.commentId
      ? {
          ...c,
          resolved: true,
          resolvedAt: new Date().toISOString(),
          resolvedBy: input.resolvedBy.trim() || 'brand',
        }
      : c
  );
  return persistWorkshop2FitCommentsMirrorToDossier({
    ...input.dossier,
    fitComments: comments,
  });
}

/** Gate gold sample при WORKSHOP2_FIT_COMMENTS_GATE=true и открытых комментариях. */
export function evaluateWorkshop2FitCommentsGoldGate(input: {
  dossier: Workshop2DossierPhase1 | null | undefined;
  env?: Record<string, string | undefined>;
}): Workshop2HandoffReadinessCheck | null {
  if (!isWorkshop2FitCommentsGateEnabled(input.env)) return null;
  const summary = summarizeWorkshop2FitCommentsLog({ dossier: input.dossier });
  if (summary.openCount === 0) return null;
  return {
    id: 'fit.comments.open',
    severity: 'blocker',
    messageRu:
      summary.hintRu ??
      `Закройте ${summary.openCount} открытых комментариев посадки перед утверждением эталона.`,
  };
}
