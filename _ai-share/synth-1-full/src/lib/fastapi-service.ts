/**
 * API service for communicating with the FastAPI backend.
 */

import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { getMockFallback } from '@/lib/api/mock-fallbacks';
import { getUnknownErrorMessage, getUnknownErrorName } from '@/lib/unknown-error-message';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  ''
);

let apiErrorTimer: number | null = null;
let isApiReachable = true;

const MAX_RETRIES = 2;

async function fetchFromApi(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<any> {
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
  } catch (err: unknown) {
    // Token economy & silent mode: don't spam console if backend is not started
    if (
      (getUnknownErrorMessage(err, '') === 'Failed to fetch' ||
        getUnknownErrorName(err) === 'TypeError') &&
      retryCount < MAX_RETRIES
    ) {
      isApiReachable = false;
      if (!apiErrorTimer && typeof window !== 'undefined') {
        apiErrorTimer = window.setTimeout(() => {
          isApiReachable = true;
          apiErrorTimer = null;
        }, 10000) as unknown as number;
      }
      console.warn(
        `[API Offline] ${endpoint}: Backend not reachable. Retry ${retryCount + 1}/${MAX_RETRIES}.`
      );
      await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
      return fetchFromApi(endpoint, options, retryCount + 1);
    }
    const fallback = getMockFallback(endpoint);
    if (fallback !== null) return fallback;
    const hint =
      'Проверьте, что API запущен, или отключите NEXT_PUBLIC_USE_FASTAPI в .env.local для чистого MVP.';
    if (process.env.NODE_ENV === 'development') {
      const detail = getUnknownErrorMessage(err, '');
      console.warn(`[API] ${endpoint}:`, detail || err, hint);
    }
    throw new Error(`API недоступен (${endpoint}). ${hint}`);
  }

  if (response.status === 401 && retryCount === 0 && typeof window !== 'undefined') {
    // If unauthorized, wait a bit and retry once - might be a race condition during auto-login
    await new Promise((resolve) => setTimeout(resolve, 500));
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
    const error = (await response.json().catch(() => ({ detail: 'Unknown error' }))) as {
      detail?: unknown;
    };
    const detail = error.detail;
    const msg =
      typeof detail === 'string'
        ? detail
        : detail && typeof detail === 'object'
          ? JSON.stringify(detail)
          : `API error: ${response.status}`;
    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
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

export const fastApiService = {
  // Product & Fit Review
  getFitCorrections: (skuId: string) =>
    fetchFromApi(`/product/fit-corrections/${skuId}`).catch(() => []),
  createFitCorrection: (data: any) =>
    fetchFromApi('/product/fit-corrections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Fintech & Budgets
  getBudgets: (brandId: string, season?: string) => {
    const url = `/fintech/budgets/${brandId}${season ? `?season=${season}` : ''}`;
    return fetchFromApi(url);
  },
  createBudget: (data: any) =>
    fetchFromApi('/fintech/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Marketing & Influencers
  getInfluencerItems: (influencerId: number) =>
    fetchFromApi(`/marketing-crm/items/${influencerId}`),
  trackInfluencerItem: (data: any) =>
    fetchFromApi('/marketing-crm/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPrSamples: (skuId: string) => fetchFromApi(`/marketing-crm/pr-samples/${skuId}`),
  reportPrSample: (data: any) =>
    fetchFromApi('/marketing-crm/pr-samples', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Academy & Gamification
  getLeaderboard: (brand_id: string) => fetchFromApi(`/academy/leaderboard/${brand_id}`),
  updateLeaderboard: (data: any) =>
    fetchFromApi('/academy/leaderboard', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getModules: (brand_id?: string) => {
    const url = `/academy/modules${brand_id ? `?brand_id=${brand_id}` : ''}`;
    return fetchFromApi(url);
  },

  // Collaboration
  getCollaborationProjects: (brand_id: string) =>
    fetchFromApi(`/collaboration/projects/${brand_id}`),
  createCollaborationProject: (data: any) =>
    fetchFromApi('/collaboration/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Audit Trail
  getAuditTrail: (entityType: string, entityId: string) =>
    fetchFromApi(`/audit/${entityType}/${entityId}`),
  createAuditEntry: (data: any) =>
    fetchFromApi('/audit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Feedback
  getFeedback: (brandId: string) => fetchFromApi(`/analytics/feedback/${brandId}`),
  getNps: (brandId: string) => fetchFromApi(`/analytics/nps/${brandId}`),
  submitFeedback: (data: any) =>
    fetchFromApi('/analytics/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Inventory Reservations
  getReservations: (brandId: string) => fetchFromApi(`/supply-chain/reservations/${brandId}`),
  createReservation: (data: any) =>
    fetchFromApi('/supply-chain/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Wholesale & Orders
  getOrders: () => fetchFromApi('/orders'),
  createOrder: (data: any) =>
    fetchFromApi('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  validateOrder: (orderId: number) =>
    fetchFromApi(`/orders/${orderId}/validate`, { method: 'POST' }),
  getLinesheets: () => fetchFromApi('/wholesale/linesheets'),
  generateLinesheetPdf: (id: number) =>
    fetchFromApi(`/wholesale/linesheets/${id}/generate`, { method: 'POST' }),

  // DAM & Assets
  getMediaAssets: () => fetchFromApi('/dam'),
  processMediaAsset: (id: number, type: string) =>
    fetchFromApi(`/dam/${id}/process`, {
      method: 'POST',
      body: JSON.stringify({ process_type: type }),
    }),

  // Showrooms
  getShowrooms: () => fetchFromApi('/showrooms'),
  createShowroom: (data: any) =>
    fetchFromApi('/showrooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Profile & Navigation
  getProfile: () => fetchFromApi('/profile/me'),
  getDashboardKpis: () => fetchFromApi('/dashboard'),

  // Products (PIM)
  getProducts: () => fetchFromApi('/product').catch(() => []),
  createProduct: (data: any) =>
    fetchFromApi('/product', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Brand Profile & Dashboard
  getBrandProfile: (brandId: string) => fetchFromApi(`/brand/profile/${brandId}`),
  getBrandDashboard: (brandId: string) => fetchFromApi(`/brand/dashboard/${brandId}`),
  getIntegrationsStatus: (brandId: string) => fetchFromApi(`/brand/integrations/status/${brandId}`),
  getAttentionDismiss: (brandId: string) =>
    fetchFromApi(`/brand/attention-dismiss/${brandId}`).catch(() => null),
  patchAttentionDismiss: (
    brandId: string,
    body: Partial<{
      certificateIds: string[];
      profileIds: string[];
      taskIds: string[];
      integrationIssueIds: string[];
    }>
  ) =>
    fetchFromApi(`/brand/attention-dismiss/${brandId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }).catch(() => null),
  getOrganizationHealth: (brandId: string) =>
    fetchFromApi(`/organization/health/${brandId}`).catch(() => null),
  retryIntegration: (brandId: string, provider: string) =>
    fetchFromApi(`/brand/integrations/${brandId}/retry`, {
      method: 'POST',
      body: JSON.stringify({ provider }),
    }),
};
