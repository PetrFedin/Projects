/**
 * Demo Data Layer — данные для презентации инвесторам.
 *
 * Когда бэкенд будет готов:
 * 1. fastapi-service.ts — заменить getMockFallback на реальные fetch вызовы
 * 2. collections-api.ts — при USE_FASTAPI=true ходит в API, иначе только DEMO_DROPS
 * 3. Использовать env NEXT_PUBLIC_USE_REAL_API=true для переключения
 */

export const DEMO_DROPS = [
  { id: 1, drop_name: 'SS26 Main', season: 'SS26', status: 'active', scheduled_date: '2026-03-15' },
  {
    id: 2,
    drop_name: 'SS26 Pre-collection',
    season: 'SS26',
    status: 'active',
    scheduled_date: '2026-02-28',
  },
  {
    id: 3,
    drop_name: 'FW25 Core',
    season: 'FW25',
    status: 'completed',
    scheduled_date: '2025-09-01',
  },
];

export const DEMO_ORG = {
  id: 'syntha-1',
  name: 'Syntha Lab',
  legal: { inn: '7707123456', kpp: '770701001', address: 'Москва, ул. Тверская, 1' },
  contacts: { email: 'brand@syntha.ru', phone: '+7 (495) 123-45-67' },
  subscription: { plan: 'Business', expires: '2026-12-31', users: 15 },
};

export const DEMO_INTEGRATIONS = {
  c1c: { status: 'ok' as const, lastSync: '2026-03-11T10:00:00Z', name: '1С:Предприятие' },
  cdek: { status: 'ok' as const, lastSync: '2026-03-11T09:45:00Z', name: 'СДЭК' },
  ozon: {
    status: 'error' as const,
    lastSync: null,
    name: 'Ozon Seller',
    error: 'Требуется обновление токена',
  },
  znak: { status: 'ok' as const, lastSync: '2026-03-11T09:12:00Z', name: 'Честный ЗНАК' },
};

export const DEMO_ORDER_IDS = ['ORD-4521', 'ORD-4522', 'ORD-4523'];
export const DEMO_PO_IDS = ['PO-101', 'PO-102', 'PO-103'];
export const DEMO_COLLECTION_IDS = ['SS26-Main', 'SS26-Pre', 'FW25-Core'];

export const DEMO_ORGANIZATION_METRICS = {
  teamMembers: 24,
  activeIntegrations: 3,
  documentsThisMonth: 47,
  auditEventsToday: 12,
};

export const DEMO_INFRASTRUCTURE_STATUS = {
  apiKeys: 2,
  webhooks: 3,
  lastDeploy: '2026-03-10T14:00:00Z',
  uptime: 99.9,
};

export const DEMO_COMPLIANCE_ITEMS = [
  { id: 'edo-1', type: 'УПД', status: 'Синхронизирован', date: '2026-03-11', count: 24 },
  { id: 'edo-2', type: 'УКД', status: 'Синхронизирован', date: '2026-03-10', count: 12 },
  { id: 'znak-1', type: 'КИЗ', status: 'Ок', date: '2026-03-11 09:12', count: 156 },
];

export const DEMO_COMMUNICATIONS = {
  unreadMessages: 7,
  upcomingEvents: 5,
  tasksDueToday: 3,
  lastActivity: '2026-03-11T14:30:00Z',
};

export const DEMO_ESG_METRICS = {
  score: 'A+',
  co2Reduction: 12,
  recycledMaterials: 34,
  certsCount: 5,
};
