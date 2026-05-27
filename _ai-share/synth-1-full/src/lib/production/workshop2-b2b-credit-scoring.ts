/**
 * Wave 26: эвристический credit score 0–100 по территориям, open orders и hold.
 * Не заменяет внешний скоринг — минимальный UI для закрытия parity matrix partial.
 */
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  evaluateWorkshop2B2bCreditHold,
  type Workshop2B2bCreditAccount,
} from '@/lib/production/workshop2-b2b-credit-hold';

export type Workshop2B2bCreditScoreRow = {
  buyerName: string;
  territoryId: string;
  territoryLabelRu: string;
  score: number;
  onHold: boolean;
  suggestedLimitRub: number;
  openOrdersRub: number;
  creditLimitRub: number;
  hintRu: string;
};

function ordersForTerritory(
  territoryId: string,
  customerName: string | undefined,
  orders: Workshop2B2bOrderRecord[]
): Workshop2B2bOrderRecord[] {
  const tid = territoryId.trim().toUpperCase();
  const name = (customerName ?? '').trim().toLowerCase();
  return orders.filter((o) => {
    const buyer = String(o.buyerId ?? '')
      .trim()
      .toUpperCase();
    if (buyer && (buyer.includes(tid) || buyer.includes(tid.replace(/-/g, '')))) return true;
    if (name && buyer && buyer.includes(name.split(/\s+/)[0] ?? '')) return true;
    return false;
  });
}

/** Score 0–100: utilization, hold, shipped/cancelled history. */
export function computeWorkshop2B2bCreditScore(input: {
  account: Workshop2B2bCreditAccount;
  territoryOrders: Workshop2B2bOrderRecord[];
  env?: Record<string, string | undefined>;
}): { score: number; onHold: boolean; suggestedLimitRub: number; hintRu: string } {
  const { account, territoryOrders, env } = input;
  const limit = Math.max(1, account.creditLimitRub);
  const utilization = account.openOrdersRub / limit;
  const holdProbe = evaluateWorkshop2B2bCreditHold({
    territoryId: account.territoryId,
    orderTotalRub: account.openOrdersRub + 1,
    accounts: [account],
    env: { WORKSHOP2_B2B_CREDIT_HOLD: 'true', ...env },
  });
  const onHold = !holdProbe.allowed && holdProbe.exceeded;

  let score = 100;
  score -= Math.min(45, Math.round(utilization * 55));
  if (onHold) score -= 28;
  const shipped = territoryOrders.filter((o) => o.status === 'shipped').length;
  const cancelled = territoryOrders.filter((o) => o.status === 'cancelled').length;
  score += Math.min(12, shipped * 4);
  score -= Math.min(18, cancelled * 6);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const suggestedLimitRub = Math.max(0, Math.round(account.creditLimitRub * (clamped / 100)));

  const hintRu = onHold
    ? `Hold: превышен лимит (${account.openOrdersRub.toLocaleString('ru-RU')} ₽ / ${limit.toLocaleString('ru-RU')} ₽).`
    : utilization > 0.85
      ? `Высокая утилизация ${Math.round(utilization * 100)}% — снизить exposure.`
      : `Стабильный профиль: score ${clamped}, отгрузок ${shipped}.`;

  return { score: clamped, onHold, suggestedLimitRub, hintRu };
}

export function buildWorkshop2B2bCreditScoreRows(input: {
  territories: Array<Workshop2B2bCreditAccount & { labelRu?: string; customerName?: string }>;
  orders: Workshop2B2bOrderRecord[];
  env?: Record<string, string | undefined>;
}): Workshop2B2bCreditScoreRow[] {
  return input.territories.map((t) => {
    const account: Workshop2B2bCreditAccount = {
      territoryId: t.territoryId,
      creditLimitRub: t.creditLimitRub,
      openOrdersRub: t.openOrdersRub,
      customerName: t.customerName ?? t.labelRu,
    };
    const territoryOrders = ordersForTerritory(t.territoryId, account.customerName, input.orders);
    const computed = computeWorkshop2B2bCreditScore({
      account,
      territoryOrders,
      env: input.env,
    });
    return {
      buyerName: account.customerName ?? t.territoryId,
      territoryId: t.territoryId,
      territoryLabelRu: t.labelRu ?? t.territoryId,
      score: computed.score,
      onHold: computed.onHold,
      suggestedLimitRub: computed.suggestedLimitRub,
      openOrdersRub: t.openOrdersRub,
      creditLimitRub: t.creditLimitRub,
      hintRu: computed.hintRu,
    };
  });
}
