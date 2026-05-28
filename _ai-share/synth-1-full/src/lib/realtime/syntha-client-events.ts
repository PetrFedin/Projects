/**
 * Имена и типы detail для window CustomEvent — B2B/process live refresh.
 * Слушатели в клиентских виджетах подписываются на эти строки.
 */

export const SYNTHA_B2B_FINANCE_REFRESH = 'syntha:b2b-finance-refresh';
export const SYNTHA_B2B_INTEGRATIONS_REFRESH = 'syntha:b2b-integrations-refresh';
export const SYNTHA_PROCESS_REFRESH = 'syntha:process-refresh';

export type B2BFinanceRefreshDetail = {
  orderId: string;
};

export type ProcessRefreshDetail = {
  processId: string;
  contextId?: string;
  kind: 'runtime' | 'definition';
  version?: number;
};
