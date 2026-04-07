/**
 * API-слой Territory Protection по контракту TERRITORY_PROTECTION_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { TERRITORY_PROTECTION_API } from '@/lib/distributor/territory-protection';
import type { TerritoryRule } from '@/lib/distributor/territory-protection';

const MOCK_RULES: TerritoryRule[] = [
  { id: 'r1', distributorId: 'D01', regions: ['ЦФО', 'СЗФО', 'Москва', 'МО'], action: 'allow', updatedAt: '2026-03-01T10:00:00Z' },
  { id: 'r2', distributorId: 'D01', regions: ['СФО', 'УФО'], action: 'block', updatedAt: '2026-03-01T10:00:00Z' },
];

export async function listRules(): Promise<TerritoryRule[]> {
  try {
    return await get<TerritoryRule[]>(TERRITORY_PROTECTION_API.listRules);
  } catch {
    return MOCK_RULES;
  }
}
