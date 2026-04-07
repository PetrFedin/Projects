/**
 * Headless Commerce API Types & Config
 */

export interface APIKey {
  id: string;
  name: string;
  key: string; // Restricted/Masked in UI
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
  permissions: ('read_products' | 'manage_orders' | 'view_inventory' | 'customer_data')[];
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: ('order.created' | 'order.updated' | 'inventory.low' | 'product.published')[];
  secret: string;
  status: 'active' | 'failed';
}

export interface APIDocumentation {
  version: string;
  baseUrl: string;
  endpoints: APIEndpoint[];
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  params?: Record<string, string>;
}
