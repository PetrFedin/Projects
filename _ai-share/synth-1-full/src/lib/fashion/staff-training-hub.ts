import type { StaffTrainingPackV1 } from './types';

/** Хаб обучения персонала магазинов: технические аргументы для продаж. */
export function getStaffTrainingPack(sku: string): StaffTrainingPackV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 29;

  return {
    sku,
    keySellingPointsRu: [
      'Премиальный хлопок с плотностью 240г/м²',
      'Усиленные швы для долговечности при частой стирке',
      'Оверсайз крой, подходящий на 3 размера (S-L)',
      'Гипоаллергенный краситель, не выцветает на солнце',
    ],
    fabricBenefitRu:
      'Ткань прошла обработку "антипиллинг", что предотвращает появление катышков даже после 50 стирок.',
    fitAdviceRu:
      'Рекомендуйте брать свой размер для умеренного оверсайза или на размер меньше для более классической посадки.',
    comparisonWithCompetitorsRu:
      'В отличие от масс-маркета, здесь используется гребенная пряжа, которая мягче и долговечнее.',
    videoUrl: 'https://cdn.fashion-platform.ru/training/sku-101.mp4',
  };
}
