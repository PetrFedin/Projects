/**
 * JOOR Pay: хранилище кредита и платежей по заказам (realtime).
 * После оплаты обновляются: credit used, paidAmount по заказу → wouldExceed в матрице и «ожидает оплаты».
 * При наличии API — заменить на вызовы бэкенда.
 */

const CREDIT_LIMIT = 2_500_000;
const BASELINE_USED = 1_100_000; // уже использовано до записей в store

const STORAGE_KEY_PAYMENTS = 'b2b_order_payments';

export type StoredPayments = Record<string, number>; // orderId -> дополнительная оплаченная сумма

function loadPayments(): StoredPayments {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePayments(payments: StoredPayments) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
}

/** Доплаты по заказам (записанные в приложении). */
export function getOrderPayments(): StoredPayments {
  return loadPayments();
}

/** Сумма использованного кредита: базовый used + все записанные доплаты. */
export function getCreditUsed(): number {
  const payments = loadPayments();
  const extra = Object.values(payments).reduce((a, b) => a + b, 0);
  return BASELINE_USED + extra;
}

export function getCreditLimit(): number {
  return CREDIT_LIMIT;
}

/**
 * Записать оплату по заказу. Увеличивает used на amount и сохраняет paidAmount по orderId.
 * После вызова кредит и «ожидает оплаты» пересчитываются при следующем чтении.
 */
export function recordPayment(orderId: string, amount: number): void {
  if (amount <= 0) return;
  const payments = loadPayments();
  payments[orderId] = (payments[orderId] ?? 0) + amount;
  savePayments(payments);
}

/** Для заказа: базовый paidAmount (из мока) + записанный в store. */
export function getEffectivePaidAmount(orderId: string, basePaidFromOrder: number): number {
  const payments = loadPayments();
  return (basePaidFromOrder ?? 0) + (payments[orderId] ?? 0);
}
