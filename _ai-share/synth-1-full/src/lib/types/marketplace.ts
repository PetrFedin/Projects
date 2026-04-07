import { Product } from '../types';

/**
 * Типы для управления B2C/B2B разделением и синхронизацией остатков
 */

// ============= B2C Marketplace Integration =============

export type MarketroomVisibility = 'hidden' | 'scheduled' | 'live' | 'soldout' | 'archived';

export interface B2CProductListing {
  id: string;
  productId: string;
  brandId: string;
  visibility: MarketroomVisibility;
  scheduledLiveDate?: string;
  scheduledArchiveDate?: string;
  b2cPrice: number;
  b2cDiscountPercent?: number;
  featured: boolean;
  marketroomCategories: string[];
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

// ============= Inventory Synchronization =============

export type StockSyncStatus = 'pending' | 'approved' | 'syncing' | 'active' | 'paused' | 'rejected';

export interface RetailerStockSync {
  id: string;
  brandId: string;
  retailerId: string;
  productId: string;
  sku: string;
  status: StockSyncStatus;
  syncEnabled: boolean;
  retailerStock: number;
  lastSyncedAt?: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface UnifiedStockView {
  productId: string;
  sku: string;
  brandId: string;
  totalAvailable: number;
  sources: StockSource[];
  reservations: StockReservation[];
}

export interface StockSource {
  type: 'brand_warehouse' | 'retail_store';
  locationId: string;
  locationName: string;
  available: number;
  reserved: number;
  address?: string;
  coordinates?: { lat: number; lng: number };
  openingHours?: string;
  allowInStorePickup?: boolean;
}

export interface StockReservation {
  id: string;
  productId: string;
  sku: string;
  quantity: number;
  sourceType: 'brand_warehouse' | 'retail_store';
  sourceId: string;
  reservedFor: 'b2b_order' | 'b2c_order' | 'preorder';
  orderId: string;
  customerId?: string;
  expiresAt: string;
  createdAt: string;
}

// ============= Client B2C Operations =============

export interface B2COrderItem {
  id: string;
  productId: string;
  sku: string;
  quantity: number;
  price: number;
  fulfillmentType: 'brand_direct' | 'retail_pickup' | 'retail_ship';
  fulfillmentLocationId?: string;
  stockSourceType: 'brand_warehouse' | 'retail_store';
  stockSourceId: string;
}

export interface B2COrder {
  id: string;
  customerId: string;
  items: B2COrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'draft' | 'pending_payment' | 'paid' | 'processing' | 'ready_for_pickup' | 'shipped' | 'delivered' | 'cancelled';
  fulfillmentMethod: 'delivery' | 'pickup';
  pickupLocationId?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============= Store Locator =============

export interface StoreLocation {
  id: string;
  type: 'brand_store' | 'retail_partner' | 'brand_warehouse';
  brandId?: string;
  retailerId?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  coordinates: { lat: number; lng: number };
  phone?: string;
  email?: string;
  openingHours: {
    [day: string]: { open: string; close: string } | null;
  };
  services: StoreService[];
  availableProducts: string[]; // Product IDs
  images?: string[];
}

export type StoreService = 
  | 'in_store_pickup'
  | 'try_on'
  | 'alterations'
  | 'personal_styling'
  | 'returns'
  | 'repairs';

// ============= Permission & Access Control =============

export interface B2CAccessPermissions {
  canViewAllProducts: boolean;
  canManageOwnProducts: boolean;
  canViewOtherBrandsProducts: boolean;
  canCreateB2CListing: boolean;
  canScheduleB2CListing: boolean;
  canEditB2CPrice: boolean;
  canViewUnifiedStock: boolean;
  canApproveStockSync: boolean;
  canViewB2COrders: boolean;
  canFulfillB2COrders: boolean;
}

export interface B2BAccessPermissions {
  canViewAllWholesale: boolean;
  canManageOwnWholesale: boolean;
  canCreateB2BOrder: boolean;
  canNegotiateTerms: boolean;
  canRequestStockSync: boolean;
  canViewBrandStock: boolean;
  canShareRetailStock: boolean;
}

export interface RolePermissions {
  roleType: 'brand' | 'shop' | 'client' | 'admin';
  organizationId: string;
  b2c: B2CAccessPermissions;
  b2b: B2BAccessPermissions;
}

// ============= Sync Agreement =============

export interface StockSyncAgreement {
  id: string;
  brandId: string;
  retailerId: string;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  scope: {
    allProducts: boolean;
    specificProducts?: string[];
    categories?: string[];
  };
  terms: {
    syncFrequency: 'realtime' | 'hourly' | 'daily';
    minimumStock: number;
    autoReserve: boolean;
    commissionPercent?: number;
    fulfillmentResponsibility: 'retailer' | 'brand' | 'shared';
  };
  startDate: string;
  endDate?: string;
  signedByBrand?: string;
  signedByRetailer?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Analytics =============

export interface B2CPerformanceMetrics {
  brandId: string;
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    sales: number;
    quantity: number;
  }>;
  salesBySource: {
    brand_direct: number;
    retail_pickup: number;
    retail_ship: number;
  };
  customerAcquisition: {
    new: number;
    returning: number;
  };
}

export interface StockSyncAnalytics {
  agreementId: string;
  totalSyncedProducts: number;
  totalSyncedStock: number;
  syncSuccessRate: number;
  lastSyncErrors: Array<{
    productId: string;
    error: string;
    timestamp: string;
  }>;
  fulfillmentMetrics: {
    ordersFromRetailStock: number;
    averageFulfillmentTime: number;
  };
}
