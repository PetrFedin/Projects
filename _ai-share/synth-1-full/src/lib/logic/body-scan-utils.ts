import { BodyMeasurements, FitMatchResult } from '../types/client';

export interface SizeChartEntry {
  size: string;
  chestMin: number;
  chestMax: number;
  waistMin: number;
  waistMax: number;
  hipsMin: number;
  hipsMax: number;
}

/**
 * Fit-Match Algorithm
 * Сравнивает замеры тела с размерной сеткой бренда.
 */
export function calculateFitMatch(
  measurements: BodyMeasurements,
  sizeChart: SizeChartEntry[],
  fitPreference: 'slim' | 'regular' | 'oversized' = 'regular'
): FitMatchResult | null {
  if (!measurements || !sizeChart.length) return null;

  // 1. Поиск идеального размера
  const scores = sizeChart.map((entry) => {
    // Рассчитываем отклонение (delta) для каждой метрики
    const chestDelta = calculateDelta(measurements.chest, entry.chestMin, entry.chestMax);
    const waistDelta = calculateDelta(measurements.waist, entry.waistMin, entry.waistMax);
    const hipsDelta = calculateDelta(measurements.hips, entry.hipsMin, entry.hipsMax);

    // Веса: Грудь (0.5), Талия (0.3), Бедра (0.2) - могут меняться от категории
    const totalDelta = chestDelta * 0.5 + waistDelta * 0.3 + hipsDelta * 0.2;

    return {
      size: entry.size,
      totalDelta,
      chestDelta,
      waistDelta,
      hipsDelta,
    };
  });

  // Сортируем по минимальному отклонению
  const bestMatch = scores.sort((a, b) => a.totalDelta - b.totalDelta)[0];

  // 2. Определение типа посадки на основе предпочтений
  let fitType: 'perfect' | 'tight' | 'loose' = 'perfect';
  if (bestMatch.totalDelta > 2) {
    fitType = bestMatch.totalDelta > 5 ? 'loose' : 'tight'; // Упрощенная логика
  }

  return {
    productId: 'current-product', // Заглушка
    recommendedSize: bestMatch.size,
    confidence: Math.max(0, 1 - bestMatch.totalDelta / 10),
    fitType,
    sizeChartUsed: 'brand-default-chart',
    measurementDelta: {
      chest: bestMatch.chestDelta,
      waist: bestMatch.waistDelta,
      hips: bestMatch.hipsDelta,
    },
  };
}

function calculateDelta(value: number, min: number, max: number): number {
  if (value < min) return min - value; // Мало
  if (value > max) return value - max; // Велико
  return 0; // Идеально попадает в диапазон
}

/**
 * Сравнение с размерами других брендов (Zara, Mango)
 * Эмуляция алгоритма "Find your size at Brand X"
 */
export function compareWithCompetitorSizes(
  measurements: BodyMeasurements,
  competitorBrand: string
): string {
  // В реальности здесь будет API запрос к базе размерных сеток
  console.log(`[FitMatch] Comparing measurements with ${competitorBrand} database...`);

  // Заглушка для демонстрации
  if (measurements.chest > 100) return 'XL';
  if (measurements.chest > 92) return 'L';
  if (measurements.chest > 84) return 'M';
  return 'S';
}
