/**
 * API service for communicating with the FastAPI backend.
 */

import { USE_FASTAPI } from '@/lib/syntha-api-mode';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');

let apiErrorTimer: number | null = null;
let isApiReachable = true;

const MAX_RETRIES = 2;

async function fetchFromApi(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
  if (!USE_FASTAPI) {
    const fallback = getMockFallback(endpoint);
    if (fallback !== null) return fallback;
    return { data: null };
  }

  // Token economy: Don't keep hammering the API if we know it's down
  if (!isApiReachable && retryCount === 0) {
    const fallback = getMockFallback(endpoint);
    if (fallback !== null) return fallback;
    throw new Error('API Offline (cached)');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
    isApiReachable = true;
  } catch (err: any) {
    // Token economy & silent mode: don't spam console if backend is not started
    if ((err?.message === 'Failed to fetch' || err?.name === 'TypeError') && retryCount < MAX_RETRIES) {
      isApiReachable = false;
      if (!apiErrorTimer && typeof window !== 'undefined') {
        apiErrorTimer = window.setTimeout(() => {
          isApiReachable = true;
          apiErrorTimer = null;
        }, 10000) as unknown as number;
      }
      console.warn(`[API Offline] ${endpoint}: Backend not reachable. Retry ${retryCount + 1}/${MAX_RETRIES}.`);
      await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
      return fetchFromApi(endpoint, options, retryCount + 1);
    }
    const fallback = getMockFallback(endpoint);
    if (fallback !== null) return fallback;
    const hint =
      'Проверьте, что API запущен, или отключите NEXT_PUBLIC_USE_FASTAPI в .env.local для чистого MVP.';
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[API] ${endpoint}:`, err?.message || err, hint);
    }
    throw new Error(`API недоступен (${endpoint}). ${hint}`);
  }

  if (response.status === 401 && retryCount === 0 && typeof window !== 'undefined') {
    // If unauthorized, wait a bit and retry once - might be a race condition during auto-login
    await new Promise(resolve => setTimeout(resolve, 500));
    return fetchFromApi(endpoint, options, 1);
  }

  if (!response.ok) {
    const fallback = getMockFallback(endpoint);
    if (fallback !== null) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[API] ${endpoint} returned ${response.status}, using mock fallback`);
      }
      return fallback;
    }
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    const detail = error?.detail;
    const msg = typeof detail === 'string' ? detail : (detail && typeof detail === 'object' ? JSON.stringify(detail) : `API error: ${response.status}`);
    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
      return fetchFromApi(endpoint, options, retryCount + 1);
    }
    try {
      const { logApiError } = await import('@/lib/logger');
      logApiError(endpoint, response.status, msg);
    } catch (_) {}
    throw new Error(msg);
  }

  return response.json();
}

/**
 * Mock data fallbacks for when the API is offline.
 * This saves "developer tokens" and keeps the UI functional.
 */
const MOCK_FALLBACKS: Record<string, any> = {
  '/dashboard': {
    data: {
      kpis: {
        revenue: 388000000,
        operations: 94.2,
        total_orders: 842,
        active_showrooms: 128,
        margin: 42,
        stock_health: 65
      }
    }
  },
  '/analytics/feedback': [
    { id: 'f1', customer_id: 'Александра В.', rating: 10, comment: 'Прекрасное качество материалов!', created_at: new Date().toISOString(), tags_json: { 'Качество': 'High' } },
    { id: 'f2', customer_id: 'Дмитрий К.', rating: 8, comment: 'Доставка немного задержалась, но платье супер.', created_at: new Date().toISOString(), tags_json: { 'Доставка': 'Late' } }
  ],
  '/analytics/nps': { nps_score: 72.5 },
  '/profile/me': { id: 'u1', name: 'Petr', role: 'admin', brand_id: 'syntha-1' },
  '/product': [
    { id: '1', name: 'Кашемировый свитер', sku: 'SYN-001', collection: 'SS26 Main', status: 'published' },
    { id: '2', name: 'Тренч классический', sku: 'SYN-002', collection: 'SS26 Main', status: 'published' },
    { id: '3', name: 'Шелковое платье-миди', sku: 'SYN-003', collection: 'SS26 Pre-collection', status: 'draft' },
  ],
  '/orders': [
    { id: 'ORD-4521', retailer: 'TSUM', total: 1250000, status: 'in_production', created_at: '2026-03-08' },
    { id: 'ORD-4522', retailer: 'Lamoda', total: 890000, status: 'pending', created_at: '2026-03-10' },
    { id: 'ORD-4523', retailer: 'ЦУМ Online', total: 2100000, status: 'shipped', created_at: '2026-03-01' },
  ],
  '/wholesale/linesheets': [
    { id: 1, name: 'SS26 Main', status: 'published', collections: ['SS26 Main'], updated_at: '2026-03-05' },
    { id: 2, name: 'SS26 Pre-collection', status: 'draft', collections: ['SS26 Pre-collection'], updated_at: '2026-03-10' },
  ],
  '/dam': [
    { id: 1, name: 'SS26 Lookbook.pdf', type: 'document', size: '12 MB', updated_at: '2026-03-10' },
    { id: 2, name: 'SYN-001_hero.jpg', type: 'image', size: '2.1 MB', updated_at: '2026-03-09' },
    { id: 3, name: 'Campaign FW25', type: 'folder', items: 8, updated_at: '2026-03-08' },
  ],
  '/showrooms': [
    { id: 1, name: 'SS26 Digital Showroom', status: 'active', visitors: 47, last_active: '2026-03-11' },
    { id: 2, name: 'FW25 Archive', status: 'archived', visitors: 0, last_active: '2025-11-20' },
  ],
  '/collaboration/projects': [
    { id: 'cp1', project_name: 'Syntha x Nordic Wool', partner_brand_id: 'Nordic Wool', status: 'active', description: 'Совместная капсула верхней одежды FW26' },
    { id: 'cp2', project_name: 'Eco-Textile Research', partner_brand_id: 'GreenFabric Corp', status: 'pending', description: 'Исследование перерабатываемых мембран' }
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
    { id: 'r1', material: 'Кашемир итал.', qty: 500, unit: 'м', status: 'confirmed', supplier: 'Loro Piana' },
    { id: 'r2', material: 'Пуговицы перламутр', qty: 2000, unit: 'шт', status: 'pending', supplier: 'YKK' },
  ],
  '/marketing-crm/items': [
    { id: 'm1', influencer: 'Мария Style', sku: 'SYN-001', sent_at: '2026-03-05', status: 'delivered' },
    { id: 'm2', influencer: 'Fashion Blog', sku: 'SYN-002', sent_at: '2026-03-08', status: 'pending_return' },
  ],
  '/marketing-crm/pr-samples': [
    { id: 'pr1', sku: 'SYN-001', recipient: 'Мария Style', sent_at: '2026-03-05', return_status: 'kept' },
    { id: 'pr2', sku: 'SYN-002', recipient: 'Fashion Blog', sent_at: '2026-03-08', return_status: 'pending' },
  ],
  '/brand/profile/': { brand: { name: 'Syntha', id: 'syntha-1' }, legal: { inn: '7707123456' }, contacts: {}, dna: {}, certificates: [] },
  '/brand/dashboard/': { retailersCount: 24, openB2bOrders: 7, certsActive: 1, poInProduction: 4, collectionsCount: 12, markingSyncStatus: 'ok', markingLastSync: '09:12' },
  '/brand/integrations/status/': { c1c: { status: 'ok' }, cdek: { status: 'ok' }, ozon: { status: 'error' }, znak: { status: 'ok' } },
  '/organization/health/': null,
  '/collections/drops': [{ id: 1, drop_name: 'SS26 Main', season: 'SS26', status: 'active', scheduled_date: '2026-03-15' }, { id: 2, drop_name: 'SS26 Pre-collection', season: 'SS26', status: 'active', scheduled_date: '2026-02-28' }],
  '/disputes': [{ id: 'DISP-1', caseNumber: 'SYNTH-8821', title: 'Batch Q3-101: Quality Defects', status: 'under_review', severity: 'high' }],
  '/audit': [
    { id: 'a1', action: 'CREATE_SKU', user: 'Admin', timestamp: new Date().toISOString(), details: 'Создан новый артикул SYN-001' },
    { id: 'a2', action: 'UPDATE_STATUS', user: 'System', timestamp: new Date().toISOString(), details: 'Статус заказа ORD-123 изменен на "В производстве"' }
  ],
};

function getMockFallback(endpoint: string) {
  // Try exact match
  if (MOCK_FALLBACKS[endpoint]) return MOCK_FALLBACKS[endpoint];
  
  // Try prefix match (e.g. /analytics/feedback/brand-1)
  const prefix = Object.keys(MOCK_FALLBACKS).find(p => endpoint.startsWith(p));
  if (prefix) return MOCK_FALLBACKS[prefix];
  
  return null;
}

export const fastApiService = {
  // Product & Fit Review
  getFitCorrections: (skuId: string) => fetchFromApi(`/product/fit-corrections/${skuId}`).catch(() => []),
  createFitCorrection: (data: any) => fetchFromApi('/product/fit-corrections', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Fintech & Budgets
  getBudgets: (brandId: string, season?: string) => {
    const url = `/fintech/budgets/${brandId}${season ? `?season=${season}` : ''}`;
    return fetchFromApi(url);
  },
  createBudget: (data: any) => fetchFromApi('/fintech/budgets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Marketing & Influencers
  getInfluencerItems: (influencerId: number) => fetchFromApi(`/marketing-crm/items/${influencerId}`),
  trackInfluencerItem: (data: any) => fetchFromApi('/marketing-crm/items', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getPrSamples: (skuId: string) => fetchFromApi(`/marketing-crm/pr-samples/${skuId}`),
  reportPrSample: (data: any) => fetchFromApi('/marketing-crm/pr-samples', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Academy & Gamification
  getLeaderboard: (brand_id: string) => fetchFromApi(`/academy/leaderboard/${brand_id}`),
  updateLeaderboard: (data: any) => fetchFromApi('/academy/leaderboard', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getModules: (brand_id?: string) => {
    const url = `/academy/modules${brand_id ? `?brand_id=${brand_id}` : ''}`;
    return fetchFromApi(url);
  },

  // Collaboration
  getCollaborationProjects: (brand_id: string) => fetchFromApi(`/collaboration/projects/${brand_id}`),
  createCollaborationProject: (data: any) => fetchFromApi('/collaboration/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Audit Trail
  getAuditTrail: (entityType: string, entityId: string) => fetchFromApi(`/audit/${entityType}/${entityId}`),
  createAuditEntry: (data: any) => fetchFromApi('/audit', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Feedback
  getFeedback: (brandId: string) => fetchFromApi(`/analytics/feedback/${brandId}`),
  getNps: (brandId: string) => fetchFromApi(`/analytics/nps/${brandId}`),
  submitFeedback: (data: any) => fetchFromApi('/analytics/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Inventory Reservations
  getReservations: (brandId: string) => fetchFromApi(`/supply-chain/reservations/${brandId}`),
  createReservation: (data: any) => fetchFromApi('/supply-chain/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Wholesale & Orders
  getOrders: () => fetchFromApi('/orders'),
  createOrder: (data: any) => fetchFromApi('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  validateOrder: (orderId: number) => fetchFromApi(`/orders/${orderId}/validate`, { method: 'POST' }),
  getLinesheets: () => fetchFromApi('/wholesale/linesheets'),
  generateLinesheetPdf: (id: number) => fetchFromApi(`/wholesale/linesheets/${id}/generate`, { method: 'POST' }),

  // DAM & Assets
  getMediaAssets: () => fetchFromApi('/dam'),
  processMediaAsset: (id: number, type: string) => fetchFromApi(`/dam/${id}/process`, {
    method: 'POST',
    body: JSON.stringify({ process_type: type }),
  }),

  // Showrooms
  getShowrooms: () => fetchFromApi('/showrooms'),
  createShowroom: (data: any) => fetchFromApi('/showrooms', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Profile & Navigation
  getProfile: () => fetchFromApi('/profile/me'),
  getDashboardKpis: () => fetchFromApi('/dashboard'),
  
  // Products (PIM)
  getProducts: () => fetchFromApi('/product').catch(() => []),
  createProduct: (data: any) => fetchFromApi('/product', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Brand Profile & Dashboard
  getBrandProfile: (brandId: string) => fetchFromApi(`/brand/profile/${brandId}`),
  getBrandDashboard: (brandId: string) => fetchFromApi(`/brand/dashboard/${brandId}`),
  getIntegrationsStatus: (brandId: string) => fetchFromApi(`/brand/integrations/status/${brandId}`),
  getOrganizationHealth: (brandId: string) => fetchFromApi(`/organization/health/${brandId}`).catch(() => null),
  retryIntegration: (brandId: string, provider: string) =>
    fetchFromApi(`/brand/integrations/${brandId}/retry`, {
      method: 'POST',
      body: JSON.stringify({ provider }),
    }),
};
