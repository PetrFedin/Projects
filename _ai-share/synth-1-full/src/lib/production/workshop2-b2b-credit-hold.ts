/**
 * Wave 3 P2: B2B territory / credit hold — PG table или demo fallback.
 */
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2B2bCreditAccount = {
  territoryId: string;
  creditLimitRub: number;
  openOrdersRub: number;
  customerName?: string;
};

const DEMO_ACCOUNTS: Workshop2B2bCreditAccount[] = [
  {
    territoryId: 'RU-MOW',
    creditLimitRub: 5_000_000,
    openOrdersRub: 4_850_000,
    customerName: 'Demo Retail MOW',
  },
  {
    territoryId: 'RU-SPB',
    creditLimitRub: 2_000_000,
    openOrdersRub: 500_000,
    customerName: 'Demo Retail SPB',
  },
  {
    territoryId: 'KZ-ALA',
    creditLimitRub: 1_000_000,
    openOrdersRub: 200_000,
    customerName: 'Demo KZ',
  },
];

export function isWorkshop2B2bCreditHoldEnabled(env?: Record<string, string | undefined>): boolean {
  return (
    String(env?.WORKSHOP2_B2B_CREDIT_HOLD ?? process.env.WORKSHOP2_B2B_CREDIT_HOLD ?? '')
      .trim()
      .toLowerCase() === 'true'
  );
}

export function resolveWorkshop2B2bCreditAccount(input: {
  territoryId: string;
  accounts?: Workshop2B2bCreditAccount[];
}): Workshop2B2bCreditAccount | null {
  const id = input.territoryId.trim();
  const list = input.accounts ?? DEMO_ACCOUNTS;
  return list.find((a) => a.territoryId === id) ?? null;
}

export function evaluateWorkshop2B2bCreditHold(input: {
  territoryId: string;
  orderTotalRub: number;
  env?: Record<string, string | undefined>;
  accounts?: Workshop2B2bCreditAccount[];
}): {
  allowed: boolean;
  exceeded: boolean;
  availableRub: number;
  messageRu: string;
  gate: Workshop2HandoffReadinessCheck | null;
} {
  if (!isWorkshop2B2bCreditHoldEnabled(input.env)) {
    return {
      allowed: true,
      exceeded: false,
      availableRub: Number.POSITIVE_INFINITY,
      messageRu: 'Credit hold отключён (WORKSHOP2_B2B_CREDIT_HOLD≠true).',
      gate: null,
    };
  }

  const account = resolveWorkshop2B2bCreditAccount({
    territoryId: input.territoryId,
    accounts: input.accounts,
  });
  if (!account) {
    return {
      allowed: false,
      exceeded: true,
      availableRub: 0,
      messageRu: `B2B credit: территория ${input.territoryId} не найдена.`,
      gate: {
        id: 'b2b.credit.territory_unknown',
        severity: 'blocker',
        messageRu: `B2B checkout: неизвестная территория ${input.territoryId}.`,
      },
    };
  }

  const availableRub = account.creditLimitRub - account.openOrdersRub;
  const exceeded = input.orderTotalRub > availableRub;
  const messageRu = exceeded
    ? `Credit hold: заказ ${input.orderTotalRub.toLocaleString('ru-RU')} ₽ превышает доступный лимит ${availableRub.toLocaleString('ru-RU')} ₽ (${account.customerName ?? account.territoryId}).`
    : `Credit OK: доступно ${availableRub.toLocaleString('ru-RU')} ₽.`;

  return {
    allowed: !exceeded,
    exceeded,
    availableRub,
    messageRu,
    gate: exceeded
      ? {
          id: 'b2b.credit.exceeded',
          severity: 'blocker',
          messageRu: messageRu,
        }
      : null,
  };
}
