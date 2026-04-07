import type { Product } from '@/lib/types';
import type { ReturnPolicyHint } from './types';

/** Эвристика окна возврата и ограничений до подключения legal / OMS. */
export function buildReturnPolicyHint(product: Product): ReturnPolicyHint {
  const restrictions: string[] = [];
  const tags = product.tags ?? [];

  if (tags.includes('noSale')) {
    return {
      summary: 'Позиция в демо помечена как финальная распродажа — возврат обычно не предусмотрен.',
      daysHint: null,
      restrictions: ['Сверьте с офертой и правилами маркетплейса.'],
    };
  }

  const cat = `${product.category} ${product.subcategory ?? ''} ${product.name}`.toLowerCase();
  if (/бель|колгот|купальн|нижн|swim|underwear|lingerie|socks?\b|носк/i.test(cat)) {
    restrictions.push('Гигиенические категории: возврат часто ограничен после вскрытия упаковки.');
  }

  let daysHint = 14;
  const rd = product.attributes?.returnDays;
  if (typeof rd === 'number' && rd > 0 && rd < 365) daysHint = Math.round(rd);
  else if (typeof rd === 'string' && /^\d{1,3}$/.test(rd.trim())) {
    const n = parseInt(rd.trim(), 10);
    if (n > 0 && n < 365) daysHint = n;
  }

  if (product.outlet) {
    daysHint = Math.min(daysHint, 7);
    restrictions.push('Outlet: в демо сокращаем окно до 7 дней или меньше при явном returnDays.');
  }

  const summary = `Ориентир для витрины: до ${daysHint} дней с момента получения при сохранении товарного вида и бирок.`;

  return { summary, daysHint, restrictions };
}
