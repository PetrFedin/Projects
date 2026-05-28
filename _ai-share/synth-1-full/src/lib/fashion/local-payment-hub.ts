import type { LocalPaymentV1 } from './types';

/** Доступные способы оплаты в РФ (СБП, SberPay, и т.д.). */
export function getLocalPaymentHub(): LocalPaymentV1[] {
  return [
    {
      method: 'SBP',
      bonusReward: 1, // +1% cashback
      isPreferred: true,
      description: 'Оплата по QR-коду через любое банковское приложение.',
    },
    {
      method: 'SberPay',
      bonusReward: 0,
      isPreferred: false,
      description: 'Безопасная оплата в приложении СберБанк Онлайн.',
    },
    {
      method: 'TinkoffPay',
      bonusReward: 0,
      isPreferred: false,
      description: 'Оплата в один клик через приложение Т-Банк.',
    },
  ];
}
