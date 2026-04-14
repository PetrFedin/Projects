import { EntityRef } from '@/lib/contracts';
import { DomainEventTypes, eventBus, RiskAlertEvent } from '@/lib/order/domain-events';

/**
 * [Phase 2 — Interaction Linkage]
 * Связывание операционных взаимодействий (чаты, задачи) с сигналами управления.
 * [Phase 3] Авто-создание чатов на основе событий риска.
 */

export type InteractionType = 'chat' | 'task' | 'decision';

export interface InteractionAnchor {
  interaction_id: string;
  interaction_type: InteractionType;
  /** Ссылка на блокировщик или сигнал, к которому привязано обсуждение */
  blocker_id?: string;
  action_id?: string;
  entity_ref: EntityRef;
  metadata: {
    created_at: string;
    created_by: string;
    status: 'open' | 'resolved';
  };
}

export class InteractionLinkageService {
  private anchors: Map<string, InteractionAnchor[]> = new Map(); // blockerId -> anchors[]

  constructor() {
    // [Phase 3] Подписка на события риска для авто-создания чатов
    eventBus.subscribe(DomainEventTypes.control.riskAlert, (event: RiskAlertEvent) => {
      if (event.payload.autoCreateInteraction) {
        this.autoCreateChatForRisk(event);
      }
    });
  }

  /**
   * Привязывает чат или задачу к конкретному блокировщику.
   */
  public linkInteraction(anchor: InteractionAnchor): void {
    const key = anchor.blocker_id || anchor.action_id || anchor.entity_ref.entity_id;
    const existing = this.anchors.get(key) || [];
    this.anchors.set(key, [...existing, anchor]);
    
    console.log(`[InteractionLinkage] Linked ${anchor.interaction_type} to ${key}`);
  }

  /**
   * Возвращает все обсуждения, связанные с сигналом.
   */
  public getInteractions(key: string): InteractionAnchor[] {
    return this.anchors.get(key) || [];
  }

  /**
   * Проверяет, можно ли считать сигнал "в процессе решения" (есть открытые обсуждения).
   */
  public isUnderDiscussion(key: string): boolean {
    const anchors = this.anchors.get(key) || [];
    return anchors.some(a => a.metadata.status === 'open');
  }

  /**
   * [Phase 3] Автоматически создает и привязывает чат при высоком риске.
   */
  private autoCreateChatForRisk(event: RiskAlertEvent) {
    const entityId = event.aggregateId;
    const riskLevel = event.payload.riskLevel;
    
    // Проверяем, нет ли уже открытого чата по этому риску
    if (this.isUnderDiscussion(entityId)) {
      return;
    }

    const newChat: InteractionAnchor = {
      interaction_id: `auto-chat-${Date.now()}`,
      interaction_type: 'chat',
      blocker_id: `risk-${entityId}`,
      entity_ref: {
        entity_id: entityId,
        entity_type: 'commitment'
      },
      metadata: {
        created_at: new Date().toISOString(),
        created_by: 'system',
        status: 'open'
      }
    };

    this.linkInteraction(newChat);
    console.log(`[InteractionLinkage] Auto-created chat ${newChat.interaction_id} for high risk on ${entityId}`);
  }
}

export const interactionLinkage = new InteractionLinkageService();
