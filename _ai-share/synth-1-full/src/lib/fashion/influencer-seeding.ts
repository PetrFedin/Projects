import type { Product } from '@/lib/types';
import type { InfluencerSeedingV1 } from './types';

/** Управление посевами у блогеров (PR / Influencer Seeding). */
export function getInfluencerSeedings(product: Product): InfluencerSeedingV1[] {
  return [
    {
      id: 'S-TG-01',
      name: 'Modny TG Channel',
      channel: 'Telegram',
      status: 'shipped',
      sentSku: product.sku,
      reach: 45000,
    },
    {
      id: 'S-VK-02',
      name: 'Fashion Guru VK',
      channel: 'VK',
      status: 'mention_received',
      sentSku: product.sku,
      reach: 12000,
    },
  ];
}
