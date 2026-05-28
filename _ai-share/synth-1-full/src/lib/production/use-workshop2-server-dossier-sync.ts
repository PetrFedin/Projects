import { useCallback } from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import { persistWorkshop2DossierWithMerge } from '@/lib/production/workshop2-dossier-server-sync';
import { flushW2DossierMetricsToServer } from '@/lib/production/workshop2-dossier-metrics-ingest';
import { recordW2DossierPersistSuccess } from '@/lib/production/workshop2-dossier-session-metrics';

type ToastFn = (args: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export function useWorkshop2ServerDossierSync(input: {
  collectionId: string;
  articleId: string;
  toast: ToastFn;
  w2DossierMetricsCtx: Parameters<typeof flushW2DossierMetricsToServer>[2];
  serverDossierVersionRef: MutableRefObject<number | null>;
  lastPersistedDossierRef: MutableRefObject<Workshop2DossierPhase1 | null>;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  setSaveError: Dispatch<SetStateAction<string | null>>;
  setDossierMetricsTick: Dispatch<SetStateAction<number>>;
  onManualReviewRequired?: (payload: {
    criticalFields: string[];
    localDossier: Workshop2DossierPhase1;
  }) => void;
}) {
  const {
    collectionId,
    articleId,
    toast,
    w2DossierMetricsCtx,
    serverDossierVersionRef,
    lastPersistedDossierRef,
    setDossierInternal,
    setSaveError,
    setDossierMetricsTick,
    onManualReviewRequired,
  } = input;

  const applyCommittedServerDossier = useCallback(
    (next: { version: number; dossier: Workshop2DossierPhase1 }) => {
      serverDossierVersionRef.current = next.version;
      setWorkshop2Phase1Dossier(collectionId, articleId, next.dossier);
      lastPersistedDossierRef.current = next.dossier;
      setDossierInternal(next.dossier);
      setSaveError(null);
      recordW2DossierPersistSuccess(collectionId, articleId);
      setDossierMetricsTick((n) => n + 1);
      flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
    },
    [
      articleId,
      collectionId,
      lastPersistedDossierRef,
      serverDossierVersionRef,
      setDossierInternal,
      setDossierMetricsTick,
      setSaveError,
      w2DossierMetricsCtx,
    ]
  );

  const tryPersistDossierToServer = useCallback(
    async (stamped: Workshop2DossierPhase1) => {
      const persist = await persistWorkshop2DossierWithMerge({
        collectionId,
        articleId,
        dossier: stamped,
        baseVersion: serverDossierVersionRef.current ?? undefined,
      });
      if (persist.ok) {
        serverDossierVersionRef.current = persist.version;
        if (persist.mergedDossier) {
          applyCommittedServerDossier({
            version: persist.version,
            dossier: persist.mergedDossier,
          });
        }
        const critical = persist.manualReviewCriticalFields ?? [];
        if (critical.length > 0) {
          onManualReviewRequired?.({ criticalFields: critical, localDossier: stamped });
          setSaveError(
            `Авто-merge выполнен, но нужен ручной аудит критичных полей: ${critical.join(', ')}`
          );
          toast({
            title: 'Конфликт синхронизирован (нужен аудит)',
            description: `Проверьте критичные поля: ${critical.slice(0, 3).join(', ')}.`,
            variant: 'destructive',
          });
        }
        return;
      }
      setSaveError('Серверное сохранение не удалось. Проверьте соединение и повторите попытку.');
      toast({
        title: 'Сохранение на сервере не завершено',
        description:
          persist.reason === 'merge_failed'
            ? 'Обнаружен конфликт версий серверного досье. Авто-merge не применился, перезагрузите карточку.'
            : 'Сервер недоступен или вернул ошибку при сохранении досье.',
        variant: 'destructive',
      });
    },
    [
      applyCommittedServerDossier,
      articleId,
      collectionId,
      serverDossierVersionRef,
      setSaveError,
      toast,
      onManualReviewRequired,
    ]
  );

  return { applyCommittedServerDossier, tryPersistDossierToServer };
}
