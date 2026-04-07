/**
 * Тарифные планы подписки — единый источник для страницы подписки и раздела лояльности.
 */

export type PlanId = 'starter' | 'professional' | 'advanced' | 'elite';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  currency: 'RUB';
  description: string;
  features: string[];
  limits?: {
    apiCalls?: number | null;
    storageGb?: number | null;
    teamMembers?: number | null;
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 19900,
    currency: 'RUB',
    description: 'Стартовый план для малого бизнеса.',
    features: [
      'До 5K API calls в месяц',
      '50 GB хранилища',
      'До 5 участников команды',
      'Email поддержка',
    ],
    limits: { apiCalls: 5000, storageGb: 50, teamMembers: 5 },
  },
  {
    id: 'professional',
    name: 'Professional',
    priceMonthly: 29900,
    currency: 'RUB',
    description: 'Для растущих брендов и дистрибьюторов.',
    features: [
      'До 50K API calls в месяц',
      '200 GB хранилища',
      'До 20 участников',
      'Приоритетная поддержка',
      'Интеграции с маркетплейсами',
    ],
    limits: { apiCalls: 50000, storageGb: 200, teamMembers: 20 },
  },
  {
    id: 'advanced',
    name: 'Advanced',
    priceMonthly: 49900,
    currency: 'RUB',
    description: 'Расширенные возможности для средних брендов.',
    features: [
      'До 100K API calls в месяц',
      '500 GB хранилища',
      'До 50 участников',
      'Поддержка 24/7',
      'AI-аналитика',
      'ERP/CRM интеграции',
    ],
    limits: { apiCalls: 100000, storageGb: 500, teamMembers: 50 },
  },
  {
    id: 'elite',
    name: 'Brand ELITE',
    priceMonthly: 75000,
    currency: 'RUB',
    description: 'Максимальные возможности для крупных брендов и модных домов.',
    features: [
      'Безлимитные B2B и B2C заказы',
      '100K+ API calls в месяц',
      '500 GB+ хранилища',
      'Безлимитные участники команды',
      'Приоритетная поддержка 24/7',
      'Белый лейбл и кастомизация',
      'AI-аналитика и прогнозы',
      'Интеграции с ERP/CRM',
      'Dedicated account manager',
    ],
    limits: { apiCalls: null, storageGb: null, teamMembers: null },
  },
];

export const DEFAULT_PLAN_ID: PlanId = 'elite';

export function getPlanById(id: PlanId | string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id);
}

export function formatPrice(amount: number, currency: 'RUB' = 'RUB'): string {
  return `${amount.toLocaleString('ru-RU')} ${currency === 'RUB' ? '₽' : currency}`;
}
