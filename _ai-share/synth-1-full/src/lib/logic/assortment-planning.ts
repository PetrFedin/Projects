export interface StoreDemographics {
  storeId: string;
  region: string;
  averageIncomeLevel: 'low' | 'medium' | 'high';
  climateZone: 'tropical' | 'temperate' | 'cold';
  currentWeatherForecast: 'sunny' | 'rainy' | 'snowy';
  historicalSalesVelocity: number; // Средняя скорость продаж в день
}

export interface AssortmentAllocation {
  storeId: string;
  allocatedQuantity: number;
  reasoning: string;
}

/**
 * [Phase 18 — Hyper-Local Assortment Planning (AI Merchandiser)]
 * Умное распределение товара по магазинам (Allocation).
 * Анализирует локальные данные (погода, уровень дохода, исторические продажи),
 * чтобы отправить товар туда, где он продастся быстрее всего и без скидок.
 */
export class AssortmentPlanningEngine {
  /**
   * Распределяет партию товара между розничными магазинами.
   */
  public static allocateInventory(
    sku: string,
    totalQuantityAvailable: number,
    stores: StoreDemographics[],
    productCategory: 'summer_wear' | 'winter_wear' | 'premium_accessories'
  ): AssortmentAllocation[] {
    let remainingQuantity = totalQuantityAvailable;
    const allocations: AssortmentAllocation[] = [];

    // 1. Оценка потенциала каждого магазина (Scoring)
    const storeScores = stores.map((store) => {
      let score = store.historicalSalesVelocity * 10; // Базовый вес — история продаж

      // Климатический фактор
      if (productCategory === 'summer_wear') {
        if (store.climateZone === 'tropical') score *= 1.5;
        if (store.currentWeatherForecast === 'sunny') score *= 1.2;
        if (store.climateZone === 'cold') score *= 0.2; // Почти не продается
      } else if (productCategory === 'winter_wear') {
        if (store.climateZone === 'cold') score *= 1.8;
        if (store.currentWeatherForecast === 'snowy') score *= 1.3;
        if (store.climateZone === 'tropical') score *= 0.1;
      }

      // Фактор дохода (для премиум-товаров)
      if (productCategory === 'premium_accessories') {
        if (store.averageIncomeLevel === 'high') score *= 2.0;
        if (store.averageIncomeLevel === 'low') score *= 0.5;
      }

      return { store, score };
    });

    // 2. Нормализация скоров (доли от общей суммы)
    const totalScore = storeScores.reduce((sum, s) => sum + s.score, 0);

    if (totalScore === 0) {
      return stores.map((s) => ({
        storeId: s.storeId,
        allocatedQuantity: 0,
        reasoning: 'No demand potential detected.',
      }));
    }

    // 3. Пропорциональное распределение (Allocation)
    for (const { store, score } of storeScores) {
      const share = score / totalScore;
      let allocated = Math.floor(totalQuantityAvailable * share);

      // Защита от переполнения
      if (allocated > remainingQuantity) allocated = remainingQuantity;
      remainingQuantity -= allocated;

      allocations.push({
        storeId: store.storeId,
        allocatedQuantity: allocated,
        reasoning: `Allocated ${(share * 100).toFixed(1)}% based on local climate (${store.climateZone}, ${store.currentWeatherForecast}) and income level (${store.averageIncomeLevel}).`,
      });
    }

    // 4. Распределение остатка (из-за округления) лучшему магазину
    if (remainingQuantity > 0 && allocations.length > 0) {
      // Сортируем по убыванию аллокации и отдаем остаток лидеру
      allocations.sort((a, b) => b.allocatedQuantity - a.allocatedQuantity);
      allocations[0].allocatedQuantity += remainingQuantity;
      allocations[0].reasoning += ` (+${remainingQuantity} units from rounding remainder).`;
    }

    return allocations;
  }
}
