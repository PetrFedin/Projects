import { ImmutableAuditTrail } from '../core/immutable-audit-trail';

export interface TradeInRequest {
  requestId: string;
  customerId: string;
  sku: string;
  originalPrice: number;
  condition: 'mint' | 'good' | 'fair' | 'poor';
  monthsOwned: number;
  dppHash?: string; // [Phase 28] Хэш цифрового паспорта для проверки подлинности
}

export interface TradeInResult {
  requestId: string;
  status: 'accepted' | 'rejected';
  storeCreditOffered: number;
  nextAction: 'resell_as_is' | 'refurbish' | 'recycle' | 'donate';
  estimatedResalePrice?: number;
  reasoning: string;
}

/**
 * [Phase 19 — Circular Economy & Re-commerce Engine]
 * Движок экономики замкнутого цикла (Trade-in & Resale).
 * Оценивает б/у вещи, предложенные клиентами к возврату,
 * рассчитывает размер кэшбека (Store Credit) и определяет судьбу вещи:
 * перепродажа (Pre-owned), ремонт (Refurbish) или переработка (Recycle).
 */
export class CircularEconomyEngine {
  /**
   * Оценивает заявку на Trade-in и выносит решение.
   */
  public static evaluateTradeIn(request: TradeInRequest): TradeInResult {
    // 0. [Phase 28] Проверка подлинности через Digital Product Passport (DPP)
    // Если вещь дорогая (премиум-сегмент), мы требуем сканирования QR-кода с DPP.
    if (request.originalPrice > 200) {
      if (!request.dppHash) {
        return {
          requestId: request.requestId,
          status: 'rejected',
          storeCreditOffered: 0,
          nextAction: 'recycle',
          reasoning: 'High-value item requires a valid Digital Product Passport (DPP) scan to prevent counterfeits. Please scan the QR code on the care label.'
        };
      }

      // Проверяем, существует ли такой хэш в нашем блокчейне
      const chain = ImmutableAuditTrail.getChain();
      const isValidDpp = chain.some(record => record.hash === request.dppHash && record.eventType === 'dpp.generated');

      if (!isValidDpp) {
        return {
          requestId: request.requestId,
          status: 'rejected',
          storeCreditOffered: 0,
          nextAction: 'recycle',
          reasoning: 'CRITICAL: Digital Product Passport verification failed. The item appears to be counterfeit or tampered with. Trade-in rejected.'
        };
      }
    }

    let creditPercent = 0;
    let nextAction: TradeInResult['nextAction'] = 'recycle';
    let estimatedResalePrice = 0;

    // 1. Базовая оценка состояния
    switch (request.condition) {
      case 'mint':
        creditPercent = 0.40; // 40% от оригинальной цены
        nextAction = 'resell_as_is';
        estimatedResalePrice = request.originalPrice * 0.70; // Продаем за 70%
        break;
      case 'good':
        creditPercent = 0.25;
        nextAction = 'refurbish'; // Требуется химчистка или мелкий ремонт
        estimatedResalePrice = request.originalPrice * 0.50;
        break;
      case 'fair':
        creditPercent = 0.10;
        nextAction = 'donate'; // Отдаем на благотворительность
        break;
      case 'poor':
        creditPercent = 0.05; // Символический бонус за экологичность
        nextAction = 'recycle'; // На переработку (волокна)
        break;
    }

    // 2. Амортизация по времени владения (устаревание коллекции)
    if (request.monthsOwned > 24 && nextAction === 'resell_as_is') {
      creditPercent *= 0.8; // Снижаем выплату, так как вещь старая
      estimatedResalePrice *= 0.8;
      nextAction = 'refurbish'; // Старые вещи чаще требуют обновления
    }

    // 3. Расчет финальных сумм
    const storeCreditOffered = Math.round(request.originalPrice * creditPercent);

    if (request.condition === 'poor' && request.monthsOwned > 60) {
      return {
        requestId: request.requestId,
        status: 'rejected',
        storeCreditOffered: 0,
        nextAction: 'recycle',
        reasoning: 'Item is too old and in poor condition. Cannot offer store credit, but will recycle for free.'
      };
    }

    return {
      requestId: request.requestId,
      status: 'accepted',
      storeCreditOffered,
      nextAction,
      estimatedResalePrice: estimatedResalePrice > 0 ? Math.round(estimatedResalePrice) : undefined,
      reasoning: `Condition is ${request.condition}. Offering ${storeCreditOffered} credit. Item will be routed to ${nextAction}.`
    };
  }
}
