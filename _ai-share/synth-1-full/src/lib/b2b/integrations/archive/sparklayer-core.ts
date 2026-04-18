/**
 * SparkLayer Core API: products, customers, orders, quoting, customer rules & discounts.
 * Docs: https://docs.sparklayer.io/sparklayer-api
 * Quoting: https://docs.sparklayer.io/quoting
 * Customers/rules: https://docs.sparklayer.io/customers
 * Discounts: https://docs.sparklayer.io/discounts
 * Использует те же SPARKLAYER_API_URL и SPARKLAYER_ACCESS_TOKEN, что и Pricing API.
 */

import { isSparkLayerConfigured } from './sparklayer-pricing'; // same archive

function getBase(): string {
  if (typeof process === 'undefined') return '';
  return (
    process.env.NEXT_PUBLIC_SPARKLAYER_API_URL ||
    process.env.SPARKLAYER_API_URL ||
    ''
  ).replace(/\/$/, '');
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof process !== 'undefined' ? process.env.SPARKLAYER_ACCESS_TOKEN || '' : '';
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function coreFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getBase();
  if (!base) return [] as T;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options?.headers },
  });
  if (!res.ok) throw new Error(`SparkLayer ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

// —— Core API: Products ——
export interface SparkLayerProduct {
  id: string;
  sku?: string;
  name?: string;
  price?: number;
  currency?: string;
  [key: string]: unknown;
}

export async function sparkLayerGetProducts(params?: {
  limit?: number;
  offset?: number;
}): Promise<SparkLayerProduct[]> {
  if (!isSparkLayerConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params?.limit != null) q.set('limit', String(params.limit));
    if (params?.offset != null) q.set('offset', String(params.offset));
    const url = `/products${q.toString() ? `?${q.toString()}` : ''}`;
    const data = await coreFetch<
      SparkLayerProduct[] | { items?: SparkLayerProduct[]; data?: SparkLayerProduct[] }
    >(url);
    if (Array.isArray(data)) return data;
    return data.items ?? data.data ?? [];
  } catch {
    return [];
  }
}

export async function sparkLayerGetProduct(id: string): Promise<SparkLayerProduct | null> {
  if (!isSparkLayerConfigured()) return null;
  try {
    return await coreFetch<SparkLayerProduct>(`/products/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

// —— Core API: Customers ——
export interface SparkLayerCustomer {
  id: string;
  email?: string;
  name?: string;
  company?: string;
  priceListSlug?: string;
  [key: string]: unknown;
}

export async function sparkLayerGetCustomers(params?: {
  limit?: number;
  offset?: number;
}): Promise<SparkLayerCustomer[]> {
  if (!isSparkLayerConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params?.limit != null) q.set('limit', String(params.limit));
    if (params?.offset != null) q.set('offset', String(params.offset));
    const url = `/customers${q.toString() ? `?${q.toString()}` : ''}`;
    const data = await coreFetch<
      SparkLayerCustomer[] | { items?: SparkLayerCustomer[]; data?: SparkLayerCustomer[] }
    >(url);
    if (Array.isArray(data)) return data;
    return data.items ?? data.data ?? [];
  } catch {
    return [];
  }
}

export async function sparkLayerGetCustomer(id: string): Promise<SparkLayerCustomer | null> {
  if (!isSparkLayerConfigured()) return null;
  try {
    return await coreFetch<SparkLayerCustomer>(`/customers/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

// —— Core API: Orders ——
export interface SparkLayerOrderLine {
  sku: string;
  quantity: number;
  unitPrice?: number;
  [key: string]: unknown;
}

export interface SparkLayerOrder {
  id: string;
  orderNumber?: string;
  status?: string;
  customerId?: string;
  total?: number;
  currency?: string;
  lines?: SparkLayerOrderLine[];
  createdAt?: string;
  [key: string]: unknown;
}

export interface SparkLayerCreateOrderPayload {
  customerId: string;
  lines: SparkLayerOrderLine[];
  priceListSlug?: string;
  [key: string]: unknown;
}

export async function sparkLayerGetOrders(params?: {
  customerId?: string;
  status?: string;
  limit?: number;
}): Promise<SparkLayerOrder[]> {
  if (!isSparkLayerConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params?.customerId) q.set('customerId', params.customerId);
    if (params?.status) q.set('status', params.status);
    if (params?.limit != null) q.set('limit', String(params.limit));
    const url = `/orders${q.toString() ? `?${q.toString()}` : ''}`;
    const data = await coreFetch<
      SparkLayerOrder[] | { items?: SparkLayerOrder[]; data?: SparkLayerOrder[] }
    >(url);
    if (Array.isArray(data)) return data;
    return data.items ?? data.data ?? [];
  } catch {
    return [];
  }
}

export async function sparkLayerCreateOrder(
  payload: SparkLayerCreateOrderPayload
): Promise<{ success: boolean; orderId?: string; order?: SparkLayerOrder; error?: string }> {
  if (!isSparkLayerConfigured()) return { success: false, error: 'SparkLayer not configured' };
  try {
    const order = await coreFetch<SparkLayerOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return { success: true, orderId: order.id, order };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Create order failed' };
  }
}

// —— Quoting ——
export interface SparkLayerQuoteLine {
  sku: string;
  quantity: number;
  unitPrice?: number;
  note?: string;
  [key: string]: unknown;
}

export interface SparkLayerQuote {
  id: string;
  quoteNumber?: string;
  status?: string;
  customerId?: string;
  lines?: SparkLayerQuoteLine[];
  total?: number;
  currency?: string;
  expiresAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface SparkLayerCreateQuotePayload {
  customerId: string;
  lines: SparkLayerQuoteLine[];
  note?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export async function sparkLayerGetQuotes(params?: {
  customerId?: string;
  status?: string;
  limit?: number;
}): Promise<SparkLayerQuote[]> {
  if (!isSparkLayerConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params?.customerId) q.set('customerId', params.customerId);
    if (params?.status) q.set('status', params.status);
    if (params?.limit != null) q.set('limit', String(params.limit));
    const url = `/quotes${q.toString() ? `?${q.toString()}` : ''}`;
    const data = await coreFetch<
      SparkLayerQuote[] | { items?: SparkLayerQuote[]; data?: SparkLayerQuote[] }
    >(url);
    if (Array.isArray(data)) return data;
    return data.items ?? data.data ?? [];
  } catch {
    return [];
  }
}

export async function sparkLayerCreateQuote(
  payload: SparkLayerCreateQuotePayload
): Promise<{ success: boolean; quoteId?: string; quote?: SparkLayerQuote; error?: string }> {
  if (!isSparkLayerConfigured()) return { success: false, error: 'SparkLayer not configured' };
  try {
    const quote = await coreFetch<SparkLayerQuote>('/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return { success: true, quoteId: quote.id, quote };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Create quote failed' };
  }
}

export async function sparkLayerUpdateQuoteStatus(
  quoteId: string,
  status: string
): Promise<{ success: boolean; quote?: SparkLayerQuote; error?: string }> {
  if (!isSparkLayerConfigured()) return { success: false, error: 'SparkLayer not configured' };
  try {
    const quote = await coreFetch<SparkLayerQuote>(`/quotes/${encodeURIComponent(quoteId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return { success: true, quote };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Update quote failed' };
  }
}

// —— Customer rules & discounts ——
export interface SparkLayerCustomerRule {
  id: string;
  customerId?: string;
  customerGroupId?: string;
  priceListSlug?: string;
  minOrderTotal?: number;
  maxOrderTotal?: number;
  minOrderQty?: number;
  paymentMethods?: string[];
  [key: string]: unknown;
}

export interface SparkLayerDiscount {
  id: string;
  code?: string;
  type?: 'percentage' | 'fixed';
  value?: number;
  minOrderTotal?: number;
  customerGroupId?: string;
  validFrom?: string;
  validTo?: string;
  [key: string]: unknown;
}

export async function sparkLayerGetCustomerRules(
  customerId?: string
): Promise<SparkLayerCustomerRule[]> {
  if (!isSparkLayerConfigured()) return [];
  try {
    const url = customerId
      ? `/customer-rules?customerId=${encodeURIComponent(customerId)}`
      : '/customer-rules';
    const data = await coreFetch<
      | SparkLayerCustomerRule[]
      | { items?: SparkLayerCustomerRule[]; data?: SparkLayerCustomerRule[] }
    >(url);
    if (Array.isArray(data)) return data;
    return data.items ?? data.data ?? [];
  } catch {
    return [];
  }
}

export async function sparkLayerGetDiscounts(params?: {
  customerId?: string;
  valid?: boolean;
}): Promise<SparkLayerDiscount[]> {
  if (!isSparkLayerConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params?.customerId) q.set('customerId', params.customerId);
    if (params?.valid != null) q.set('valid', String(params.valid));
    const url = `/discounts${q.toString() ? `?${q.toString()}` : ''}`;
    const data = await coreFetch<
      SparkLayerDiscount[] | { items?: SparkLayerDiscount[]; data?: SparkLayerDiscount[] }
    >(url);
    if (Array.isArray(data)) return data;
    return data.items ?? data.data ?? [];
  } catch {
    return [];
  }
}
