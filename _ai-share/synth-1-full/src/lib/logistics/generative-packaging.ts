export interface PhysicalItem {
  sku: string;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  weightGram: number;
  quantity: number;
}

export interface PackagingResult {
  boxDimensionsMm: { l: number; w: number; h: number };
  totalWeightGram: number;
  totalVolumeCm3: number;
  voidFillVolumeCm3: number;
  voidFillPercentage: number;
  cardboardSavedKg: number;
  carbonSavedKg: number;
  instructions: string;
}

/**
 * [Phase 59 — Generative 3D Bin Packing Engine]
 * ИИ-движок для генеративной упаковки.
 * Рассчитывает идеальный размер коробки для заказа, минимизируя "воздух" (void fill)
 * и расход картона. Это снижает углеродный след (carbon footprint) при транспортировке.
 */
export class GenerativePackagingEngine {
  // Стандартная "универсальная" коробка для сравнения экономии
  private static readonly STANDARD_BOX_VOL_CM3 = 50 * 40 * 30; // 60,000 cm3
  private static readonly CARDBOARD_KG_PER_CM2 = 0.0005; // Вес картона на кв.см
  private static readonly CARBON_KG_PER_CARDBOARD_KG = 1.5; // Выбросы CO2 на 1 кг картона

  /**
   * Рассчитывает оптимальную коробку для списка товаров.
   * Использует упрощенную эвристику 3D Bin Packing.
   */
  public static calculateOptimalBox(items: PhysicalItem[]): PackagingResult | null {
    if (!items || items.length === 0) return null;

    let totalVolumeMm3 = 0;
    let totalWeightGram = 0;
    
    let maxL = 0;
    let maxW = 0;
    let maxH = 0;

    for (const item of items) {
      // [Phase 59] Math Hardening: защита от NaN и отрицательных габаритов
      const safeL = Math.max(1, isNaN(item.lengthMm) ? 100 : item.lengthMm);
      const safeW = Math.max(1, isNaN(item.widthMm) ? 100 : item.widthMm);
      const safeH = Math.max(1, isNaN(item.heightMm) ? 20 : item.heightMm);
      const safeWeight = Math.max(0, isNaN(item.weightGram) ? 100 : item.weightGram);
      const safeQty = Math.max(1, isNaN(item.quantity) ? 1 : Math.floor(item.quantity));

      const itemVol = safeL * safeW * safeH;
      totalVolumeMm3 += itemVol * safeQty;
      totalWeightGram += safeWeight * safeQty;

      // Коробка должна вмещать самый крупный предмет по каждому измерению
      maxL = Math.max(maxL, safeL);
      maxW = Math.max(maxW, safeW);
      maxH = Math.max(maxH, safeH);
    }

    // Эвристика: идеальный объем + 15% на зазоры и упаковочный материал
    const requiredVolumeMm3 = totalVolumeMm3 * 1.15;
    
    // Подгоняем габариты коробки под требуемый объем, начиная с минимально возможных
    let boxL = maxL;
    let boxW = maxW;
    let boxH = maxH;
    
    let currentBoxVolMm3 = boxL * boxW * boxH;
    
    // Равномерно увеличиваем габариты, пока не достигнем нужного объема
    // (Упрощенная модель генеративного дизайна коробки)
    while (currentBoxVolMm3 < requiredVolumeMm3) {
      boxL *= 1.05;
      boxW *= 1.05;
      boxH *= 1.05;
      currentBoxVolMm3 = boxL * boxW * boxH;
    }

    // Округление до целых миллиметров
    boxL = Math.ceil(boxL);
    boxW = Math.ceil(boxW);
    boxH = Math.ceil(boxH);

    const finalBoxVolCm3 = (boxL * boxW * boxH) / 1000;
    const itemsVolCm3 = totalVolumeMm3 / 1000;
    
    const voidFillVolumeCm3 = Math.max(0, finalBoxVolCm3 - itemsVolCm3);
    const voidFillPercentage = (voidFillVolumeCm3 / finalBoxVolCm3) * 100;

    // Расчет экономии (по сравнению со стандартной коробкой)
    const optimalBoxSurfaceAreaCm2 = 2 * ((boxL*boxW) + (boxH*boxW) + (boxH*boxL)) / 100;
    const standardBoxSurfaceAreaCm2 = 2 * ((500*400) + (300*400) + (300*500)) / 100;
    
    const optimalCardboardKg = optimalBoxSurfaceAreaCm2 * this.CARDBOARD_KG_PER_CM2;
    const standardCardboardKg = standardBoxSurfaceAreaCm2 * this.CARDBOARD_KG_PER_CM2;
    
    const cardboardSavedKg = Math.max(0, standardCardboardKg - optimalCardboardKg);
    const carbonSavedKg = cardboardSavedKg * this.CARBON_KG_PER_CARDBOARD_KG;

    return {
      boxDimensionsMm: { l: boxL, w: boxW, h: boxH },
      totalWeightGram: Math.round(totalWeightGram),
      totalVolumeCm3: Math.round(finalBoxVolCm3),
      voidFillVolumeCm3: Math.round(voidFillVolumeCm3),
      voidFillPercentage: Number(voidFillPercentage.toFixed(2)),
      cardboardSavedKg: Number(cardboardSavedKg.toFixed(3)),
      carbonSavedKg: Number(carbonSavedKg.toFixed(3)),
      instructions: `Cut custom box: ${boxL}x${boxW}x${boxH}mm. Void fill: ${voidFillPercentage.toFixed(1)}%. Saved ${carbonSavedKg.toFixed(2)}kg CO2.`
    };
  }
}
