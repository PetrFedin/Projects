/**
 * Демо-профиль и рекомендации для `/shop/clienteling` до подключения API.
 */

import type { CustomerProfile, RecommendationEngineResult } from '@/lib/types/clienteling';

export const CLIENTELING_DASH_DEMO_CUSTOMER: CustomerProfile = {
  id: 'C-8812',
  name: 'Alexandra Romanova',
  email: 'alexandra.r@example.com',
  phone: '+7 900 123-45-67',
  avatarUrl: '/avatars/alexandra.jpg',
  totalSpent: 4250,
  lastVisit: '2026-03-05T14:00:00Z',
  loyaltyTier: 'gold',
  loyaltyPoints: 1250,
  measurements: {
    id: 'm-1',
    userId: 'C-8812',
    unit: 'cm',
    height: 172,
    weight: 60,
    chest: 88,
    waist: 65,
    hips: 92,
    shoulderWidth: 40,
    armLength: 58,
    insideLeg: 102,
    scannedAt: '2026-02-15T10:00:00Z',
    scanMethod: 'ai_vision',
  },
  stylePreferences: ['Oversized', 'Minimalism', 'Natural Fabrics'],
  favoriteCategories: ['Knitwear', 'Dresses', 'Outerwear'],
  dislikedMaterials: ['Polyester', 'Synthetic fur'],
  wishlist: ['P-101', 'P-102'],
  purchaseHistory: [
    {
      orderId: 'ORD-1',
      date: '2026-02-15',
      amount: 850,
      items: [{ productId: 'p-1', name: 'Silk Blouse', size: 'S', color: 'White' }],
      storeId: 'Moscow City',
    },
    {
      orderId: 'ORD-2',
      date: '2025-12-20',
      amount: 1200,
      items: [{ productId: 'p-2', name: 'Wool Coat', size: 'S', color: 'Camel' }],
      storeId: 'Online',
    },
  ],
  staffNotes: [
    {
      id: 'n-1',
      staffId: 'S-42',
      staffName: 'Elena K.',
      text: 'Предпочитает примерку в отдельной кабине. Любит кофе без молока.',
      createdAt: '2026-02-15',
    },
  ],
};

export const CLIENTELING_DASH_DEMO_RECOMMENDATIONS: RecommendationEngineResult = {
  customerId: 'C-8812',
  suggestedProducts: [
    {
      productId: 'p-1',
      name: 'Silk Trousers',
      reason: 'Matches previous purchase of Silk Blouse',
      score: 98,
    },
    {
      productId: 'p-2',
      name: 'Cashmere Sweater',
      reason: 'Fits preference for Minimalism & Natural Fabrics',
      score: 92,
    },
    {
      productId: 'p-3',
      name: 'Leather Belt',
      reason: 'Perfect accessory for the Oversized look',
      score: 85,
    },
  ],
  styleInsight: 'Клиент ценит тактильность и качество швов. Фокус на материалах.',
};
