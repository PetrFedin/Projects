/**
 * Fit sessions: vault photo refs, без blob: для AI.
 */
import type { FitSession } from '@/lib/production/article-workspace/types';
import { isWorkshop2EphemeralPhotoUrl } from '@/lib/production/workshop2-fit-session-photo';

export type Workshop2FitSessionsStatus = {
  sessionCount: number;
  withVaultPhotoCount: number;
  withAiAnalysisCount: number;
  approvedCount: number;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2FitSessionsStatus(input: {
  sessions: FitSession[];
}): Workshop2FitSessionsStatus {
  const sessions = input.sessions ?? [];
  const withVaultPhotoCount = sessions.filter((s) =>
    Boolean(s.photoVaultDocumentId?.trim())
  ).length;
  const withAiAnalysisCount = sessions.filter((s) => Boolean(s.aiFitAnalysis)).length;
  const approvedCount = sessions.filter(
    (s) => s.status === 'approved' || s.status === 'approved_with_comments'
  ).length;

  const hasBlobCommentPhoto = sessions.some((s) =>
    (s.comments ?? []).some((c) => (c.photoUrls ?? []).some((u) => isWorkshop2EphemeralPhotoUrl(u)))
  );

  let state: Workshop2FitSessionsStatus['state'] = 'empty';
  if (sessions.length > 0) {
    state = withVaultPhotoCount > 0 || withAiAnalysisCount > 0 ? 'ready' : 'partial';
  }

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu = 'Нет сессий примерки — добавьте proto/SMS/PPS для дельт и AI.';
  } else if (hasBlobCommentPhoto) {
    hintRu = 'В комментариях есть blob: URL — для AI используйте photoVaultDocumentId.';
  } else if (withVaultPhotoCount === 0) {
    hintRu = `${sessions.length} сессий без vault-фото — привяжите photoVaultDocumentId для анализа.`;
  } else {
    hintRu = `${sessions.length} сессий · ${withVaultPhotoCount} с vault-фото · ${approvedCount} approved.`;
  }

  return {
    sessionCount: sessions.length,
    withVaultPhotoCount,
    withAiAnalysisCount,
    approvedCount,
    state,
    hintRu,
  };
}
