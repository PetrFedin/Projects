/**
 * Заглушка биллинга для подписок B2B; при интеграции заменить на реальный сервис.
 */
export class SmartBillingEngine {
  static checkCreditLimit(
    _clientId: string,
    _orderAmount: number
  ): { allowed: boolean; reason?: string } {
    return { allowed: true };
  }
}
