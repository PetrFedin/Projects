/**
 * Offline / MVP mock payloads when FastAPI is disabled or unreachable.
 * Держим отдельно от fastapi-service — короче диффы и меньше контекста у агентов.
 *
 * Регрессия: при смене контракта Hub API обновляйте соответствующий ключ здесь и тип ответа
 * в `fastapi-service` / клиентских хуках (минимум — те же поля верхнего уровня, что ждёт UI).
 */

export const MOCK_FALLBACKS: Record<string, unknown> = {
  '/dashboard': {
    data: {
      kpis: {
        my_orders: 12,
        my_total_spent: 4_200_000,
        accessible_showrooms: 8,
        fill_rate: 94,
        low_stock_skus: 7,
        health_score: 92,
      },
      _source: 'demo',
    },
  },
  '/analytics/feedback': [
    {
      id: 'f1',
      customer_id: 'Александра В.',
      rating: 10,
      comment: 'Прекрасное качество материалов!',
      created_at: new Date().toISOString(),
      tags_json: { Качество: 'High' },
    },
    {
      id: 'f2',
      customer_id: 'Дмитрий К.',
      rating: 8,
      comment: 'Доставка немного задержалась, но платье супер.',
      created_at: new Date().toISOString(),
      tags_json: { Доставка: 'Late' },
    },
  ],
  '/analytics/nps': { nps_score: 72.5 },
  '/profile/me': { id: 'u1', name: 'Petr', role: 'admin', brand_id: 'syntha-1' },
  '/product': [
    {
      id: '1',
      name: 'Кашемировый свитер',
      sku: 'SYN-001',
      collection: 'SS26 Main',
      status: 'published',
    },
    {
      id: '2',
      name: 'Тренч классический',
      sku: 'SYN-002',
      collection: 'SS26 Main',
      status: 'published',
    },
    {
      id: '3',
      name: 'Шелковое платье-миди',
      sku: 'SYN-003',
      collection: 'SS26 Pre-collection',
      status: 'draft',
    },
  ],
  '/orders': [
    {
      id: 'ORD-4521',
      retailer: 'TSUM',
      total: 1250000,
      status: 'in_production',
      created_at: '2026-03-08',
    },
    {
      id: 'ORD-4522',
      retailer: 'Lamoda',
      total: 890000,
      status: 'pending',
      created_at: '2026-03-10',
    },
    {
      id: 'ORD-4523',
      retailer: 'ЦУМ Online',
      total: 2100000,
      status: 'shipped',
      created_at: '2026-03-01',
    },
  ],
  '/wholesale/linesheets': [
    {
      id: 1,
      name: 'SS26 Main',
      status: 'published',
      collections: ['SS26 Main'],
      updated_at: '2026-03-05',
    },
    {
      id: 2,
      name: 'SS26 Pre-collection',
      status: 'draft',
      collections: ['SS26 Pre-collection'],
      updated_at: '2026-03-10',
    },
  ],
  '/dam': [
    { id: 1, name: 'SS26 Lookbook.pdf', type: 'document', size: '12 MB', updated_at: '2026-03-10' },
    { id: 2, name: 'SYN-001_hero.jpg', type: 'image', size: '2.1 MB', updated_at: '2026-03-09' },
    { id: 3, name: 'Campaign FW25', type: 'folder', items: 8, updated_at: '2026-03-08' },
  ],
  '/showrooms': [
    {
      id: 1,
      name: 'SS26 Digital Showroom',
      status: 'active',
      visitors: 47,
      last_active: '2026-03-11',
    },
    { id: 2, name: 'FW25 Archive', status: 'archived', visitors: 0, last_active: '2025-11-20' },
  ],
  '/collaboration/projects': [
    {
      id: 'cp1',
      project_name: 'Syntha x Nordic Wool',
      partner_brand_id: 'Nordic Wool',
      status: 'active',
      description: 'Совместная капсула верхней одежды FW26',
    },
    {
      id: 'cp2',
      project_name: 'Eco-Textile Research',
      partner_brand_id: 'GreenFabric Corp',
      status: 'pending',
      description: 'Исследование перерабатываемых мембран',
    },
  ],
  '/academy/leaderboard': [
    { rank: 1, name: 'Анна К.', score: 2450, role: 'Менеджер' },
    { rank: 2, name: 'Петр В.', score: 2180, role: 'Продавец' },
    { rank: 3, name: 'Мария С.', score: 1950, role: 'Стилист' },
  ],
  '/academy/modules': [
    { id: 'm1', name: 'Продуктовая линейка Syntha', completed: true },
    { id: 'm2', name: 'B2B процесс заказа', completed: true },
    { id: 'm3', name: 'Клиентелинг 2.0', completed: false },
  ],
  '/fintech/budgets': { total_budget: 15000000, allocated: 8500000, remaining: 6500000 },
  '/supply-chain/reservations': [
    {
      id: 'r1',
      material: 'Кашемир итал.',
      qty: 500,
      unit: 'м',
      status: 'confirmed',
      supplier: 'ТД «Итал-текс»',
    },
    {
      id: 'r2',
      material: 'Пуговицы перламутр',
      qty: 2000,
      unit: 'шт',
      status: 'pending',
      supplier: 'YKK',
    },
  ],
  '/marketing-crm/items': [
    {
      id: 'm1',
      influencer: 'Мария Style',
      sku: 'SYN-001',
      sent_at: '2026-03-05',
      status: 'delivered',
    },
    {
      id: 'm2',
      influencer: 'Fashion Blog',
      sku: 'SYN-002',
      sent_at: '2026-03-08',
      status: 'pending_return',
    },
  ],
  '/marketing-crm/pr-samples': [
    {
      id: 'pr1',
      sku: 'SYN-001',
      recipient: 'Мария Style',
      sent_at: '2026-03-05',
      return_status: 'kept',
    },
    {
      id: 'pr2',
      sku: 'SYN-002',
      recipient: 'Fashion Blog',
      sent_at: '2026-03-08',
      return_status: 'pending',
    },
  ],
  '/brand/profile/': {
    brand: { name: 'Syntha', id: 'syntha-1' },
    legal: { inn: '7707123456' },
    contacts: {},
    dna: {},
    certificates: [],
  },
  '/brand/dashboard/': {
    _source: 'demo',
    retailersCount: 24,
    participantsCount: 24,
    onlineCount: 8,
    teamMembersCount: 24,
    membersCount: 24,
    membersOnline: 8,
    openB2bOrders: 7,
    certsActive: 1,
    poInProduction: 4,
    collectionsCount: 12,
    markingSyncStatus: 'ok',
    markingLastSync: '09:12',
    documentsPendingSignature: 2,
    inventorySyncFailed30d: 0,
    inventorySyncLastSuccessAt: null,
    attentionAlerts: {
      certificates: [],
      profile: [],
      tasks: [],
      integrationIssues: [],
    },
  },
  '/brand/integrations/status/': {
    c1c: { status: 'ok' },
    cdek: { status: 'ok' },
    ozon: { status: 'error' },
    znak: { status: 'ok' },
  },
  '/organization/health/': null,
  '/brand/attention-dismiss/': {
    data: {
      v: 1 as const,
      certificateIds: [] as string[],
      profileIds: [] as string[],
      taskIds: [] as string[],
      integrationIssueIds: [] as string[],
    },
  },
  '/collections/drops': [
    {
      id: 1,
      drop_name: 'SS26 Main',
      season: 'SS26',
      status: 'active',
      scheduled_date: '2026-03-15',
    },
    {
      id: 2,
      drop_name: 'SS26 Pre-collection',
      season: 'SS26',
      status: 'active',
      scheduled_date: '2026-02-28',
    },
  ],
  '/disputes': [
    {
      id: 'DISP-1',
      caseNumber: 'SYNTH-8821',
      title: 'Batch Q3-101: Quality Defects',
      status: 'under_review',
      severity: 'high',
    },
  ],
  '/audit': [
    {
      id: 'a1',
      action: 'CREATE_SKU',
      user: 'Admin',
      timestamp: new Date().toISOString(),
      details: 'Создан новый артикул SYN-001',
    },
    {
      id: 'a2',
      action: 'UPDATE_STATUS',
      user: 'System',
      timestamp: new Date().toISOString(),
      details: 'Статус заказа ORD-123 изменен на "В производстве"',
    },
  ],
};

export function getMockFallback(endpoint: string): unknown | null {
  if (MOCK_FALLBACKS[endpoint] !== undefined) return MOCK_FALLBACKS[endpoint];
  const prefix = Object.keys(MOCK_FALLBACKS).find((p) => endpoint.startsWith(p));
  if (prefix) return MOCK_FALLBACKS[prefix];
  return null;
}
