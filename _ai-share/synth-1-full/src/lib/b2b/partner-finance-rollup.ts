/**
 * Единый дашборд заказов и финансы (Order + Payments rollup).
 * JOOR-style: лимит, использовано, ожидает оплаты, оплачено за период.
 * Realtime: кредит и paidAmount по заказам из credit-store (обновляются после JOOR Pay).
 */

import { getCreditForCurrentPartner } from './credit-check';
import { getOrderPayments } from './credit-store';
import { mockB2BOrders } from '@/lib/order-data';
import type { B2BOrder, B2BOrderPaymentStatus } from '@/lib/types';

function isAwaitingPaymentStatus(
  s: B2BOrderPaymentStatus | undefined
): s is 'pending' | 'partial' | 'overdue' {
  return s === 'pending' || s === 'partial' || s === 'overdue';
}

/** Парсит сумму из строки "750 000 ₽" или "0 ₽" */
export function parseAmount(s: string): number {
  if (!s || s === '0 ₽') return 0;
  const num = s
    .replace(/\s/g, '')
    .replace(/[^\d.,]/g, '')
    .replace(',', '.');
  return parseFloat(num) || 0;
}

/** Заказы с учётом записанных платежей (paidAmount + paymentStatus пересчитаны). */
export function getOrdersWithPaymentState(): B2BOrder[] {
  const payments = getOrderPayments();
  return mockB2BOrders.map((o) => {
    const orderTotal = parseAmount(o.amount ?? '0 ₽');
    const basePaid = o.paidAmount ?? 0;
    const effectivePaid = basePaid + (payments[o.order] ?? 0);
    let paymentStatus = o.paymentStatus;
    if (effectivePaid >= orderTotal && orderTotal > 0) paymentStatus = 'paid';
    else if (effectivePaid > 0) paymentStatus = 'partial';
    return { ...o, paidAmount: effectivePaid, paymentStatus };
  });
}

export interface PartnerFinanceRollup {
  /** Кредитный лимит и использование */
  credit: {
    limit: number;
    used: number;
    available: number;
    blocked: boolean;
  };
  /** Сумма к оплате (ожидающие платежи: pending, partial, overdue) */
  awaitingPayment: number;
  /** Оплачено за текущий период (мок: последние 30 дней или все paid) */
  paidThisPeriod: number;
  /** Заказы по статусам: статус → количество */
  ordersByStatus: Record<string, number>;
  /** Заказы, требующие оплаты (для списка) */
  ordersAwaitingPayment: B2BOrder[];
  /** Заказы за период (для списка, мок — все кроме черновиков) */
  recentOrders: B2BOrder[];
}

/** Сводка по текущему партнёру. Realtime: кредит и заказы с учётом оплат из credit-store. */
export function getPartnerFinanceRollup(): PartnerFinanceRollup {
  const credit = getCreditForCurrentPartner();
  const orders = getOrdersWithPaymentState();

  const ordersByStatus: Record<string, number> = {};
  orders.forEach((o) => {
    const s = o.status ?? 'Черновик';
    ordersByStatus[s] = (ordersByStatus[s] ?? 0) + 1;
  });

  let awaitingPayment = 0;
  const ordersAwaitingPayment: B2BOrder[] = [];
  orders.forEach((o) => {
    if (!isAwaitingPaymentStatus(o.paymentStatus)) return;
    const amount = parseAmount(o.amount ?? '0 ₽');
    const paid = o.paidAmount ?? 0;
    awaitingPayment += amount - paid;
    ordersAwaitingPayment.push(o);
  });

  let paidThisPeriod = 0;
  orders.forEach((o) => {
    if (o.paymentStatus === 'paid') {
      paidThisPeriod += parseAmount(o.amount ?? '0 ₽');
    } else if (o.paidAmount && o.paidAmount > 0) {
      paidThisPeriod += o.paidAmount;
    }
  });

  const recentOrders = orders.filter((o) => o.status !== 'Черновик').slice(0, 10);

  return {
    credit: {
      limit: credit.limit,
      used: credit.used,
      available: credit.available,
      blocked: credit.blocked,
    },
    awaitingPayment,
    paidThisPeriod,
    ordersByStatus,
    ordersAwaitingPayment,
    recentOrders,
  };
}
