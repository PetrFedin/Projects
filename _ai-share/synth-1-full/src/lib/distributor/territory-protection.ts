/**
 * Territory Protection Logic — блокировка заказов от магазинов вне эксклюзивного региона.
 * Связи: B2B заказы, партнёры, квоты. Инфра под API.
 */

export type TerritoryRuleAction = 'allow' | 'block' | 'warning';

export interface TerritoryRule {
  id: string;
  distributorId: string;
  /** Регионы (коды или названия: ЦФО, СЗФО, Москва и т.д.) */
  regions: string[];
  /** Действие при заказе из другого региона */
  action: TerritoryRuleAction;
  /** Исключения: retailerId или список разрешённых */
  exceptionRetailerIds?: string[];
  updatedAt: string;
}

export interface TerritoryCheckResult {
  allowed: boolean;
  ruleId?: string;
  message?: string;
}

export const TERRITORY_PROTECTION_API = {
  listRules: '/api/v1/distributor/territory/rules',
  getRule: '/api/v1/distributor/territory/rules/:id',
  upsertRule: '/api/v1/distributor/territory/rules',
  checkOrder: '/api/v1/distributor/territory/check',
} as const;

/** Список правил по территориям. При API — GET TERRITORY_PROTECTION_API.listRules */
export async function listRules(): Promise<TerritoryRule[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = new Date().toISOString();
  return [
    { id: 'tr1', distributorId: 'D01', regions: ['Москва', 'МО', 'ЦФО'], action: 'allow', updatedAt: now },
    { id: 'tr2', distributorId: 'D02', regions: ['СПб', 'ЛО', 'СЗФО'], action: 'block', updatedAt: now },
    { id: 'tr3', distributorId: 'D03', regions: ['ЮФО'], action: 'warning', updatedAt: now },
  ];
}
