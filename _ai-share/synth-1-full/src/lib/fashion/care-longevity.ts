import type { Product } from '@/lib/types';
import type { CareLongevityTipV1 } from './types';

/** Советы по продлению жизни вещи на основе состава (Longevity). */
export function getLongevityTips(product: Product): CareLongevityTipV1[] {
  const mat = (typeof product.composition === 'string' ? product.composition : '').toLowerCase();
  const tips: CareLongevityTipV1[] = [];

  if (mat.includes('wool') || mat.includes('шерсть')) {
    tips.push({
      action: 'Используйте щетку вместо стирки',
      impact: 'Сохраняет структуру волокна',
      estYearsAdded: 2,
    });
    tips.push({
      action: 'Хранение в сложенном виде',
      impact: 'Предотвращает деформацию плеч',
      estYearsAdded: 1,
    });
  } else if (mat.includes('cotton') || mat.includes('хлопок')) {
    tips.push({
      action: 'Стирка при 30°C вывернув наизнанку',
      impact: 'Защита цвета и принта',
      estYearsAdded: 1.5,
    });
  }

  tips.push({
    action: 'Steam instead of iron',
    impact: 'Reduces heat damage to fibers',
    estYearsAdded: 1,
  });

  return tips.slice(0, 3);
}
