/**
 * API-слой BNPL Gateway по контракту BNPL_GATEWAY_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import type { BnplTransaction } from '@/lib/shop/bnpl-gateway';

const LIST_TRANSACTIONS_PATH = '/api/v1/shop/bnpl/transactions';

const MOCK_TX: BnplTransaction[] = [
  {
    id: 'tx1',
    orderId: 'ORD-8010',
    provider: 'tinkoff',
    amountRub: 45000,
    status: 'approved',
    createdAt: '2026-03-11T09:00:00Z',
    externalId: 'TINK-123',
  },
  {
    id: 'tx2',
    orderId: 'ORD-8011',
    provider: 'sber',
    amountRub: 28000,
    status: 'pending',
    createdAt: '2026-03-11T10:15:00Z',
  },
];

export async function listTransactions(): Promise<BnplTransaction[]> {
  try {
    return await get<BnplTransaction[]>(LIST_TRANSACTIONS_PATH);
  } catch {
    return MOCK_TX;
  }
}
