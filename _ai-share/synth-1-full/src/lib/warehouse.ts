/**
 * Warehouse / Inventory types and helpers.
 * Связь с Production, B2B, маркировкой.
 */

export type WarehouseLocation = 'main' | 'retailer' | 'factory' | 'transit';

export interface InventoryItem {
  skuId: string;
  size: string;
  color: string;
  qty: number;
  location: WarehouseLocation;
  locationId?: string;
  reserved?: number;
  kiz?: string[];
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  skuId: string;
  type: 'in' | 'out' | 'transfer' | 'adjust' | 'reserve' | 'release';
  qty: number;
  fromLocation?: string;
  toLocation?: string;
  documentRef?: string;
  createdAt: string;
  userId?: string;
}

export function getAvailableQty(item: InventoryItem): number {
  return Math.max(0, (item.qty ?? 0) - (item.reserved ?? 0));
}
