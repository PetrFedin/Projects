import type { Product } from '@/lib/types';
import type { B2BLoyaltyQuestV1, LoyaltyQuestV1 } from './types';

/** Геймификация B2B лояльности. */
export function getB2BLoyaltyQuests(partnerId: string): B2BLoyaltyQuestV1[] {
  return [
    {
      id: 'Q-01',
      title: 'Early Bird Pre-Order',
      description: 'Book 50% of your SS26 quota before May 15.',
      rewardPoints: 2500,
      progressPercent: 35,
      status: 'active',
    },
    {
      id: 'Q-02',
      title: 'Exchange Pioneer',
      description: 'Complete 3 successful trades on the Stock Exchange.',
      rewardPoints: 1000,
      progressPercent: 66,
      status: 'active',
    },
    {
      id: 'Q-03',
      title: 'Brand Ambassador',
      description: 'Download and sync 5 content packs to your Telegram/VK channel.',
      rewardPoints: 1500,
      progressPercent: 100,
      status: 'completed',
    },
  ];
}

/** Геймификация B2C лояльности (квесты для клиента). */
export function getAvailableQuests(product: Product): LoyaltyQuestV1[] {
  const quests: LoyaltyQuestV1[] = [
    {
      id: 'bq-01',
      title: 'Fashion Explorer',
      description: `Оставьте отзыв на этот ${product.name}, чтобы получить бонусы.`,
      rewardPoints: 150,
      status: 'available',
    },
    {
      id: 'bq-02',
      title: 'Eco Warrior',
      description: 'Сдайте старую одежду на переработку и получите скидку.',
      rewardPoints: 300,
      status: 'in_progress',
    },
    {
      id: 'bq-03',
      title: 'Style Guru',
      description: 'Создайте образ с этим товаром в Лукбуке.',
      rewardPoints: 200,
      status: 'available',
    },
  ];

  return quests;
}
