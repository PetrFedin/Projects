import { useCallback } from 'react';
import type { Workshop2FactoryHandoffChannel, Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { commitWorkshop2HandoffOnServer } from '@/lib/production/workshop2-server-handoff-client';

type ToastFn = (args: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void;

export function useWorkshop2HandoffCommit(input: {
  collectionId: string;
  articleId: string;
  updatedByLabel: string;
  toast: ToastFn;
  applyCommittedServerDossier: (next: { version: number; dossier: Workshop2DossierPhase1 }) => void;
}) {
  const { collectionId, articleId, updatedByLabel, toast, applyCommittedServerDossier } = input;

  const commitHandoffOnServer = useCallback(
    async (payload: {
      revisionLabel: string;
      windowNote?: string;
      contactLabel?: string;
      channel: Workshop2FactoryHandoffChannel;
      attachmentIds: string[];
      brandDispatched: { at: string; by: string };
      factoryReceived: { at: string; by: string };
    }) => {
      const committed = await commitWorkshop2HandoffOnServer({
        collectionId,
        articleId,
        actorLabel: updatedByLabel,
        ...payload,
      });
      if (!committed.ok) {
        toast({
          title: 'Передача в handoff не зафиксирована',
          description:
            committed.reason === 'preflight_blocked'
              ? 'Server-check: production pre-flight не пройден. Закройте блокеры.'
              : committed.reason === 'global_gate_blocked'
                ? `Server-check: исправьте минимум ТЗ перед handoff: ${(committed.sectionErrors ?? [])
                    .slice(0, 2)
                    .join(' ')}`
                : 'Не удалось зафиксировать передачу на сервере. Повторите попытку.',
          variant: 'destructive',
        });
        return false;
      }
      applyCommittedServerDossier({
        version: committed.data.version,
        dossier: committed.data.dossier,
      });
      return true;
    },
    [applyCommittedServerDossier, articleId, collectionId, toast, updatedByLabel]
  );

  return { commitHandoffOnServer };
}
