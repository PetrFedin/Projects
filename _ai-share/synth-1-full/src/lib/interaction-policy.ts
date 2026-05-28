import { UserRole } from './types';

/**
 * Interaction Matrix: Defines which roles can interact with each other.
 * Key: Requester Role
 * Value: Array of roles they are ALLOWED to interact with.
 */
export const INTERACTION_POLICY: Record<UserRole, UserRole[]> = {
  admin: ['admin', 'brand', 'shop', 'distributor', 'supplier', 'manufacturer', 'client', 'b2b'],
  brand: ['supplier', 'manufacturer', 'shop', 'distributor', 'client', 'admin'],
  shop: ['distributor', 'brand', 'client', 'admin'],
  distributor: ['shop', 'brand', 'admin'],
  manufacturer: ['supplier', 'brand', 'admin'],
  supplier: ['manufacturer', 'brand', 'admin'],
  client: ['shop', 'brand', 'admin'],
  b2b: ['brand', 'shop', 'admin'], // Default generic B2B role
};

/**
 * Process Map Flows: Defines which roles participate in specific business processes.
 */
export interface ProcessFlow {
  id: string;
  name: string;
  participants: UserRole[];
  description: string;
}

export const PROCESS_FLOWS: ProcessFlow[] = [
  {
    id: 'product_development',
    name: 'Разработка продукта (PLM/3D)',
    participants: ['brand', 'manufacturer', 'admin'],
    description: 'Создание техзаданий, 3D-моделирование и согласование эталонов.',
  },
  {
    id: 'sourcing_procurement',
    name: 'Сорсинг и Закупки',
    participants: ['brand', 'supplier', 'manufacturer', 'admin'],
    description: 'Тендеры на сырье, закупка материалов и контроль поставок на фабрику.',
  },
  {
    id: 'production_cycle',
    name: 'Производственный цикл',
    participants: ['manufacturer', 'brand', 'admin'],
    description: 'Раскрой, пошив, межоперационный контроль и отчетность.',
  },
  {
    id: 'quality_assurance',
    name: 'Контроль качества (ОТК)',
    participants: ['manufacturer', 'brand', 'admin'],
    description: 'Финальная проверка, создание протоколов ОТК и работа с претензиями.',
  },
  {
    id: 'logistics_distribution',
    name: 'Логистика и Дистрибуция',
    participants: ['manufacturer', 'distributor', 'brand', 'shop', 'admin'],
    description: 'Упаковка, маркировка, отгрузка и доставка до точек продаж.',
  },
  {
    id: 'wholesale_sales',
    name: 'Оптовые продажи',
    participants: ['brand', 'shop', 'distributor', 'admin'],
    description: 'Оформление оптовых заказов, смарт-контракты и взаиморасчеты.',
  },
  {
    id: 'retail_customer',
    name: 'Ритейл и Клиентский опыт',
    participants: ['shop', 'brand', 'client', 'admin'],
    description: 'Продажи конечным покупателям, программы лояльности и возвраты.',
  },
];

/**
 * Helper to get available processes for a role
 */
export function getAvailableFlows(role: UserRole): ProcessFlow[] {
  if (role === 'admin') return PROCESS_FLOWS;
  return PROCESS_FLOWS.filter((flow) => flow.participants.includes(role));
}

/**
 * Helper to check if two roles share any business process
 */
export function shareProcess(roleA: UserRole, roleB: UserRole): boolean {
  if (roleA === 'admin' || roleB === 'admin') return true;
  return PROCESS_FLOWS.some(
    (flow) => flow.participants.includes(roleA) && flow.participants.includes(roleB)
  );
}

/**
 * Helper to check if a requester role can interact with a target role
 */
/** Chat/context types that extend UserRole (подкатегории для бренда) */
const BRAND_CONTEXT_TYPES = ['production', 'b2b_orders', 'collections'] as const;

/** Академия: чаты курса (куратор / группа) доступны ученикам и представителям бренда */
const ACADEMY_CONTEXT_TYPES = ['academy'] as const;

export function canInteract(requester: UserRole, target: UserRole | string): boolean {
  if (requester === 'admin') return true;
  if (BRAND_CONTEXT_TYPES.includes(target as any) && requester === 'brand') return true;
  if (
    ACADEMY_CONTEXT_TYPES.includes(target as any) &&
    (requester === 'shop' || requester === 'brand' || requester === 'client' || requester === 'b2b')
  ) {
    return true;
  }
  return INTERACTION_POLICY[requester]?.includes(target as UserRole) || false;
}
