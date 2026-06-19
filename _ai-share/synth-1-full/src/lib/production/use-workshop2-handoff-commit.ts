import { useCallback } from 'react';
import type {
  Workshop2FactoryHandoffChannel,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { commitWorkshop2HandoffOnServer } from '@/lib/production/workshop2-server-handoff-client';

type ToastFn = (args: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export function useWorkshop2HandoffCommit(input: {
  collectionId: string;
  articleId: string;
  updatedByLabel: string;
  orderId?: string;
  toast: ToastFn;
  applyCommittedServerDossier: (next: { version: number; dossier: Workshop2DossierPhase1 }) => void;
}) {
  const { collectionId, articleId, updatedByLabel, orderId, toast, applyCommittedServerDossier } =
    input;

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
        orderId: orderId?.trim() || undefined,
        ...payload,
      });
      if (!committed.ok) {
        toast({
          title: 'Передача в handoff не зафиксирована',
          description:
            committed.reason === 'preflight_blocked'
              ? 'Server-check: production pre-flight не пройден. Закройте блокеры.'
              : committed.reason === 'global_gate_blocked'
                ? `Server-check: исправьте минимум ТЗ перед handoff: ${(
                    committed.sectionErrors ?? []
                  )
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
      const b2bItem = committed.data.b2bSync?.results?.[0];
      if (b2bItem?.ok) {
        toast({
          title: 'Передача зафиксирована',
          description: b2bItem.productionOrderId
            ? `${b2bItem.messageRu} · PO ${b2bItem.productionOrderId}`
            : b2bItem.messageRu,
        });
      } else if (committed.data.b2bSync?.attempted && b2bItem && !b2bItem.ok) {
        toast({
          title: 'Handoff сохранён · B2B синх не выполнен',
          description: b2bItem.messageRu,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Передача зафиксирована на сервере',
          description: orderId
            ? `Dossier handoff · заказ ${orderId}`
            : 'Dossier handoff · B2B заказ не найден для синка',
        });
      }
      return true;
    },
    [applyCommittedServerDossier, articleId, collectionId, orderId, toast, updatedByLabel]
  );

  return { commitHandoffOnServer };
}
