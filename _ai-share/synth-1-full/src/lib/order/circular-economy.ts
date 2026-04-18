export type ItemCondition = 'pristine' | 'minor_wear' | 'damaged' | 'end_of_life';

export interface TradeInRequest {
  customerId: string;
  sku: string;
  originalPrice: number;
  declaredCondition: ItemCondition;
  monthsOwned: number;
}

export interface TradeInResult {
  accepted: boolean;
  creditAmount: number; // Сумма скидки/кредита для клиента
  nextLifecycleStage: 'resale' | 'refurbish' | 'recycle';
  reasoning: string;
}

/**
 * [Phase 12 — Circular Economy & Re-commerce]
 * Управление жизненным циклом товара после продажи (Trade-in, Resale, Recycle).
 * Позволяет брендам принимать старые вещи от клиентов в обмен на скидку,
 * восстанавливать их и продавать как "Pre-loved" (секонд-хенд) или отправлять в переработку.
 */
export class CircularEconomyEngine {
  /**
   * Обрабатывает заявку клиента на Trade-in (сдачу старой вещи).
   */
  public static processTradeIn(request: TradeInRequest): TradeInResult {
    const { originalPrice, declaredCondition, monthsOwned } = request;

    // Базовая амортизация (Depreciation): вещь теряет 10% стоимости каждый год
    const depreciationFactor = Math.max(0.1, 1 - (monthsOwned / 12) * 0.1);
    const depreciatedValue = originalPrice * depreciationFactor;

    if (declaredCondition === 'end_of_life') {
      // Вещь не подлежит восстановлению -> Переработка (Recycle)
      // Даем символический кредит (5% от оригинала) за экологичность
      return {
        accepted: true,
        creditAmount: Math.round(originalPrice * 0.05),
        nextLifecycleStage: 'recycle',
        reasoning:
          'Item is at end of life. Routing to textile recycling partner. Issued 5% eco-credit.',
      };
    }

    if (declaredCondition === 'damaged') {
      // Вещь повреждена, но можно починить -> Восстановление (Refurbish)
      // Стоимость ремонта вычитается из остаточной стоимости (например, 20% от оригинала)
      const repairCost = originalPrice * 0.2;
      const credit = Math.max(originalPrice * 0.05, depreciatedValue - repairCost);

      return {
        accepted: true,
        creditAmount: Math.round(credit),
        nextLifecycleStage: 'refurbish',
        reasoning: `Item requires repair (est. cost $${repairCost}). Routing to refurbish center. Issued trade-in credit.`,
      };
    }

    if (declaredCondition === 'minor_wear') {
      // Вещь с легким износом -> Химчистка и перепродажа (Resale)
      // Кредит 30% от остаточной стоимости
      const credit = depreciatedValue * 0.3;

      return {
        accepted: true,
        creditAmount: Math.round(credit),
        nextLifecycleStage: 'resale',
        reasoning:
          'Item has minor wear. Routing to "Pre-loved" resale channel after basic cleaning.',
      };
    }

    // Идеальное состояние (pristine) -> Сразу в перепродажу
    // Кредит 50% от остаточной стоимости
    const credit = depreciatedValue * 0.5;
    return {
      accepted: true,
      creditAmount: Math.round(credit),
      nextLifecycleStage: 'resale',
      reasoning:
        'Item is in pristine condition. Routing directly to premium "Pre-loved" resale channel.',
    };
  }
}
