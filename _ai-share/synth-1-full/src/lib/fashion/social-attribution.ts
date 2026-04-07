import type { Product } from '@/lib/types';
import type { SocialAttributionV1 } from './types';

/** Трекинг атрибуции из социальных сетей (TG, VK, Блогеры). */
export function getSocialAttribution(product: Product): SocialAttributionV1[] {
  return [
    {
      channel: 'Telegram',
      reach: 50000,
      conversionRate: 0.045,
      promoCode: `TG-${product.sku.slice(-4)}`,
      activeStatus: true,
    },
    {
      channel: 'Bloggers',
      reach: 120000,
      conversionRate: 0.021,
      promoCode: `BLOG-26`,
      activeStatus: true,
    },
    {
      channel: 'VK',
      reach: 15000,
      conversionRate: 0.012,
      promoCode: `VK-MARKET`,
      activeStatus: false,
    }
  ];
}
