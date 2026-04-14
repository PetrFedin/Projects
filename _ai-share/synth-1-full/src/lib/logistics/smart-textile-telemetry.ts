export interface WearableTelemetry {
  articleId: string;
  batchId: string;
  washCyclesDetected: number; // Считано с NFC/RFID метки при стирке
  estimatedWearHours: number; // Считано с умных нитей (Smart Threads)
  microTearDetected: boolean; // Микроразрыв ткани
  colorFadingPercent: number; // 0-100 (Потеря цвета)
}

export interface ProductEvolutionFeedback {
  articleId: string;
  durabilityScore: number; // 0-100 (Надежность)
  designRecommendation: string; // Совет для дизайнеров (Generative Designer)
  sustainabilityImpact: string;
  reasoning: string;
}

/**
 * [Phase 37 — Smart Textile Telemetry Engine (Post-Purchase IoT)]
 * Движок телеметрии умной одежды (IoT Wearables).
 * Собирает данные с одежды *после покупки*. Умные нити или NFC-метки передают
 * информацию о том, как часто вещь носят, стирают и где она рвется.
 * Эти данные возвращаются обратно в дизайн-отдел (Generative Designer),
 * чтобы следующие партии были прочнее и экологичнее.
 */
export class SmartTextileTelemetryEngine {
  /**
   * Анализирует телеметрию с умной одежды и генерирует фидбек для производства.
   */
  public static analyzeWearData(data: WearableTelemetry): ProductEvolutionFeedback {
    let durabilityScore = 100;
    let designRecommendation = 'Current design is performing well in the field.';
    let sustainabilityImpact = 'Neutral';

    // 1. Анализ износа (Wear & Tear)
    if (data.microTearDetected) {
      durabilityScore -= 30; // Критический дефект
      if (data.estimatedWearHours < 500) {
        // Порвалось слишком быстро
        designRecommendation = `CRITICAL: Micro-tears detected after only ${data.estimatedWearHours} hours of wear. Recommend reinforcing seams with double-needle stitching and upgrading thread tensile strength for the next batch.`;
        sustainabilityImpact = 'Negative: Premature failure leads to early disposal (landfill risk).';
      } else {
        // Порвалось от старости
        designRecommendation = `Normal wear and tear detected after ${data.estimatedWearHours} hours. Consider offering repair kits or upcycling options to the customer.`;
      }
    }

    // 2. Анализ стирки и цвета (Washing & Fading)
    if (data.colorFadingPercent > 20) {
      durabilityScore -= 15;
      if (data.washCyclesDetected < 10) {
        // Выцвело слишком быстро
        designRecommendation = `Color faded by ${data.colorFadingPercent}% after only ${data.washCyclesDetected} washes. Switch to a higher-grade reactive dye or add color-fastness treatment in the finishing process.`;
        sustainabilityImpact = 'Negative: Customer may discard item due to poor aesthetics.';
      }
    }

    // 3. Анализ частоты носки (Cost Per Wear)
    if (data.estimatedWearHours > 1000 && !data.microTearDetected) {
      // Вещь носят постоянно, и она не рвется — это хит!
      durabilityScore = 100;
      designRecommendation = `Item is a massive success. Highly durable (${data.estimatedWearHours} hours, ${data.washCyclesDetected} washes) with zero defects. Recommend expanding this fabric blend to other product categories.`;
      sustainabilityImpact = 'Highly Positive: Long lifecycle reduces overall carbon footprint per wear.';
    } else if (data.estimatedWearHours < 10 && data.washCyclesDetected > 0) {
      // Постирали и больше не носят (возможно, села или стала колючей)
      durabilityScore -= 10;
      designRecommendation = `Item worn for <10 hours but washed. Possible shrinkage or comfort issue post-wash. Investigate fabric pre-shrinking processes.`;
    }

    return {
      articleId: data.articleId,
      durabilityScore: Math.max(0, durabilityScore),
      designRecommendation,
      sustainabilityImpact,
      reasoning: `Analyzed telemetry from batch ${data.batchId}: ${data.estimatedWearHours} hours worn, ${data.washCyclesDetected} washes. Durability score: ${Math.max(0, durabilityScore)}/100.`
    };
  }
}
