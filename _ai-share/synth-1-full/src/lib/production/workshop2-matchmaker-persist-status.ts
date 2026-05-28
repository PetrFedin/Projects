/**
 * Matchmaker: persist в dossier.matchmakerResult после PUT.
 */
import type { Workshop2MatchmakerPersistedResult } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2MatchmakerPersistStatus = {
  hasPersistedResult: boolean;
  recommendedLabel?: string;
  confidence?: number;
  syncedAt?: string;
  state: 'empty' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2MatchmakerPersistStatus(input: {
  matchmaker?: Workshop2MatchmakerPersistedResult | null;
  genkitConfigured?: boolean;
}): Workshop2MatchmakerPersistStatus {
  const saved = input.matchmaker;
  const hasPersistedResult = Boolean(saved?.recommendedContractorId || saved?.raw);

  let state: Workshop2MatchmakerPersistStatus['state'] = hasPersistedResult ? 'ready' : 'empty';

  let hintRu: string | undefined;
  if (!input.genkitConfigured) {
    hintRu =
      'Genkit не настроен (GOOGLE_GENAI_API_KEY) — matchmaker недоступен; сохранённый результат из досье показывается ниже.';
  } else if (hasPersistedResult) {
    hintRu = `В досье: ${saved?.recommendedLabel ?? saved?.recommendedContractorId ?? 'подрядчик'} · confidence ${saved?.confidence ?? '—'}%.`;
  } else {
    hintRu = 'Запустите подбор — результат сохранится в dossier.matchmakerResult через PUT.';
  }

  return {
    hasPersistedResult,
    recommendedLabel: saved?.recommendedLabel,
    confidence: saved?.confidence,
    syncedAt: saved?.syncedAt,
    state,
    hintRu,
  };
}
